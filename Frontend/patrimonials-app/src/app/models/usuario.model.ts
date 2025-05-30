export interface Usuario {
    id: number;
    username: string;
    email: string;
    rol: 'ADMIN' | 'GESTOR' | 'AUDITOR' | 'CONSULTA';
    departamento?: string;
    telefono?: string;
    fecha_creacion: string; // ISO date string (e.g., '2025-05-30T12:00:00Z')
    ultimo_acceso?: string;
    first_name?: string;
    last_name?: string;
  }