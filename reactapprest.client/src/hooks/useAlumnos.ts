import { useState, useEffect, useCallback } from 'react';
import { alumnoService } from '../services/alumnoService';
import type { Alumno, AlumnoForm } from '../types/alumnoTypes';

export const useAlumnos = () => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlumnos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await alumnoService.getAll();
            setAlumnos(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlumnos();
    }, [fetchAlumnos]);

    const createAlumno = async (form: AlumnoForm) => {
        try {
            await alumnoService.create(form);
            await fetchAlumnos();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    const updateAlumno = async (id: number, form: AlumnoForm) => {
        try {
            await alumnoService.update(id, form);
            await fetchAlumnos();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    const deleteAlumno = async (id: number) => {
        try {
            await alumnoService.delete(id);
            await fetchAlumnos();
            return true;
        } catch (err) {
            setError((err as Error).message);
            return false;
        }
    };

    return { alumnos, loading, error, createAlumno, updateAlumno, deleteAlumno, setError };
};