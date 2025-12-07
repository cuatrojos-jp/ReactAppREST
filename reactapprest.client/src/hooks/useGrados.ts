import { useState, useEffect, useCallback } from 'react';
import { gradoService } from '../services/gradoService';
import type { Grado, GradoForm } from '../types/gradoTypes';

export const useGrados = () => {
    const [grados, setGrados] = useState<Grado[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchGrados = useCallback(async () => {
        try {
            const data = await gradoService.getAll();
            setGrados(data);
        } catch (err) {
            setError((err as Error).message);
        }
    }, []);

    useEffect(() => {
        fetchGrados();
    }, [fetchGrados]);

    const handleAdd = async (form: GradoForm) => {
        try {
            await gradoService.create(form);
            await fetchGrados(); // Re-fetch to update the list
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleUpdate = async (id: number, form: GradoForm) => {
        try {
            await gradoService.update(id, form);
            await fetchGrados(); // Re-fetch to update the list
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await gradoService.delete(id);
            await fetchGrados(); // Re-fetch to update the list
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return { grados, error, handleAdd, handleUpdate, handleDelete };
};