import { useState, useEffect } from 'react';
import type { Alumno, AlumnoForm } from '../types/alumnoTypes';
import { alumnoService } from '../services/alumnoService';

export const useAlumnos = () => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAlumnos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await alumnoService.getAll();
            setAlumnos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los alumnos');
        } finally {
            setLoading(false);
        }
    };

    const createAlumno = async (alumnoData: AlumnoForm): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await alumnoService.create(alumnoData);
            await fetchAlumnos();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el alumno');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateAlumno = async (id: number, alumnoData: AlumnoForm): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await alumnoService.update(id, { ...alumnoData, caAlumNId: id });
            await fetchAlumnos();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el alumno');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteAlumno = async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await alumnoService.delete(id);
            await fetchAlumnos();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el alumno');
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumnos();
    }, []);

    return {
        alumnos,
        loading,
        error,
        fetchAlumnos,
        createAlumno,
        updateAlumno,
        deleteAlumno,
        setError,
    };
};