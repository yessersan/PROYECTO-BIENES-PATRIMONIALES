export interface Mantenimiento {
    id: number;
    tipo: 'PREVENTIVO' | 'CORRECTIVO' | 'PREDICTIVO';
    descripcion: string;
    fecha_programada: string; // ISO date string
    fecha_inicio?: string; // ISO date string
    fecha_fin?: string; // ISO date string
    costo?: number;
    bien: number; // ID of Bien
    proveedor?: string;
    estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
    usuario_registro: number; // ID of Usuario
    observaciones?: string;
  }