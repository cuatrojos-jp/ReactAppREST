import type { Perfil, PerfilForm } from '../types/perfilTypes';
import type { Usuario } from '../types/usuarioTypes'; // Importar tipo Usuario

const API_URL = 'https://localhost:7231/api/Perfiles';

export const getPerfiles = async (options?: { solamenteActivos: boolean }): Promise<Perfil[]> => {
    let url = API_URL;
    if (options?.solamenteActivos) {
        url += '?solamenteActivos=true';
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener los perfiles');
    return response.json();
};

// Nueva función
export const getUsuariosPorPerfil = async (perfilId: number): Promise<Usuario[]> => {
    const response = await fetch(`${API_URL}/${perfilId}/usuarios`);
    if (!response.ok) throw new Error('Error al obtener los usuarios del perfil');
    return response.json();
};

export const addPerfil = async (perfil: PerfilForm): Promise<Perfil> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfil),
    });
    if (!response.ok) throw new Error('Error al agregar el perfil');
    return response.json();
};

export const updatePerfil = async (id: number, perfil: PerfilForm): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfilId: id, ...perfil }),
    });
    if (!response.ok) throw new Error('Error al actualizar el perfil');
};

export const deletePerfil = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el perfil');
};