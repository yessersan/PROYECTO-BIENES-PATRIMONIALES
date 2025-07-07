export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    vida_util: number;
    tasa_depreciacion: number;
    activa: boolean;
  }