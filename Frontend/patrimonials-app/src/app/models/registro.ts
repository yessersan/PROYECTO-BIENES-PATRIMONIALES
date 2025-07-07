export interface Registro {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
<<<<<<< HEAD
  rol: 'GESTOR' | 'AUDITOR' | 'CONSULTA'; // ADMIN solo podría asignarse manualmente
=======
  rol: 'GESTOR' | 'AUDITOR' | 'CONSULTA' | 'ADMIN'; 
>>>>>>> origin/yezer
  departamento?: string;
  telefono?: string;
  first_name?: string;
  last_name?: string;
}