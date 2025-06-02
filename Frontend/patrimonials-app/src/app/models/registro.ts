export interface Registro {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: 'GESTOR' | 'AUDITOR' | 'CONSULTA'; // ADMIN solo podría asignarse manualmente
  departamento?: string;
  telefono?: string;
  first_name?: string;
  last_name?: string;
}