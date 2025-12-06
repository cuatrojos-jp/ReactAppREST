import { useState, useEffect, useCallback } from 'react';
import type { Usuario, UsuarioForm, Perfil } from '../types/usuarioTypes';
import * as usuarioService from '../services/usuarioService';
import * as perfilService from '../services/perfilService'; // Importar el servicio correcto

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getUsuarios();
            setUsuarios(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPerfilesActivos = useCallback(async () => {
        try {
            // CORRECCIÓN: Pedimos solo los perfiles activos para el formulario
            const data = await perfilService.getPerfiles({ solamenteActivos: true });
            setPerfiles(data);
        } catch (err) {
            setError((err as Error).message);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
        fetchPerfilesActivos();
    }, [fetchUsuarios, fetchPerfilesActivos]);

    const handleAdd = async (form: UsuarioForm) => {
        try {
            await usuarioService.addUsuario(form);
            await fetchUsuarios();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleUpdate = async (id: number, form: UsuarioForm) => {
        try {
            await usuarioService.updateUsuario(id, form);
            await fetchUsuarios();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Desea eliminar este usuario?')) return;
        try {
            await usuarioService.deleteUsuario(id);
            await fetchUsuarios();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return {
        usuarios,
        perfiles,
        loading,
        error,
        handleAdd,
        handleUpdate,
        handleDelete,
    };
};