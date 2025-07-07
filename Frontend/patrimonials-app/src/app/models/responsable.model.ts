<<<<<<< HEAD
export interface Responsable {
  id: number;
  usuario: number; // ID of Usuario
  nombre?: string;  // Agrega esta línea (puede ser opcional con ?)
  cargo: string;
  departamento: string;
  fecha_asignacion: string; // ISO date string
=======
import { Usuario } from "./usuario.model";
export interface Responsable {
  id: number;
  usuario: Usuario; 
  cargo: string;
  departamento: string;
  fecha_asignacion: string; 
>>>>>>> origin/yezer
  activo: boolean;
}
