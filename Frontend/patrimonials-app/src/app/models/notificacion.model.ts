export interface Notificacion {
    id: number;
    mensaje: string;
    fecha_envio: string; // ISO date string
    estado: 'NO_LEIDO' | 'LEIDO' | 'ARCHIVADO';
    usuarios: number[]; // Array of Usuario IDs
    responsables: number[]; // Array of Responsable IDs
    url?: string;
    importante: boolean;
  }