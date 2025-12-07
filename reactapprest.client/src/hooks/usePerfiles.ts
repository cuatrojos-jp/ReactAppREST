import { useState, useEffect, useCallback } from 'react';
import { perfilService } from '../services/perfilService';
import type { Perfil, PerfilForm } from '../types/perfilTypes';

export const usePerfiles = () => {
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPerfiles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await perfilService.getAll();
            setPerfiles(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerfiles();
    }, [fetchPerfiles]);

    const handleAdd = async (form: PerfilForm) => {
        try {
            await perfilService.create(form);
            await fetchPerfiles();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleUpdate = async (id: number, form: PerfilForm) => {
        try {
            await perfilService.update(id, form);
            await fetchPerfiles();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await perfilService.delete(id);
            await fetchPerfiles();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return { perfiles, loading, error, handleAdd, handleUpdate, handleDelete };
};