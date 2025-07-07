export interface Movimiento {
<<<<<<< HEAD
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
=======
  id: number;
  tipo: string;
  fecha?: string;
  descripcion: string;
  observaciones?: string;
  bien: string; // Debe ser el código de BienPatrimonial
  responsable: string; // Debe ser el username del Usuario asociado al Responsable
  origen?: string; // Debe ser el código de Ubicacion
  destino?: string; // Debe ser el código de Ubicacion
  usuario_registro: string; // Debe ser el username del Usuario
}
>>>>>>> origin/yezer
