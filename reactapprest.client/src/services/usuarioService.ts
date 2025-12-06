import type { Usuario, UsuarioForm, Perfil } from '../types/usuarioTypes';

const API_URL_USUARIOS = 'https://localhost:7231/api/Usuarios';
const API_URL_PERFILES = 'https://localhost:7231/api/Perfiles';

// --- Usuarios ---

export const getUsuarios = async (): Promise<Usuario[]> => {
    const response = await fetch(API_URL_USUARIOS);
    if (!response.ok) throw new Error('Error al obtener los usuarios');
    return response.json();
};

export const addUsuario = async (usuario: UsuarioForm): Promise<Usuario> => {
    const response = await fetch(API_URL_USUARIOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Error al agregar el usuario');
    return response.json();
};

export const updateUsuario = async (id: number, usuario: UsuarioForm): Promise<void> => {
    const response = await fetch(`${API_URL_USUARIOS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    if (!response.ok) throw new Error('Error al actualizar el usuario');
};

export const deleteUsuario = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL_USUARIOS}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el usuario');
};

// --- Perfiles ---

export const getPerfiles = async (): Promise<Perfil[]> => {
    const response = await fetch(API_URL_PERFILES);
    if (!response.ok) throw new Error('Error al obtener los perfiles');
    return response.json();
};