import { API_URLS } from '../utils/constants';
import type { Perfil, PerfilForm } from '../types/perfilTypes';
import type { Usuario } from '../types/usuarioTypes';

class PerfilService {
    private baseUrl = API_URLS.PERFILES;

    async getAll(): Promise<Perfil[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error('Failed to fetch perfiles');
        return response.json();
    }

    async getUsuariosPorPerfil(id: number): Promise<Usuario[]> {
        const response = await fetch(`${this.baseUrl}/${id}/usuarios`);
        if (!response.ok) throw new Error('Failed to fetch usuarios for perfil');
        return response.json();
    }

    async create(perfil: PerfilForm): Promise<Perfil> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(perfil),
        });
        if (!response.ok) throw new Error('Failed to create perfil');
        return response.json();
    }

    async update(id: number, perfil: PerfilForm): Promise<Perfil> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(perfil),
        });
        if (!response.ok) throw new Error('Failed to update perfil');
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete perfil');
    }
}

export const perfilService = new PerfilService();