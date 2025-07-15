export interface Bien {
  id: number;
  codigo: string;
  nombre?: string;
  serie?: string | null;
  descripcion: string;
  marca?: string | null;
  modelo?: string | null;
  valor_adquisicion: number;
  fecha_adquisicion: string; // ISO date string
  estado: 'BUENO' | 'REGULAR' | 'MALO' | 'BAJA' | 'REPARACION';
  depreciacion: number;
  valor_residual: number;
  categoria: number; // ID of Categoria
  ubicacion: number; // ID of Ubicacion
  responsable?: number | null; // ID of Responsable
  fecha_registro: string; // ISO date string
  fecha_actualizacion: string; // ISO date string
  activo: boolean;
}
