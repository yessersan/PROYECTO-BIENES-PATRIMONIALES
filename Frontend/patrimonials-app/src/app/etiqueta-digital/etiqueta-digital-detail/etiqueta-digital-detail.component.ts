import { Component, OnInit } from '@angular/core';
import { EtiquetaDigital } from '../../models/etiqueta-digital.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-etiqueta-digital-detail',
  standalone: false,
  templateUrl: './etiqueta-digital-detail.component.html',
  styleUrl: './etiqueta-digital-detail.component.css'
})
export class EtiquetaDigitalDetailComponent implements OnInit {
  etiqueta: Partial<EtiquetaDigital> = {};
  id: string | null = null;
  esNuevo = false;
  error = '';
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();

        this.id = this.route.snapshot.paramMap.get('id');
        this.esNuevo = this.id === 'nuevo';
        if (!this.esNuevo && this.id) {
          this.api.getEtiquetaDigital(Number(this.id)).subscribe({
            next: (data) => this.etiqueta = data,
            error: () => this.error = 'no se pudo cargar la etiqueta digital'
          });
        }
      },
      error: () => {
        this.error = 'no se pudo cargar el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const menuCompleto = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN','AUDITOR','GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN','GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN','GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN','GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN','GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN','GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN','GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN','GESTOR'] },
    ];

    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  guardar() {
    if (this.esNuevo) {
      this.api.createEtiquetaDigital(this.etiqueta).subscribe({
        next: () => this.router.navigate(['/etiquetas-digitales']),
        error: () => this.error = 'no se pudo crear la etiqueta digital'
      });
    } else if (this.id) {
      this.api.updateEtiquetaDigital(Number(this.id), this.etiqueta).subscribe({
        next: () => this.router.navigate(['/etiquetas-digitales']),
        error: () => this.error = 'no se pudo actualizar la etiqueta digital'
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿Eliminar esta etiqueta digital?')) {
      this.api.deleteEtiquetaDigital(Number(this.id)).subscribe({
        next: () => this.router.navigate(['/etiquetas-digitales']),
        error: () => this.error = 'no se pudo eliminar la etiqueta digital'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/etiquetas-digitales']);
  }
}
