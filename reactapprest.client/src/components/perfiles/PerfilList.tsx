import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import type { Perfil } from '../../types/perfilTypes';

interface Props {
    perfiles: Perfil[];
    onEdit: (perfil: Perfil) => void;
    onDelete: (id: number) => void;
}

const PerfilList: React.FC<Props> = ({ perfiles, onEdit, onDelete }) => {
    return (
        <table className="table table-striped table-bordered align-middle shadow-sm">
            <thead className="table-primary">
                <tr>
                    <th>Nombre del Perfil</th>
                    <th>Usuarios Asignados</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {perfiles.map((p) => (
                    <tr key={p.perfilId}>
                        <td>{p.perfilNombre}</td>
                        <td>
                            <Link to={`/perfiles/${p.perfilId}/usuarios`}>
                                {p.usuariosCount}
                            </Link>
                        </td>
                        <td>{p.perfilActivo ? 'Sí' : 'No'}</td>
                        <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(p)}>
                                Editar
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(p.perfilId)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PerfilList;