import type { Alumno, AlumnoCreate, AlumnoUpdate } from '../types/alumnoTypes';
import { API_URLS } from '../utils/constants';

class AlumnoService {
    private baseUrl = API_URLS.ALUMNOS;

    async getAll(): Promise<Alumno[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }

    async getById(id: number): Promise<Alumno> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }

    async create(alumno: AlumnoCreate): Promise<Alumno> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumno),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }

    async update(id: number, alumno: AlumnoUpdate): Promise<Alumno> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumno),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
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

export const alumnoService = new AlumnoService();