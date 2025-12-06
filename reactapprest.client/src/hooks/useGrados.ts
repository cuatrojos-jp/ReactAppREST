import { useState, useEffect, useCallback } from "react";
import * as gradoService from "../services/gradoService";
import type { Grado, GradoForm } from "../types/gradoTypes";

export const useGrados = () => {
    const [grados, setGrados] = useState<Grado[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchGrados = useCallback(async () => {
        try {
            const data = await gradoService.getGrados();
            setGrados(data);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchGrados();
    }, [fetchGrados]);

    const handleAdd = async (form: GradoForm) => {
        try {
            await gradoService.addGrado(form);
            await fetchGrados();
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            console.error(err);
        }
    };

    const handleUpdate = async (id: number, form: GradoForm) => {
        try {
            await gradoService.updateGrado(id, form);
            await fetchGrados();
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Desea eliminar este grado?")) return;
        try {
            await gradoService.deleteGrado(id);
            await fetchGrados();
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            console.error(err);
        }
    };

    return {
        grados,
        error,
        fetchGrados,
        handleAdd,
        handleUpdate,
        handleDelete,
    };
};