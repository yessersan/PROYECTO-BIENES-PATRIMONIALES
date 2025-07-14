import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-bien-dar-baja',
  standalone: false,
  templateUrl: './bien-dar-baja.component.html',
  styleUrls: ['./bien-dar-baja.component.css']
})
export class BienDarBajaComponent implements OnInit {
  loading: boolean = false;
  mensaje: string = '';
  error: string = '';
  motivo: string = '';
  usuarioActual: Usuario | null = null;
  rolUsuario = '';

  menuItems: any[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.verificarPermiso();
        this.filtrarMenuPorRol();
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario actual';
      }
    });
  }

  verificarPermiso() {
    if (!['ADMIN', 'GESTOR'].includes(this.rolUsuario.toUpperCase())) {
      this.router.navigate(['/dashboard']);
    }
  }

  filtrarMenuPorRol() {
    const menuCompleto = [
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

    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  darDeBaja() {
    if (!this.motivo.trim()) {
      this.error = 'Por favor, proporcione un motivo para la baja.';
      return;
    }
    const id = this.route.snapshot.params['id'];
    this.apiService.darBajaBien(id, { motivo: this.motivo }).subscribe({
      next: () => {
        this.mensaje = 'Bien dado de baja correctamente';
        setTimeout(() => this.router.navigate(['/bienes']), 1500);
      },
      error: (err) => this.error = 'Error al dar de baja el bien: ' + (err.error?.message || err.message)
    });
  }
}
