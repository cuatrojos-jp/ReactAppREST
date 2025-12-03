//import React, { useEffect, useState } from "react";

//interface Alumno {
//    caAlumNId: number;
//    caAlumTNombre: string;
//    caAlumTApellidoMaterno: string;
//    caAlumTApellidoPaterno: string;
//    caAlumTTelefono: string;
//    caGradNId: number;
//    gradoDescripcion: string | null;
//    bActivo: boolean | null;
//}

//type AlumnoForm = Omit<Alumno, "caAlumNId" | "gradoDescripcion">;

//const API_URL = "https://localhost:7231/api/CaAlumnos";

//const Alumnos = () => {
//    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
//    const [form, setForm] = useState<AlumnoForm>({
//        caAlumTNombre: "",
//        caAlumTApellidoPaterno: "",
//        caAlumTApellidoMaterno: "",
//        caAlumTTelefono: "",
//        caGradNId: 0,
//        bActivo: true,
//    });
//    const [isEditing, setIsEditing] = useState(false);
//    const [editId, setEditId] = useState<number | null>(null);
//    const [loading, setLoading] = useState(false);
//    const [error, setError] = useState<string | null>(null);

//    // Fetch data
//    const fetchAlumnos = async () => {
//        setLoading(true);
//        setError(null);
//        try {
//            const response = await fetch(API_URL);
//            //const response = await fetch('/api/CaAlumnos');

//            if (!response.ok) {
//                throw new Error(`Error: ${response.status} ${response.statusText}`);
//            }

//            const data = await response.json();
//            setAlumnos(data);
//        } catch (error) {
//            console.error("Error fetching alumnos:", error);
//            setError("Error al cargar los alumnos");
//        } finally {
//            setLoading(false);
//        }
//    };

//    useEffect(() => {
//        fetchAlumnos();
//    }, []);

//    // Handle form changes (supports checkbox)
//    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//        const { name, value, type, checked } = e.target;
//        const key = name as keyof AlumnoForm;

//        if (type === "checkbox") {
//            setForm(prev => ({ ...prev, [key]: checked } as AlumnoForm));
//            return;
//        }

//        if (key === "caGradNId") {
//            setForm(prev => ({ ...prev, [key]: Number(value) } as AlumnoForm));
//            return;
//        }

//        setForm(prev => ({ ...prev, [key]: value } as AlumnoForm));
//    };

//    // Add or update alumno
//    const handleSubmit = async (e: React.FormEvent) => {
//        e.preventDefault();
//        setLoading(true);
//        setError(null);

//        try {
//            const url = isEditing && editId ? `${API_URL}/${editId}` : API_URL;
//            const method = isEditing ? "PUT" : "POST";

//            const requestBody = isEditing
//                ? { caAlumNId: editId, ...form }
//                : form;

//            const response = await fetch(url, {
//                method: method,
//                headers: {
//                    "Content-Type": "application/json",
//                },
//                body: JSON.stringify(requestBody),
//            });

//            if (!response.ok) {
//                throw new Error(`Error: ${response.status} ${response.statusText}`);
//            }

//            // Reset form
//            setForm({
//                caAlumTNombre: "",
//                caAlumTApellidoPaterno: "",
//                caAlumTApellidoMaterno: "",
//                caAlumTTelefono: "",
//                caGradNId: 0,
//                bActivo: true,
//            });
//            setIsEditing(false);
//            setEditId(null);
//            fetchAlumnos();
//        } catch (error) {
//            console.error("Error saving alumno:", error);
//            setError("Error al guardar el alumno");
//        } finally {
//            setLoading(false);
//        }
//    };

//    // Edit
//    const handleEdit = (alumno: Alumno) => {
//        setForm({
//            caAlumTNombre: alumno.caAlumTNombre,
//            caAlumTApellidoPaterno: alumno.caAlumTApellidoPaterno,
//            caAlumTApellidoMaterno: alumno.caAlumTApellidoMaterno,
//            caAlumTTelefono: alumno.caAlumTTelefono,
//            caGradNId: alumno.caGradNId,
//            bActivo: alumno.bActivo ?? true,
//        });
//        setEditId(alumno.caAlumNId);
//        setIsEditing(true);
//    };

//    // Delete
//    const handleDelete = async (id: number) => {
//        if (!confirm("¿Desea eliminar este alumno?")) return;

//        setLoading(true);
//        setError(null);

//        try {
//            const response = await fetch(`${API_URL}/${id}`, {
//                method: "DELETE",
//            });

//            if (!response.ok) {
//                throw new Error(`Error: ${response.status} ${response.statusText}`);
//            }

//            fetchAlumnos();
//        } catch (error) {
//            console.error("Error deleting alumno:", error);
//            setError("Error al eliminar el alumno");
//        } finally {
//            setLoading(false);
//        }
//    };

//    return (
//        <div className="container mt-4">
//            <h2 className="text-center mb-4">Gesti&oacute;n de Alumnos</h2>

//            {/* Error Message */}
//            {error && (
//                <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                    {error}
//                    <button
//                        type="button"
//                        className="btn-close"
//                        onClick={() => setError(null)}
//                    ></button>
//                </div>
//            )}

