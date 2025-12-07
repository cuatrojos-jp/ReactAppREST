import { API_URLS } from '../utils/constants';
import type { Grado, GradoForm } from '../types/gradoTypes';

class GradoService {
    private baseUrl = API_URLS.GRADOS;

    async getAll(): Promise<Grado[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error('Failed to fetch grados');
        return response.json();
    }

    async create(grado: GradoForm): Promise<Grado> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grado),
        });
        if (!response.ok) throw new Error('Failed to create grado');
        return response.json();
    }

    async update(id: number, grado: GradoForm): Promise<Grado> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grado),
        });
        if (!response.ok) throw new Error('Failed to update grado');
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete grado');
    }
}

export const gradoService = new GradoService();