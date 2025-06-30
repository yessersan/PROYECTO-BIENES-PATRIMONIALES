import { Usuario } from "./usuario.model";
export interface Responsable {
  id: number;
  usuario: Usuario; 
  nombre?: string;  
  cargo: string;
  departamento: string;
  fecha_asignacion: string; 
  activo: boolean;
}
