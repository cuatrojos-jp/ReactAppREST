import { API_URLS } from '../utils/constants';
import type { Alumno, AlumnoForm } from '../types/alumnoTypes';

class AlumnoService {
    private baseUrl = API_URLS.ALUMNOS;

    async getAll(): Promise<Alumno[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        // The backend returns data in a 'value' property for OData compatibility
        const data = await response.json();
        return data.value || data;
    }

    async create(alumno: AlumnoForm): Promise<Alumno> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alumno),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }

    async update(id: number, alumno: Partial<AlumnoForm>): Promise<Alumno> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alumno),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        // The update might return no content or the updated object
        if (response.status === 204) {
            // If no content, we can't return an Alumno, so we might need to refetch.
            // For now, we'll assume the API returns the updated object or handle it in the hook.
            return {} as Alumno; // Or handle appropriately
        }
        return await response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    }
}

// This is the crucial line that exports the single instance
export const alumnoService = new AlumnoService();