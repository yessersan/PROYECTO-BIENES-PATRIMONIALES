export interface Responsable {
  id: number;
  usuario: number; // ID of Usuario
  nombre?: string;  // Agrega esta línea (puede ser opcional con ?)
  cargo: string;
  departamento: string;
  fecha_asignacion: string; // ISO date string
  activo: boolean;
}
