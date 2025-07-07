export interface Movimiento {
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