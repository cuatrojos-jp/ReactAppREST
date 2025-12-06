import React, { useState, useEffect } from 'react';
import type { Usuario, UsuarioForm as UsuarioFormData, Perfil } from '../../types/usuarioTypes';

interface Props {
    onSubmit: (form: UsuarioFormData) => void;
    onUpdate: (id: number, form: UsuarioFormData) => void;
    onCancel: () => void;
    editingUsuario: Usuario | null;
    perfiles: Perfil[];
}

const initialFormState: UsuarioFormData = {
    usuarioNombre: '',
    usuarioApPat: '',
    usuarioApMat: '',
    usuarioPw: '',
    usuarioActivo: true,
    perfilIds: [],
};

const UsuarioForm: React.FC<Props> = ({ onSubmit, onUpdate, onCancel, editingUsuario, perfiles }) => {
    const [form, setForm] = useState<UsuarioFormData>(initialFormState);
    const isEditing = !!editingUsuario;

    useEffect(() => {
        if (editingUsuario) {
            setForm({
                usuarioNombre: editingUsuario.usuarioNombre || '',
                usuarioApPat: editingUsuario.usuarioApPat || '',
                usuarioApMat: editingUsuario.usuarioApMat || '',
                usuarioActivo: editingUsuario.usuarioActivo ?? true,
                perfilIds: editingUsuario.perfilIds || [],
                usuarioPw: '', // La contraseña se deja en blanco por seguridad
            });
        } else {
            setForm(initialFormState);
        }
    }, [editingUsuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePerfilChange = (perfilId: number) => {
        setForm(prev => {
            const newPerfilIds = prev.perfilIds.includes(perfilId)
                ? prev.perfilIds.filter(id => id !== perfilId) // Si ya está, lo quita
                : [...prev.perfilIds, perfilId]; // Si no está, lo añade
            return { ...prev, perfilIds: newPerfilIds };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingUsuario) {
            const { usuarioPw, ...rest } = form;
            const dataToSend = usuarioPw ? form : rest;
            onUpdate(editingUsuario.usuarioId, dataToSend as UsuarioFormData);
        } else {
            onSubmit(form);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded p-4 mb-5 shadow-sm">
            <h5 className="mb-3">{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
            <div className="row g-3">
                {/* Campos del formulario */}
                <div className="col-md-4">
                    <input type="text" name="usuarioNombre" value={form.usuarioNombre || ''} onChange={handleChange} className="form-control" placeholder="Nombre de Usuario" required />
                </div>
                <div className="col-md-4">
                    <input type="text" name="usuarioApPat" value={form.usuarioApPat || ''} onChange={handleChange} className="form-control" placeholder="Apellido Paterno" />
                </div>
                <div className="col-md-4">
                    <input type="text" name="usuarioApMat" value={form.usuarioApMat || ''} onChange={handleChange} className="form-control" placeholder="Apellido Materno" />
                </div>
                <div className="col-md-4">
                    <input type="password" name="usuarioPw" value={form.usuarioPw || ''} onChange={handleChange} className="form-control" placeholder={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"} required={!isEditing} />
                </div>

                {/* Tabla de Perfiles con Scroll */}
                <div className="col-md-4">
                    <h6>Perfiles</h6>
                    <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        <table className="table table-sm table-hover">
                            <tbody>
                                {perfiles.map(perfil => (
                                    <tr key={perfil.perfilId} onClick={() => handlePerfilChange(perfil.perfilId)} style={{ cursor: 'pointer' }}>
                                        <td>{perfil.perfilNombre}</td>
                                        <td className="text-end">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={form.perfilIds.includes(perfil.perfilId)}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {perfiles.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="text-muted text-center">No hay perfiles activos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-4 d-flex align-items-center">
                    <div className="form-check">
                        <input type="checkbox" name="usuarioActivo" checked={form.usuarioActivo ?? false} onChange={handleChange} className="form-check-input" id="usuarioActivoCheck" />
                        <label className="form-check-label" htmlFor="usuarioActivoCheck">Activo</label>
                    </div>
                </div>
            </div>
            <div className="mt-3 text-end">
                <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};

export default UsuarioForm;