export interface Responsable {
    id: number;
    usuario: number; // ID of Usuario
    cargo: string;
    departamento: string;
    fecha_asignacion: string; // ISO date string
    activo: boolean;
  }