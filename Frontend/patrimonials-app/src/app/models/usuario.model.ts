export interface Usuario {
    id: number;
    username: string;
    email: string;
    rol: 'ADMIN' | 'GESTOR' | 'AUDITOR' | 'CONSULTA';
    departamento?: string;
    telefono?: string;
    fecha_creacion: string; 
    ultimo_acceso?: string;
    first_name?: string;
    last_name?: string;
  }