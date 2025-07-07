import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
<<<<<<< HEAD
import { Registro } from '../models/registro'; 
import { Router } from '@angular/router';
=======
import { Registro } from '../models/registro';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Import MessageService
>>>>>>> origin/yezer

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
<<<<<<< HEAD
  styleUrls: ['./registro.component.css'] 
=======
  styleUrls: ['./registro.component.css'],
  providers: [MessageService], // Add MessageService to providers
>>>>>>> origin/yezer
})
export class RegistroComponent {
  registroForm: FormGroup;
  loading = false;
<<<<<<< HEAD
  error = '';
=======
  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Gestor', value: 'GESTOR' },
    { label: 'Auditor', value: 'AUDITOR' },
    { label: 'Consulta', value: 'CONSULTA' },
  ];
>>>>>>> origin/yezer

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
<<<<<<< HEAD
    private router: Router
=======
    private router: Router,
    private messageService: MessageService // Inject MessageService
>>>>>>> origin/yezer
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
<<<<<<< HEAD
      rol: ['GESTOR', Validators.required],
      departamento: [''],
      telefono: [''],
      first_name: [''],
      last_name: ['']
    }, { validator: this.passwordMatchValidator });
=======
      rol: ['', Validators.required],
      departamento: [''],
      telefono: [''],
      first_name: [''],
      last_name: [''],
    }, { validators: this.passwordMatchValidator });
>>>>>>> origin/yezer
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

<<<<<<< HEAD
  onSubmit() {
    if (this.registroForm.invalid) {
      console.log('Formulario inválido:', this.registroForm.errors);
=======
  isInvalid(controlName: string): boolean {
    const control = this.registroForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  passwordMismatch(): boolean {
    return !!(this.registroForm.hasError('mismatch') && this.registroForm.get('confirmPassword')?.touched);
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
>>>>>>> origin/yezer
      return;
    }

    this.loading = true;
    const registroData: Registro = this.registroForm.value;
<<<<<<< HEAD
    console.log('Datos de registro a enviar:', registroData);
    this.authService.registrar(registroData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.error = 'Error al registrar usuario. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
}
=======
    this.authService.registrar(registroData).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Usuario creado correctamente',
        });
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el usuario',
        });
        this.loading = false;
      },
    });
  }
}
>>>>>>> origin/yezer
