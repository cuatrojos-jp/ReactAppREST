import { API_URLS } from '../utils/constants';
import type { Usuario, UsuarioForm } from '../types/usuarioTypes';

class UsuarioService {
    private baseUrl = API_URLS.USUARIOS;

    async getAll(): Promise<Usuario[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error('Failed to fetch usuarios');
        return response.json();
    }

    async create(usuario: UsuarioForm): Promise<Usuario> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) throw new Error('Failed to create usuario');
        return response.json();
    }

    async update(id: number, usuario: Partial<UsuarioForm>): Promise<Usuario> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) throw new Error('Failed to update usuario');
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete usuario');
    }
}

export const usuarioService = new UsuarioService();