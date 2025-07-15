export interface Ubicacion {
  id: number;
  codigo: string;
  edificio: string;
  piso: string;
  oficina: string;
  direccion: string;
  responsable?: number;
  capacidad: number;
  ocupados: number;
  espacio_disponible?: number;
  latitud: number;
  longitud: number;
}
