export interface Reporte {
  id: number;
  tipo: 'INVENTARIO' | 'DEPRECIACION' | 'ESTADO' | 'MOVIMIENTOS' | 'BAJAS' | 'MANTENIMIENTOS';
  fecha_generacion: string; 
  contenido: string;
  formato: 'PDF' | 'EXCEL' | 'HTML' | 'CSV';
  parametros: { [key: string]: any };
  usuario: number; 
  archivo?: string; 
}