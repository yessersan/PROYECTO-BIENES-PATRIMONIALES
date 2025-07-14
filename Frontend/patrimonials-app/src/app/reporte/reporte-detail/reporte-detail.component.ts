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
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.reporteForm = this.fb.group({
      tipo: ['', [Validators.required]],
      formato: ['', [Validators.required]],
      contenido: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol; // <-- importante: se obtiene el rol
        this.filtrarMenuPorRol();
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

  filtrarMenuPorRol() {
    const todoElMenu = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN','AUDITOR','CONSULTA','GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN','GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN','GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN','GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'CONSULTA','AUDITOR','GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN','AUDITOR','GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN','GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'CONSULTA','AUDITOR','GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN','GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN','GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN','GESTOR' ] }
    ];

    this.menuItems = todoElMenu.filter(item => item.roles.includes(this.rolUsuario));
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
      parametros: {}
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
          this.error = err.error?.message || 'No se pudo crear el reporte.';
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
          this.error = err.error?.message || 'No se pudo actualizar el reporte.';
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
