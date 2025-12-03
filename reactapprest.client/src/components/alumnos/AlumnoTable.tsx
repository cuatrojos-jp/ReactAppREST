import React from 'react';
import type { Alumno } from '../../types/alumnoTypes';

interface AlumnoTableProps {
    alumnos: Alumno[];
    loading: boolean;
    onEdit: (alumno: Alumno) => void;
    onDelete: (id: number) => void;
}

export const AlumnoTable: React.FC<AlumnoTableProps> = ({
    alumnos,
    loading,
    onEdit,
    onDelete,
}) => {
    const handleDelete = (id: number) => {
        if (confirm("¿Desea eliminar este alumno?")) {
            onDelete(id);
        }
    };

    return (
        <>
            <table className="table table-striped table-bordered align-middle shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Tel&eacute;fono</th>
                        <th>Grado</th>
                        <th>Activo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map((alumno) => (
                        <tr key={alumno.caAlumNId}>
                            <td>
                                {alumno.caAlumTNombre} {alumno.caAlumTApellidoPaterno} {alumno.caAlumTApellidoMaterno}
                            </td>
                            <td>{alumno.caAlumTTelefono}</td>
                            <td>{alumno.gradoDescripcion ?? "-"}</td>
                            <td>{alumno.bActivo ? "S\u00ED" : "No"}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => onEdit(alumno)}
                                    disabled={loading}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(alumno.caAlumNId)}
                                    disabled={loading}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {alumnos.length === 0 && !loading && (
                <p className="text-center mt-3">No hay alumnos registrados.</p>
            )}
        </>
    );
};