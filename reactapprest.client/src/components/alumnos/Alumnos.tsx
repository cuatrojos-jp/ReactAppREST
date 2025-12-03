import React, { useState } from 'react';
import { useAlumnos } from '../../hooks/useAlumnos';
import { AlumnoForm } from './AlumnoForm';
import { AlumnoTable } from './AlumnoTable';
import { ErrorAlert } from '../ui/ErrorAlert';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { AlumnoForm as AlumnoFormType, Alumno } from '../../types/alumnoTypes';

const initialFormState: AlumnoFormType = {
    caAlumTNombre: "",
    caAlumTApellidoPaterno: "",
    caAlumTApellidoMaterno: "",
    caAlumTTelefono: "",
    caGradNId: 0,
    bActivo: true,
};

export const Alumnos: React.FC = () => {
    const {
        alumnos,
        loading,
        error,
        createAlumno,
        updateAlumno,
        deleteAlumno,
        setError,
    } = useAlumnos();

    const [form, setForm] = useState<AlumnoFormType>(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const key = name as keyof AlumnoFormType;

        if (type === "checkbox") {
            setForm(prev => ({ ...prev, [key]: checked } as AlumnoFormType));
            return;
        }

        if (key === "caGradNId") {
            setForm(prev => ({ ...prev, [key]: Number(value) } as AlumnoFormType));
            return;
        }

        setForm(prev => ({ ...prev, [key]: value } as AlumnoFormType));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = isEditing && editId
            ? await updateAlumno(editId, form)
            : await createAlumno(form);

        if (success) {
            resetForm();
        }
    };

    const handleEdit = (alumno: Alumno) => {
        setForm({
            caAlumTNombre: alumno.caAlumTNombre,
            caAlumTApellidoPaterno: alumno.caAlumTApellidoPaterno,
            caAlumTApellidoMaterno: alumno.caAlumTApellidoMaterno,
            caAlumTTelefono: alumno.caAlumTTelefono,
            caGradNId: alumno.caGradNId,
            bActivo: alumno.bActivo ?? true,
        });
        setEditId(alumno.caAlumNId);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        await deleteAlumno(id);
    };

    const resetForm = () => {
        setForm(initialFormState);
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Gesti&oacute;n de Alumnos</h2>

            <ErrorAlert message={error} onDismiss={() => setError(null)} />

            {loading && <LoadingSpinner />}

            <AlumnoForm
                form={form}
                isEditing={isEditing}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                onChange={handleChange}
            />

            <AlumnoTable
                alumnos={alumnos}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Alumnos;