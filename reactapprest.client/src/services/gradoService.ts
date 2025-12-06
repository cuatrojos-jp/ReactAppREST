import type { Grado, GradoForm } from "../types/gradoTypes";

const API_URL = "https://localhost:7231/api/CaGrados";

export const getGrados = async (): Promise<Grado[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Error al obtener los grados");
    }
    return response.json();
};

export const addGrado = async (grado: GradoForm): Promise<Grado> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grado),
    });
    if (!response.ok) {
        throw new Error("Error al agregar el grado");
    }
    return response.json();
};

export const updateGrado = async (id: number, grado: GradoForm): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caGradNId: id, ...grado }),
    });
    if (!response.ok) {
        throw new Error("Error al actualizar el grado");
    }
};

export const deleteGrado = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Error al eliminar el grado");
    }
};