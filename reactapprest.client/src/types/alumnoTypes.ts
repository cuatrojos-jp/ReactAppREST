export interface Alumno {
    caAlumNId: number;
    caAlumTNombre: string;
    caAlumTApellidoMaterno: string;
    caAlumTApellidoPaterno: string;
    caAlumTTelefono: string;
    caGradNId: number;
    gradoDescripcion: string | null;
    bActivo: boolean | null;
}

export type AlumnoForm = Omit<Alumno, "caAlumNId" | "gradoDescripcion">;

export type AlumnoCreate = Omit<Alumno, "caAlumNId" | "gradoDescripcion">;
export type AlumnoUpdate = Omit<Alumno, "gradoDescripcion">;