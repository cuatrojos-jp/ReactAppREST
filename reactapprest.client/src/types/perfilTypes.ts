// Representa un Perfil, tal como viene de la API
export interface Perfil {
    perfilId: number;
    perfilNombre: string;
    perfilActivo: boolean;
    usuariosCount: number; // Nuevo
}

// Representa el formulario para crear o actualizar un perfil
export type PerfilForm = Omit<Perfil, 'perfilId' | 'usuariosCount'>;