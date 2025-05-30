export interface Reporte {
    id: number;
    tipo: 'INVENTARIO' | 'DEPRECIACION' | 'ESTADO' | 'MOVIMIENTOS' | 'BAJAS' | 'MANTENIMIENTOS';
    fecha_generacion: string; // ISO date string
    contenido: string;
    formato: 'PDF' | 'EXCEL' | 'HTML' | 'CSV';
    parametros: { [key: string]: any }; // JSON object for filters
    usuario: number; // ID of Usuario
    archivo?: string; // URL or path to the file
  }