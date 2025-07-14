import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../models/responsable.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-responsable-detail',
  standalone: false,
  templateUrl: './responsable-detail.component.html',
  styleUrls: ['./responsable-detail.component.css']
})
export class ResponsableDetailComponent implements OnInit {
  responsable: Responsable | null = null;
  loading = false;
  error: string | null = null;
  editForm: FormGroup;
  isEditing = false;

  usuarioActual: Usuario | null = null;
  rolUsuario: string = '';
  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      usuario_id: ['', Validators.required],
      cargo: ['', Validators.required],
      departamento: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.loadResponsable(+id);
        }
      },
      error: () => {
        this.error = 'no se pudo cargar el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const menuCompleto = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN','AUDITOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN','AUDITOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN','AUDITOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN','AUDITOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN','AUDITOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN'] },
    ];
    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  loadResponsable(id: number) {
    this.loading = true;
    this.apiService.getResponsable(id).subscribe({
      next: (data) => {
        this.responsable = data;
        this.editForm.patchValue({
          usuario_id: data.usuario.id,
          cargo: data.cargo,
          departamento: data.departamento,
          activo: data.activo
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'no se pudo cargar el responsable';
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    if (this.rolUsuario !== 'AUDITOR') {
      this.isEditing = !this.isEditing;
    }
  }

  updateResponsable() {
    if (this.rolUsuario === 'AUDITOR') return;

    if (this.editForm.invalid) {
      this.error = 'por favor, completa todos los campos requeridos';
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.apiService.updateResponsable(+id, this.editForm.value).subscribe({
        next: () => {
          this.loadResponsable(+id);
          this.isEditing = false;
          this.error = null;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        }
      });
    }
  }

  isUsuarioObject(usuario: any): usuario is { username: string, email?: string, rol?: string } {
    return usuario && typeof usuario === 'object' && 'username' in usuario;
  }
}
