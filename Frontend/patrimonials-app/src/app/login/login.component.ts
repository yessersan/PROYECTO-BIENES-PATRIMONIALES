import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
     this.authService.login(this.credentials).subscribe({
    next: (response) => {
      localStorage.setItem('token', response.token); // Solo guarda el token aquí
      this.authService.getUsuarioBackend().subscribe(usuario => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['/dashboard']);
      });
    },
    error: () => {
      this.error = 'Usuario o contraseña incorrectos';
    }
  });
  }

  goToRegistro() {
    this.router.navigate(['/registro']);
  }
}