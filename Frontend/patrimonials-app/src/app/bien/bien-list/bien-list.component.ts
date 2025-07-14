import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Bien } from '../../models/bien.model';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-bien-list',
  standalone: false,
  templateUrl: './bien-list.component.html',
  styleUrls: ['./bien-list.component.css']
})
export class BienListComponent implements OnInit {
  bienes: Bien[] = [];
  error: string | null = null;
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        this.rolUsuario = usuario.rol.toUpperCase();
        this.verificarPermiso();
        this.filtrarMenuPorRol();
        this.cargarBienes();
      },
      error: () => {
        this.error = 'error al obtener datos del usuario';
      }
    });
  }

  verificarPermiso() {
    if (!['ADMIN', 'GESTOR'].includes(this.rolUsuario)) {
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

  cargarBienes() {
    this.apiService.getBienes().subscribe({
      next: (bienes) => this.bienes = bienes,
      error: (err) => this.error = 'Error al cargar bienes: ' + (err.error?.message || 'Error desconocido')
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/bienes', id]);
  }

  moveBien(id: number) {
    this.router.navigate(['/bienes', id, 'mover']);
  }

  crearBien() {
    this.router.navigate(['/bienes/crear']);
  }
}
