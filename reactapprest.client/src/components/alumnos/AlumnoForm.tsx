import React, { useState } from 'react';
import type { AlumnoForm as AlumnoFormType } from '../../types/alumnoTypes';
import { AlumnoUploadWizard } from './AlumnoUploadWizard';

interface AlumnoFormProps {
    form: AlumnoFormType;
    isEditing: boolean;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/CaAlumnos`;

export const AlumnoForm: React.FC<AlumnoFormProps> = ({
    form,
    isEditing,
    loading,
    onSubmit,
    onCancel,
    onChange,
}) => {
    const [showUpload, setShowUpload] = useState(false);

    const openUploadPopup = () => {
        const url = '/upload-wizard?popup=1';
        const width = 900;
        const height = 700;
        const left = Math.max(0, Math.round((screen.width - width) / 2));
        const top = Math.max(0, Math.round((screen.height - height) / 2));
        const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

        const popup = window.open(url, 'AlumnoUploadWizard', features);

        if (!popup) {
            console.warn('Popup blocked, opening inline wizard.');
            setShowUpload(true);
            return;
        }

        const onMessage = (ev: MessageEvent) => {
            if (ev.origin !== window.location.origin) return;
            const msg = ev.data;
            if (!msg || typeof msg !== 'object') return;

            if (msg.type === 'ready') {
                try {
                    popup.postMessage({ type: 'init', apiBase: API_BASE }, window.location.origin);
                } catch {
                    // ignore
                }
            } else if (msg.type === 'upload:finished') {
                try {
                    window.location.reload();
                } catch {
                    // fallback: do nothing
                } finally {
                    window.removeEventListener('message', onMessage);
                }
            } else if (msg.type === 'upload:closed') {
                window.removeEventListener('message', onMessage);
            }
        };

        window.addEventListener('message', onMessage);

        const interval = window.setInterval(() => {
            if (!popup || popup.closed) {
                window.clearInterval(interval);
                window.removeEventListener('message', onMessage);
            }
        }, 500);
    };

    return (
        <div>
            <form onSubmit={onSubmit} className="border rounded p-4 mb-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">{isEditing ? "Editar Alumno" : "Agregar Alumno"}</h5>
                    <div>
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={openUploadPopup}
                        >
                            Subir
                        </button>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre"
                            name="caAlumTNombre"
                            value={form.caAlumTNombre}
                            onChange={onChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Apellido Paterno"
                            name="caAlumTApellidoPaterno"
                            value={form.caAlumTApellidoPaterno}
                            onChange={onChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Apellido Materno"
                            name="caAlumTApellidoMaterno"
                            value={form.caAlumTApellidoMaterno}
                            onChange={onChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tel&eacute;fono"
                            name="caAlumTTelefono"
                            value={form.caAlumTTelefono}
                            onChange={onChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="ID de Grado"
                            name="caGradNId"
                            value={form.caGradNId}
                            onChange={onChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="col-md-4 d-flex align-items-center">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="bActivo"
                                name="bActivo"
                                checked={!!form.bActivo}
                                onChange={onChange}
                                disabled={loading}
                            />
                            <label className="form-check-label" htmlFor="bActivo">
                                Activo
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-3 text-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : (isEditing ? "Actualizar" : "Agregar")}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {showUpload && (
                <AlumnoUploadWizard
                    onClose={() => setShowUpload(false)}
                    apiBase={API_BASE}
                />
            )}
        </div>
    );
};