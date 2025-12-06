import React, { useState, useEffect } from 'react';
import type { Perfil, PerfilForm as PerfilFormData } from '../../types/perfilTypes';

interface Props {
    onSubmit: (form: PerfilFormData) => void;
    onUpdate: (id: number, form: PerfilFormData) => void;
    onCancel: () => void;
    editingPerfil: Perfil | null;
}

const initialFormState: PerfilFormData = {
    perfilNombre: '',
    perfilActivo: true,
};

const PerfilForm: React.FC<Props> = ({ onSubmit, onUpdate, onCancel, editingPerfil }) => {
    const [form, setForm] = useState<PerfilFormData>(initialFormState);
    const isEditing = !!editingPerfil;

    useEffect(() => {
        if (editingPerfil) {
            setForm({
                perfilNombre: editingPerfil.perfilNombre,
                perfilActivo: editingPerfil.perfilActivo,
            });
        } else {
            setForm(initialFormState);
        }
    }, [editingPerfil]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingPerfil) {
            onUpdate(editingPerfil.perfilId, form);
        } else {
            onSubmit(form);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded p-4 mb-5 shadow-sm">
            <h5 className="mb-3">{isEditing ? 'Editar Perfil' : 'Agregar Perfil'}</h5>
            <div className="row g-3 align-items-center">
                <div className="col-md-6">
                    <input type="text" name="perfilNombre" value={form.perfilNombre} onChange={handleChange} className="form-control" placeholder="Nombre del Perfil" required />
                </div>
                <div className="col-md-2">
                    <div className="form-check">
                        <input type="checkbox" name="perfilActivo" checked={form.perfilActivo} onChange={handleChange} className="form-check-input" id="perfilActivoCheck" />
                        <label className="form-check-label" htmlFor="perfilActivoCheck">Activo</label>
                    </div>
                </div>
                <div className="col-md-4 text-end">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </form>
    );
};

export default PerfilForm;