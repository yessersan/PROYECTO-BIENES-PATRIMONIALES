export interface Ubicacion {
    id: number;
    codigo: string;
    edificio: string;
    piso: string;
    oficina: string;
    direccion: string;
    responsable?: number; // ID of Responsable
    capacidad: number;
    ocupados: number;
  }