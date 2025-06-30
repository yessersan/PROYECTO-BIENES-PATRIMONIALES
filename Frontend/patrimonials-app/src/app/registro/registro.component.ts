import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Registro } from '../models/registro';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Import MessageService

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [MessageService], // Add MessageService to providers
})
export class RegistroComponent {
  registroForm: FormGroup;
  loading = false;
  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Gestor', value: 'GESTOR' },
    { label: 'Auditor', value: 'AUDITOR' },
    { label: 'Consulta', value: 'CONSULTA' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService // Inject MessageService
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      rol: ['', Validators.required],
      departamento: [''],
      telefono: [''],
      first_name: [''],
      last_name: [''],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

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
      return;
    }

    this.loading = true;
    const registroData: Registro = this.registroForm.value;
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