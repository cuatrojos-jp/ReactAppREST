import React, { useState } from 'react';
import { usePerfiles } from '../../hooks/usePerfiles';
import PerfilList from './PerfilList';
import PerfilForm from './PerfilForm';
import type { Perfil, PerfilForm as PerfilFormData } from '../../types/perfilTypes';

const Perfiles: React.FC = () => {
    const { perfiles, loading, error, handleAdd, handleUpdate, handleDelete } = usePerfiles();
    const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleEdit = (perfil: Perfil) => {
        setEditingPerfil(perfil);
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingPerfil(null);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setEditingPerfil(null);
        setIsFormVisible(false);
    };

    // CORRECCIÓN: Separamos la lógica de creación y actualización
    const handleCreateSubmit = (form: PerfilFormData) => {
        handleAdd(form);
        setIsFormVisible(false);
    };

    const handleUpdateSubmit = (id: number, form: PerfilFormData) => {
        handleUpdate(id, form);
        setIsFormVisible(false);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Perfiles</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    Agregar Perfil
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Cargando...</p>}

            {isFormVisible && (
                <PerfilForm
                    onSubmit={handleCreateSubmit}
                    onUpdate={handleUpdateSubmit}
                    onCancel={handleCancel}
                    editingPerfil={editingPerfil}
                />
            )}

            {!loading && !error && (
                <PerfilList perfiles={perfiles} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default Perfiles;