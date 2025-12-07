import type { Alumno, AlumnoCreate, AlumnoUpdate } from '../types/alumnoTypes';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/CaAlumnos`;

export const getAlumnos = async (): Promise<Alumno[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch alumnos');
    }
    return response.json();
};

export const createAlumno = async (alumno: AlumnoCreate): Promise<Alumno> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno),
    });
    if (!response.ok) {
        throw new Error('Failed to create alumno');
    }
    return response.json();
};

export const updateAlumno = async (id: number, alumno: AlumnoUpdate): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno),
    });
    if (!response.ok) {
        throw new Error('Failed to update alumno');
    }
};

export const deleteAlumno = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete alumno');
    }
};