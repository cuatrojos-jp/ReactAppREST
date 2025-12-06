import React, { useState, useEffect } from "react";
import type { Grado, GradoForm as GradoFormData } from "../../types/gradoTypes";

interface GradoFormProps {
    onSubmit: (form: GradoFormData) => void;
    onUpdate: (id: number, form: GradoFormData) => void;
    onCancel: () => void;
    editingGrado: Grado | null;
}

const GradoForm: React.FC<GradoFormProps> = ({ onSubmit, onUpdate, onCancel, editingGrado }) => {
    const [form, setForm] = useState<GradoFormData>({ caGradTDescripcion: "" });
    const isEditing = !!editingGrado;

    useEffect(() => {
        if (editingGrado) {
            setForm({ caGradTDescripcion: editingGrado.caGradTDescripcion });
        } else {
            setForm({ caGradTDescripcion: "" });
        }
    }, [editingGrado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingGrado) {
            onUpdate(editingGrado.caGradNId, form);
        } else {
            onSubmit(form);
        }
    };

    return (
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
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default GradoForm;