//            {/* Loading Indicator */}
//            {loading && (
//                <div className="text-center">
//                    <div className="spinner-border text-primary" role="status">
//                        <span className="visually-hidden">Cargando...</span>
//                    </div>
//                </div>
//            )}

//            {/* Form */}
//            <form onSubmit={handleSubmit} className="border rounded p-4 mb-5 shadow-sm">
//                <h5 className="mb-3">{isEditing ? "Editar Alumno" : "Agregar Alumno"}</h5>

//                <div className="row g-3">
//                    <div className="col-md-4">
//                        <input
//                            type="text"
//                            className="form-control"
//                            placeholder="Nombre"
//                            name="caAlumTNombre"
//                            value={form.caAlumTNombre}
//                            onChange={handleChange}
//                            required
//                            disabled={loading}
//                        />
//                    </div>
//                    <div className="col-md-4">
//                        <input
//                            type="text"
//                            className="form-control"
//                            placeholder="Apellido Paterno"
//                            name="caAlumTApellidoPaterno"
//                            value={form.caAlumTApellidoPaterno}
//                            onChange={handleChange}
//                            required
//                            disabled={loading}
//                        />
//                    </div>
//                    <div className="col-md-4">
//                        <input
//                            type="text"
//                            className="form-control"
//                            placeholder="Apellido Materno"
//                            name="caAlumTApellidoMaterno"
//                            value={form.caAlumTApellidoMaterno}
//                            onChange={handleChange}
//                            disabled={loading}
//                        />
//                    </div>
//                    <div className="col-md-4">
//                        <input
//                            type="text"
//                            className="form-control"
//                            placeholder="Tel&eacute;fono"
//                            name="caAlumTTelefono"
//                            value={form.caAlumTTelefono}
//                            onChange={handleChange}
//                            disabled={loading}
//                        />
//                    </div>
//                    <div className="col-md-4">
//                        <input
//                            type="number"
//                            className="form-control"
//                            placeholder="ID de Grado"
//                            name="caGradNId"
//                            value={form.caGradNId}
//                            onChange={handleChange}
//                            required
//                            disabled={loading}
//                        />
//                    </div>

//                    {/* Checkbox for bActivo */}
//                    <div className="col-md-4 d-flex align-items-center">
//                        <div className="form-check">
//                            <input
//                                className="form-check-input"
//                                type="checkbox"
//                                id="bActivo"
//                                name="bActivo"
//                                checked={!!form.bActivo}
//                                onChange={handleChange}
//                                disabled={loading}
//                            />
//                            <label className="form-check-label" htmlFor="bActivo">
//                                Activo
//                            </label>
//                        </div>
//                    </div>
//                </div>

//                <div className="mt-3 text-end">
//                    <button
//                        type="submit"
//                        className="btn btn-primary"
//                        disabled={loading}
//                    >
//                        {loading ? "Procesando..." : (isEditing ? "Actualizar" : "Agregar")}
//                    </button>
//                    {isEditing && (
//                        <button
//                            type="button"
//                            className="btn btn-secondary ms-2"
//                            onClick={() => {
//                                setIsEditing(false);
//                                setEditId(null);
//                                setForm({
//                                    caAlumTNombre: "",
//                                    caAlumTApellidoPaterno: "",
//                                    caAlumTApellidoMaterno: "",
//                                    caAlumTTelefono: "",
//                                    caGradNId: 0,
//                                    bActivo: true,
//                                });
//                            }}
//                            disabled={loading}
//                        >
//                            Cancelar
//                        </button>
//                    )}
//                </div>
//            </form>

//            {/* Table */}
//            <table className="table table-striped table-bordered align-middle shadow-sm">
//                <thead className="table-primary">
//                    <tr>
//                        {/*<th>ID</th>*/}
//                        <th>Nombre Completo</th>
//                        <th>Tel&eacute;fono</th>
//                        <th>Grado</th>
//                        <th>Activo</th>
//                        <th>Acciones</th>
//                    </tr>
//                </thead>
//                <tbody>
//                    {alumnos.map((a) => (
//                        <tr key={a.caAlumNId}>
//                            {/*<td>{a.caAlumNId}</td>*/}
//                            <td>
//                                {a.caAlumTNombre} {a.caAlumTApellidoPaterno} {a.caAlumTApellidoMaterno}
//                            </td>
//                            <td>{a.caAlumTTelefono}</td>
//                            <td>{a.gradoDescripcion ?? "-"}</td>
//                            <td>{a.bActivo ? "S\u00ED" : "No"}</td>
//                            <td>
//                                <button
//                                    className="btn btn-sm btn-warning me-2"
//                                    onClick={() => handleEdit(a)}
//                                    disabled={loading}
//                                >
//                                    Editar
//                                </button>
//                                <button
//                                    className="btn btn-sm btn-danger"
//                                    onClick={() => handleDelete(a.caAlumNId)}
//                                    disabled={loading}
//                                >
//                                    Eliminar
//                                </button>
//                            </td>
//                        </tr>
//                    ))}
//                </tbody>
//            </table>

//            {alumnos.length === 0 && !loading && (
//                <p className="text-center mt-3">No hay alumnos registrados.</p>
//            )}
//        </div>
//    );
//};

//export default Alumnos;