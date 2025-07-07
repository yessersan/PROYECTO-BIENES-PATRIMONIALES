import { Usuario } from "./usuario.model";
export interface Responsable {
  id: number;
  usuario: Usuario; 
  cargo: string;
  departamento: string;
  fecha_asignacion: string; 
  activo: boolean;
}
