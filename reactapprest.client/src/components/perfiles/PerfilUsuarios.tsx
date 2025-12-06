import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUsuariosPorPerfil } from '../../services/perfilService';
import type { Usuario } from '../../types/usuarioTypes';

const PerfilUsuarios: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchUsuarios = async () => {
                try {
                    setLoading(true);
                    const data = await getUsuariosPorPerfil(Number(id));
                    setUsuarios(data);
                } catch (err) {
                    setError((err as Error).message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUsuarios();
        }
    }, [id]);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Usuarios del Perfil</h2>
                <Link to="/perfiles" className="btn btn-secondary">
                    Volver a Perfiles
                </Link>
            </div>

            <table className="table table-striped table-bordered">
                <thead className="table-primary">
                    <tr>
                        <th>Nombre de Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Activo</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.usuarioId}>
                            <td>{u.usuarioNombre}</td>
                            <td>{`${u.usuarioApPat || ''} ${u.usuarioApMat || ''}`}</td>
                            <td>{u.usuarioActivo ? 'Sí' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {usuarios.length === 0 && <p className="text-center">No hay usuarios asignados a este perfil.</p>}
        </div>
    );
};

export default PerfilUsuarios;