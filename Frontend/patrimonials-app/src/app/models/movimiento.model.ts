export interface Movimiento {
    id: number;
    tipo: 'ASIGNACION' | 'TRASLADO' | 'BAJA' | 'MANTENIMIENTO' | 'LIBERACION' | 'REPARACION' | 'RETORNO';
    fecha: string; // ISO date string
    descripcion: string;
    observaciones?: string;
    bien: number; // ID of Bien
    responsable: number; // ID of Responsable
    origen?: number; // ID of Ubicacion
    destino?: number; // ID of Ubicacion
    usuario_registro: number; // ID of Usuario
  }