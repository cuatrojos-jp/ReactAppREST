import React from "react";
import type { Grado } from "../../types/gradoTypes";

interface GradoListProps {
    grados: Grado[];
    onEdit: (grado: Grado) => void;
    onDelete: (id: number) => void;
}

const GradoList: React.FC<GradoListProps> = ({ grados, onEdit, onDelete }) => {
    return (
        <>
            <table className="table table-striped table-bordered align-middle shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {grados.map((g) => (
                        <tr key={g.caGradNId}>
                            <td>{g.caGradTDescripcion}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => onEdit(g)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => onDelete(g.caGradNId)}
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
        </>
    );
};

export default GradoList;