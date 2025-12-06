import { useState, useEffect, useCallback } from 'react';
import type { Perfil, PerfilForm } from '../types/perfilTypes';
import * as perfilService from '../services/perfilService';

export const usePerfiles = () => {
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPerfiles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await perfilService.getPerfiles();
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
            await perfilService.addPerfil(form);
            await fetchPerfiles();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleUpdate = async (id: number, form: PerfilForm) => {
        try {
            await perfilService.updatePerfil(id, form);
            await fetchPerfiles();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Desea eliminar este perfil?')) return;
        try {
            await perfilService.deletePerfil(id);
            await fetchPerfiles();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return {
        perfiles,
        loading,
        error,
        handleAdd,
        handleUpdate,
        handleDelete,
    };
};