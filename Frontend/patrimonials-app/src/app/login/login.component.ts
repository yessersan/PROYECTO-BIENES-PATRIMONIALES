import { Component } from '@angular/core';
<<<<<<< HEAD
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
=======
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
>>>>>>> origin/yezer

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
<<<<<<< HEAD
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
=======
  styleUrls: ['./login.component.css'],
  providers: [MessageService], 
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos correctamente',
      });
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.getUsuarioBackend().subscribe({
          next: (usuario) => {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Inicio de sesión exitoso',
            });
            setTimeout(() => this.router.navigate(['/dashboard']), 1000);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al obtener datos del usuario',
            });
            this.loading = false;
          },
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña incorrectos',
        });
        this.loading = false;
      },
    });
>>>>>>> origin/yezer
  }

  goToRegistro() {
    this.router.navigate(['/registro']);
  }
<<<<<<< HEAD
=======

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
>>>>>>> origin/yezer
}