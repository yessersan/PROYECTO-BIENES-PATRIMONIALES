import { Component, OnInit } from '@angular/core';
import { Reporte } from '../../models/reporte.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-reporte-detail',
  standalone: false,
  templateUrl: './reporte-detail.component.html',
  styleUrls: ['./reporte-detail.component.css']
})
export class ReporteDetailComponent implements OnInit {
  reporteForm: FormGroup;
  reporte: Reporte | null = null;
  loading = false;
  error = '';
  esNuevo = false;
  usuarioActual: Usuario | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.reporteForm = this.fb.group({
      tipo: ['', [Validators.required]],
      formato: ['', [Validators.required]],
      contenido: ['', [Validators.required]] // Obligatorio según modelo Django
    });
  }

  ngOnInit(): void {
    // Obtener usuario actual
    this.loading = true;
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario actual';
        this.loading = false;
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = id === 'nuevo';
    if (!this.esNuevo && id) {
      this.loading = true;
      this.api.getReporte(Number(id)).subscribe({
        next: (data) => {
          this.reporte = data;
          this.reporteForm.patchValue({
            tipo: data.tipo,
            formato: data.formato,
            contenido: data.contenido || 'Reporte generado'
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el reporte';
          this.loading = false;
        }
      });
    }
  }

  guardar() {
    if (this.reporteForm.invalid) {
      this.reporteForm.markAllAsTouched();
      this.error = 'Por favor, complete todos los campos requeridos correctamente.';
      return;
    }

    if (!this.usuarioActual?.id) {
      this.error = 'Usuario no autenticado';
      return;
    }

    const reporte: Partial<Reporte> = {
      tipo: this.reporteForm.value.tipo,
      formato: this.reporteForm.value.formato,
      contenido: this.reporteForm.value.contenido,
      usuario: this.usuarioActual.id,
      parametros: {} // Enviar objeto JSON vacío por defecto
    };

    this.loading = true;
    if (this.esNuevo) {
      this.api.createReporte(reporte).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/reportes']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'No se pudo crear el reporte. Verifique los datos.';
          console.error('Error del servidor:', err.error);
        }
      });
    } else if (this.reporte?.id) {
      this.api.updateReporte(this.reporte.id, reporte).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/reportes']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'No se pudo actualizar el reporte. Verifique los datos.';
          console.error('Error del servidor:', err.error);
        }
      });
    }
  }

  eliminar() {
    if (this.reporte?.id && confirm('¿Seguro que desea eliminar este reporte?')) {
      this.loading = true;
      this.api.deleteReporte(this.reporte.id).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/reportes']);
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo eliminar el reporte';
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/reportes']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reporteForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}