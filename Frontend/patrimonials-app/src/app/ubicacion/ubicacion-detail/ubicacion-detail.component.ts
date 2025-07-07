<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
>>>>>>> origin/yezer

@Component({
  selector: 'app-ubicacion-detail',
  standalone: false,
  templateUrl: './ubicacion-detail.component.html',
<<<<<<< HEAD
  styleUrl: './ubicacion-detail.component.css'
})
export class UbicacionDetailComponent {

}
=======
  styleUrls: ['./ubicacion-detail.component.css']
})
export class UbicacionDetailComponent implements OnInit {
  ubicacionForm: FormGroup;
  bienes: Bien[] = [];
  id: string | null = null;
  esNuevo = false;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.ubicacionForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(1)]],
      edificio: ['', [Validators.required, Validators.minLength(1)]],
      piso: ['', [Validators.required, Validators.minLength(1)]],
      oficina: ['', [Validators.required, Validators.minLength(1)]],
      direccion: ['', [Validators.required, Validators.minLength(1)]],
      capacidad: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      ocupados: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      responsable: [null] // Campo opcional, inicializado como null
    }, { validators: this.capacidadOcupadosValidator });
  }

  // Validador personalizado para verificar que ocupados <= capacidad
  capacidadOcupadosValidator(form: FormGroup): { [key: string]: any } | null {
    const capacidad = Number(form.get('capacidad')?.value);
    const ocupados = Number(form.get('ocupados')?.value);
    return ocupados <= capacidad ? null : { ocupadosExcedeCapacidad: true };
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';
    if (!this.esNuevo && this.id) {
      this.loading = true;
      this.api.getUbicacion(Number(this.id)).subscribe({
        next: (data) => {
          this.ubicacionForm.patchValue({
            codigo: data.codigo,
            edificio: data.edificio,
            piso: data.piso,
            oficina: data.oficina,
            direccion: data.direccion,
            capacidad: data.capacidad ?? 0,
            ocupados: data.ocupados ?? 0,
            responsable: data.responsable ?? null
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar la ubicación';
          this.loading = false;
        }
      });

      this.api.getBienes().subscribe({
        next: (bienes) => {
          this.bienes = bienes.filter(b => b.ubicacion === Number(this.id));
        },
        error: () => {
          this.error = 'No se pudo cargar los bienes';
        }
      });
    }
  }

  guardar() {
    if (this.ubicacionForm.invalid) {
      this.ubicacionForm.markAllAsTouched();
      this.error = 'Por favor, complete todos los campos requeridos correctamente.';
      return;
    }

    // Construir el objeto Ubicacion
    const ubicacion: Ubicacion = {
      id: this.esNuevo ? 0 : Number(this.id), // id=0 para POST, ya que el servidor lo genera
      codigo: this.ubicacionForm.value.codigo,
      edificio: this.ubicacionForm.value.edificio,
      piso: this.ubicacionForm.value.piso,
      oficina: this.ubicacionForm.value.oficina,
      direccion: this.ubicacionForm.value.direccion,
      capacidad: Number(this.ubicacionForm.value.capacidad),
      ocupados: Number(this.ubicacionForm.value.ocupados),
      responsable: this.ubicacionForm.value.responsable || null // Enviar null si no se proporciona
    };

    this.loading = true;
    if (this.esNuevo) {
      // No incluir id en la solicitud POST
      const { id, ...ubicacionSinId } = ubicacion;
      this.api.createUbicacion(ubicacionSinId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/ubicaciones']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'No se pudo crear la ubicación. Verifique los datos.';
          console.error('Error del servidor:', err.error); // Para depuración
        }
      });
    } else if (this.id) {
      this.api.updateUbicacion(Number(this.id), ubicacion).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/ubicaciones']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'No se pudo actualizar la ubicación. Verifique los datos.';
          console.error('Error del servidor:', err.error); // Para depuración
        }
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿Eliminar esta ubicación?')) {
      this.loading = true;
      this.api.deleteUbicacion(Number(this.id)).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/ubicaciones']);
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo eliminar la ubicación';
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/ubicaciones']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ubicacionForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
>>>>>>> origin/yezer
