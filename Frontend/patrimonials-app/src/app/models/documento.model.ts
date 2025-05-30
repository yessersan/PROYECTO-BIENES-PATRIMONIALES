export interface Documento {
    id: number;
    tipo: 'FACTURA' | 'GARANTIA' | 'CONTRATO' | 'FOTO' | 'OTRO';
    ruta_archivo: string; // URL or path to the file
    fecha_registro: string; // ISO date string
    bien: number; // ID of Bien
    usuario: number; // ID of Usuario
    descripcion?: string;
    fecha_documento?: string; // ISO date string
  }