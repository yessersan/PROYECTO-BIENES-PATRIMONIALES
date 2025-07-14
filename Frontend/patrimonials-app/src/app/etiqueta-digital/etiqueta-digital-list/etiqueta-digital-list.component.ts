import { Component, OnInit } from '@angular/core';
import { EtiquetaDigital } from '../../models/etiqueta-digital.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-etiqueta-digital-list',
  standalone: false,
  templateUrl: './etiqueta-digital-list.component.html',
  styleUrl: './etiqueta-digital-list.component.css'
})
export class EtiquetaDigitalListComponent implements OnInit {
  etiquetas: EtiquetaDigital[] = [];
  loading = false;
  error = '';
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();
        this.getEtiquetas();
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

  getEtiquetas() {
    this.loading = true;
    this.api.getEtiquetasDigitales().subscribe({
      next: (data) => {
        this.etiquetas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'error al cargar etiquetas digitales';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/etiquetas-digitales', id]);
  }

  eliminarEtiqueta(id: number) {
    if (confirm('¿eliminar esta etiqueta digital?')) {
      this.api.deleteEtiquetaDigital(id).subscribe({
        next: () => this.getEtiquetas(),
        error: () => alert('no se pudo eliminar la etiqueta digital')
      });
    }
  }

  crearEtiqueta() {
    this.router.navigate(['/etiquetas-digitales', 'nuevo']);
  }

  generarQR(id: number) {
    this.router.navigate(['/etiquetas-digitales/generar-qr', id]);
  }
}
