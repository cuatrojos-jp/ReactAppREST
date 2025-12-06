export interface Grado {
    caGradNId: number;
    caGradTDescripcion: string;
}

export type GradoForm = Omit<Grado, "caGradNId">;