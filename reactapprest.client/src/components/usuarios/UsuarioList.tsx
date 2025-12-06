import React from 'react';
import type { Usuario } from '../../types/usuarioTypes';

interface Props {
    usuarios: Usuario[];
    onEdit: (usuario: Usuario) => void;
    onDelete: (id: number) => void;
}

const UsuarioList: React.FC<Props> = ({ usuarios, onEdit, onDelete }) => {
    return (
        <table className="table table-striped table-bordered align-middle shadow-sm">
            <thead className="table-primary">
                <tr>
                    <th>Nombre de Usuario</th>
                    <th>Nombre Completo</th>
                    <th>Activo</th>
                    <th>Perfiles</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((u) => (
                    <tr key={u.usuarioId}>
                        <td>{u.usuarioNombre}</td>
                        <td>{`${u.usuarioApPat || ''} ${u.usuarioApMat || ''}`}</td>
                        <td>{u.usuarioActivo ? 'S\u00ED' : 'No'}</td>
                        <td>{u.perfilIds.length}</td>
                        <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(u)}>
                                Editar
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(u.usuarioId)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsuarioList;