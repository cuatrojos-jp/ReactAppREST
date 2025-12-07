import { useState, useEffect, useCallback } from 'react';
import { usuarioService } from '../services/usuarioService';
import { perfilService } from '../services/perfilService';
import type { Usuario, UsuarioForm } from '../types/usuarioTypes';
import type { Perfil } from '../types/perfilTypes';

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = useCallback(async () => {
        try {
            const data = await usuarioService.getAll();
            setUsuarios(data);
        } catch (err) {
            setError((err as Error).message);
        }
    }, []);

    const fetchPerfiles = useCallback(async () => {
        try {
            const data = await perfilService.getAll();
            setPerfiles(data.filter(p => p.perfilActivo));
        } catch (err) {
            setError((err as Error).message);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsuarios(), fetchPerfiles()]);
            setLoading(false);
        };
        loadData();
    }, [fetchUsuarios, fetchPerfiles]);

    const handleAdd = async (form: UsuarioForm) => {
        try {
            await usuarioService.create(form);
            await fetchUsuarios();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleUpdate = async (id: number, form: Partial<UsuarioForm>) => {
        try {
            await usuarioService.update(id, form);
            await fetchUsuarios();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await usuarioService.delete(id);
            await fetchUsuarios();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return { usuarios, perfiles, loading, error, handleAdd, handleUpdate, handleDelete };
};