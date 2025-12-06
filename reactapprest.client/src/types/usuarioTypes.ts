// Representa un Perfil, tal como viene de la API
export interface Perfil {
    perfilId: number;
    perfilNombre: string;
    perfilActivo: boolean;
}

// Representa un Usuario, tal como viene de la API (DTO)
export interface Usuario {
    usuarioId: number;
    usuarioNombre: string | null;
    usuarioApPat: string | null;
    usuarioApMat: string | null;
    usuarioActivo: boolean | null;
    perfilIds: number[];
}

// Representa el formulario para crear o actualizar un usuario
// CORRECCIÓN: Hacemos que los campos del formulario no acepten null
export interface UsuarioForm {
    usuarioNombre: string;
    usuarioApPat: string;
    usuarioApMat: string;
    usuarioPw?: string;
    usuarioActivo: boolean;
    perfilIds: number[];
}