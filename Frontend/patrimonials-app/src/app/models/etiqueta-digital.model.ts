export interface EtiquetaDigital {
    id: number;
    codigo_qr: string;
    codigo_nfc?: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'PERDIDO' | 'DANADO';
    bien: number; // ID of Bien
    fecha_activacion: string; // ISO date string
    fecha_actualizacion: string; // ISO date string
    imagen_qr?: string; // URL or path to the QR code image
  }