import { Component, OnInit } from '@angular/core';
import { Movimiento } from '../../models/movimiento.model';
import { Bien } from '../../models/bien.model';
import { Responsable } from '../../models/responsable.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Usuario } from '../../models/usuario.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-movimiento-detail',
  standalone: false,
  templateUrl: './movimiento-detail.component.html',
  styleUrls: ['./movimiento-detail.component.css']
})
export class MovimientoDetailComponent implements OnInit {
  movimientoForm: FormGroup;
  movimiento: Movimiento | null = null;
  bienes: Bien[] = [];
  responsables: Responsable[] = [];
  ubicaciones: Ubicacion[] = [];
  usuarioActual: Usuario | null = null;
  loading = false;
  error = '';
  esNuevo = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.movimientoForm = this.fb.group({
      tipo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      observaciones: [''],
      bien: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      origen: [''],
      destino: ['']
    });
  }

  ngOnInit(): void {
    // Cargar usuario actual
    this.loading = true;
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.loadData();
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario actual';
        this.loading = false;
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = id === 'nuevo';
    if (!this.esNuevo && id) {
      this.api.getMovimiento(Number(id)).subscribe({
        next: (mov) => {
          this.movimiento = mov;
          this.movimientoForm.patchValue({
            tipo: mov.tipo,
            descripcion: mov.descripcion,
            observaciones: mov.observaciones || '',
            bien: mov.bien,
            responsable: mov.responsable,
            origen: mov.origen || '',
            destino: mov.destino || ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el movimiento';
          this.loading = false;
        }
      });
    } else {
      this.loadData();
    }
  }

  loadData() {
    // Cargar bienes
    this.api.getBienes().subscribe({
      next: (bienes) => {
        this.bienes = bienes;
      },
      error: () => {
        this.error = 'No se pudieron cargar los bienes';
      }
    });

    // Cargar responsables
    this.api.getResponsables().subscribe({
      next: (responsables) => {
        this.responsables = responsables;
      },
      error: () => {
        this.error = 'No se pudieron cargar los responsables';
      }
    });

    // Cargar ubicaciones
    this.api.getUbicaciones().subscribe({
      next: (ubicaciones) => {
        this.ubicaciones = ubicaciones;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las ubicaciones';
        this.loading = false;
      }
    });
  }

  guardar() {
  if (this.movimientoForm.invalid) {
    this.movimientoForm.markAllAsTouched();
    this.error = 'Por favor, complete todos los campos requeridos correctamente.';
    return;
  }

  if (!this.usuarioActual?.username) { // Verificar username en lugar de id
    this.error = 'Usuario no autenticado';
    return;
  }

  const movimiento: Partial<Movimiento> = {
    tipo: this.movimientoForm.value.tipo,
    descripcion: this.movimientoForm.value.descripcion,
    observaciones: this.movimientoForm.value.observaciones || undefined,
    bien: this.movimientoForm.value.bien, // Enviar el código como string
    responsable: this.movimientoForm.value.responsable, // Enviar el username como string
    origen: this.movimientoForm.value.origen || undefined,
    destino: this.movimientoForm.value.destino || undefined,
    usuario_registro: this.usuarioActual.username // Enviar username, no id
  };

  this.loading = true;
  if (this.esNuevo) {
    this.api.createMovimiento(movimiento).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/movimientos']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'No se pudo crear el movimiento. Verifique los datos.';
        console.error('Error del servidor:', err.error);
      }
    });
  } else if (this.movimiento?.id) {
    this.api.updateMovimiento(this.movimiento.id, movimiento).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/movimientos']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'No se pudo actualizar el movimiento. Verifique los datos.';
        console.error('Error del servidor:', err.error);
      }
    });
  }
}
  eliminar() {
    if (this.movimiento?.id && confirm('¿Seguro que desea eliminar este movimiento?')) {
      this.loading = true;
      this.api.deleteMovimiento(this.movimiento.id).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/movimientos']);
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo eliminar el movimiento';
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/movimientos']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.movimientoForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}