export interface Bien {
    id: number;
    codigo: string;
    serie?: string;
    descripcion: string;
    marca?: string;
    modelo?: string;
    valor_adquisicion: number;
    fecha_adquisicion: string; // ISO date string
    estado: 'BUENO' | 'REGULAR' | 'MALO' | 'BAJA' | 'REPARACION';
    depreciacion: number;
    valor_residual: number;
    categoria: number; // ID of Categoria
    ubicacion: number; // ID of Ubicacion
    responsable?: number; // ID of Responsable
    fecha_registro: string; // ISO date string
    fecha_actualizacion: string; // ISO date string
    activo: boolean;
  }