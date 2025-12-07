import React, { useState } from 'react';
import { useUsuarios } from '../../hooks/useUsuarios';
import UsuarioList from './UsuarioList';
import UsuarioForm from './UsuarioForm';
import type { Usuario, UsuarioForm as UsuarioFormData } from '../../types/usuarioTypes';

const Usuarios: React.FC = () => {
    const { usuarios, perfiles, loading, error, handleAdd, handleUpdate, handleDelete } = useUsuarios();
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleEdit = (usuario: Usuario) => {
        setEditingUsuario(usuario);
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingUsuario(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setEditingUsuario(null);
        setIsFormVisible(false);
    };

    const handleCreateSubmit = (form: UsuarioFormData) => {
        handleAdd(form);
        setIsFormVisible(false);
    };

    const handleUpdateSubmit = (id: number, form: UsuarioFormData) => {
        handleUpdate(id, form);
        setIsFormVisible(false);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gesti&oacute;n de Usuarios</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    Agregar Usuario
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Cargando...</p>}

            {isFormVisible && (
                <UsuarioForm
                    onSubmit={handleCreateSubmit}
                    onUpdate={handleUpdateSubmit}
                    onCancel={handleCancel}
                    editingUsuario={editingUsuario}
                    perfiles={perfiles}
                />
            )}

            {!loading && !error && (
                <UsuarioList usuarios={usuarios} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default Usuarios;