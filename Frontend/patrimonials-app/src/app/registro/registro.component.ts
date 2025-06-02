import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Registro } from '../models/registro'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'] 
})
export class RegistroComponent {
  registroForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      rol: ['GESTOR', Validators.required],
      departamento: [''],
      telefono: [''],
      first_name: [''],
      last_name: ['']
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

onSubmit() {
  if (this.registroForm.invalid) {
    console.log('Formulario inválido:', this.registroForm.errors);
    return;
  }

  this.loading = true;
  const registroData: Registro = this.registroForm.value;
  console.log('Datos de registro a enviar:', registroData);

  this.authService.registrar(registroData).subscribe({
    next: (response) => {
      console.log('Registro exitoso:', response);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Error en registro:', err);
      this.error = err.message || 'Error en el registro';
      this.loading = false;
    }
  });
}

}
