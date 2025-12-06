import React, { useState } from "react";
import { useGrados } from "../../hooks/useGrados";
import GradoList from "./GradoList";
import GradoForm from "./GradoForm";
import type { Grado, GradoForm as GradoFormData } from "../../types/gradoTypes";

const Grados: React.FC = () => {
    const { grados, error, handleAdd, handleUpdate, handleDelete } = useGrados();
    const [editingGrado, setEditingGrado] = useState<Grado | null>(null);

    const handleEdit = (grado: Grado) => {
        setEditingGrado(grado);
    };

    const handleCancel = () => {
        setEditingGrado(null);
    };

    const handleFormSubmit = (form: GradoFormData) => {
        handleAdd(form);
        setEditingGrado(null);
    };

    const handleFormUpdate = (id: number, form: GradoFormData) => {
        handleUpdate(id, form);
        setEditingGrado(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Gesti&oacute;n de Grados</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <GradoForm
                onSubmit={handleFormSubmit}
                onUpdate={handleFormUpdate}
                onCancel={handleCancel}
                editingGrado={editingGrado}
            />

            <GradoList
                grados={grados}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Grados;