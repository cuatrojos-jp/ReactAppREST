import React, { useEffect, useState } from "react";

interface Grado {
    caGradNId: number;
    caGradTDescripcion: string;
}

const API_URL = "https://localhost:7231/api/CaGrados";

const Grados: React.FC = () => {
    const [grados, setGrados] = useState<Grado[]>([]);
    const [form, setForm] = useState<Omit<Grado, "caGradNId">>({
        caGradTDescripcion: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    //const [loading, setLoading] = useState(false);
    //const [error, setError] = useState<string | null>(null);

    const fetchGrados = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Error al obtener los grados");
            const data = await res.json();
            setGrados(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGrados();
    }, []);

    // Form change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add or edit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //setLoading(true);
        //setError(null);
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `${API_URL}/${editId}` : API_URL;

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caGradNId: editId,
                    ...form,
                }),
            });

            if (!res.ok) throw new Error("Error al guardar el grado");

            setForm({ caGradTDescripcion: "" });
            setIsEditing(false);
            setEditId(null);
            fetchGrados();
        } catch (error) {
            console.error(error);
            //console.error("Error saving alumno:", error);
            //setError("Error al guardar el alumno");
        } finally {
            /*setLoading(false)*/
        }

    };

    // Edit button
    const handleEdit = (grado: Grado) => {
        setForm({ caGradTDescripcion: grado.caGradTDescripcion });
        setEditId(grado.caGradNId);
        setIsEditing(true);
    };

    // Delete button
    const handleDelete = async (id: number) => {
        if (!confirm("¿Desea eliminar este grado?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al eliminar el grado");
            fetchGrados();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Gesti&oacute;n de Grados</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="border rounded p-4 mb-5 shadow-sm">
                <h5 className="mb-3">{isEditing ? "Editar Grado" : "Agregar Grado"}</h5>

                <div className="row g-3 align-items-center">
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Descripci&oacute;n del Grado"
                            name="caGradTDescripcion"
                            value={form.caGradTDescripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 text-end">
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? "Actualizar" : "Agregar"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditId(null);
                                    setForm({ caGradTDescripcion: "" });
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Tabla */}
            <table className="table table-striped table-bordered align-middle shadow-sm">
                <thead className="table-primary">
                    <tr>
                        {/*<th>ID</th>*/}
                        <th>Descripci&oacute;n</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {grados.map((g) => (
                        <tr key={g.caGradNId}>
                            {/*<td>{g.caGradNId}</td>*/}
                            <td>{g.caGradTDescripcion}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleEdit(g)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(g.caGradNId)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {grados.length === 0 && (
                <p className="text-center mt-3">No hay grados registrados.</p>
            )}
        </div>
    );
};

export default Grados;
