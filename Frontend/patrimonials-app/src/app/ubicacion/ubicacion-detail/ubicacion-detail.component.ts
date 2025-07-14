import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { Usuario } from '../../models/usuario.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ubicacion-detail',
  standalone: false,
  templateUrl: './ubicacion-detail.component.html',
  styleUrls: ['./ubicacion-detail.component.css']
})
export class UbicacionDetailComponent implements OnInit {
  ubicacionForm: FormGroup;
  bienes: Bien[] = [];
  id: string | null = null;
  esNuevo = false;
  loading = false;
  error = '';
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

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
      responsable: [null]
    }, { validators: this.capacidadOcupadosValidator });
  }

  capacidadOcupadosValidator(form: FormGroup): { [key: string]: any } | null {
    const capacidad = Number(form.get('capacidad')?.value);
    const ocupados = Number(form.get('ocupados')?.value);
    return ocupados <= capacidad ? null : { ocupadosExcedeCapacidad: true };
  }

  ngOnInit(): void {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol?.toUpperCase();

        const rolesPermitidos = ['ADMIN', 'GESTOR'];
        if (!rolesPermitidos.includes(this.rolUsuario)) {
          this.error = 'no tienes permiso para acceder a ubicaciones';
          alert(this.error);
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();
        this.cargarDatos();
      },
      error: () => {
        this.error = 'no se pudo obtener el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const menu = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] },
    ];

    this.menuItems = menu.filter(item => item.roles.includes(this.rolUsuario));
  }

  cargarDatos() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';

    if (!this.esNuevo && this.id) {
      this.loading = true;
      this.api.getUbicacion(Number(this.id)).subscribe({
        next: (data) => {
          this.ubicacionForm.patchValue(data);
          this.loading = false;
        },
        error: () => {
          this.error = 'no se pudo cargar la ubicación';
          this.loading = false;
        }
      });

      this.api.getBienes().subscribe({
        next: (bienes) => {
          this.bienes = bienes.filter(b => b.ubicacion === Number(this.id));
        },
        error: () => {
          this.error = 'no se pudo cargar los bienes';
        }
      });
    }
  }

  guardar() {
    if (this.ubicacionForm.invalid) {
      this.ubicacionForm.markAllAsTouched();
      this.error = 'por favor complete todos los campos requeridos';
      return;
    }

    const ubicacion: Ubicacion = {
      id: this.esNuevo ? 0 : Number(this.id),
      ...this.ubicacionForm.value,
      capacidad: Number(this.ubicacionForm.value.capacidad),
      ocupados: Number(this.ubicacionForm.value.ocupados),
      responsable: this.ubicacionForm.value.responsable || null
    };

    this.loading = true;
    if (this.esNuevo) {
      const { id, ...ubicacionSinId } = ubicacion;
      this.api.createUbicacion(ubicacionSinId).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: (err) => {
          this.error = err.error?.message || 'no se pudo crear la ubicación';
          this.loading = false;
        }
      });
    } else {
      this.api.updateUbicacion(Number(this.id), ubicacion).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: (err) => {
          this.error = err.error?.message || 'no se pudo actualizar la ubicación';
          this.loading = false;
        }
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿eliminar esta ubicación?')) {
      this.loading = true;
      this.api.deleteUbicacion(Number(this.id)).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: () => {
          this.error = 'no se pudo eliminar la ubicación';
          this.loading = false;
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
