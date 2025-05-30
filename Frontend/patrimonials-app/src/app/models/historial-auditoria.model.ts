export interface HistorialAuditoria {
    id: number;
    fecha: string; // ISO date string
    usuario: number; // ID of Usuario
    accion: string;
    detalle: string;
    bien: number; // ID of Bien
    ip?: string;
    user_agent?: string;
  }