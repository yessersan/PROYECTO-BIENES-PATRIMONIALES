import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-bien-mover',
  standalone: false,
  templateUrl: './bien-mover.component.html',
  styleUrls: ['./bien-mover.component.css']
})
export class BienMoverComponent implements OnInit {
  bienId: number;
  ubicacionId: number | null = null;
  ubicaciones: Ubicacion[] = [];
  error: string | null = null;
  success: string | null = null;
  usuarioActual: Usuario | null = null;
  rolUsuario: string = '';
  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.bienId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        this.rolUsuario = usuario.rol.toUpperCase();
        this.verificarPermisos();
        this.filtrarMenuPorRol();
        this.cargarUbicaciones();
      },
      error: () => {
        this.error = 'Error al obtener datos del usuario';
      }
    });
  }

  verificarPermisos() {
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
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] }
    ];

    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  cargarUbicaciones() {
    this.apiService.getUbicaciones().subscribe({
      next: (ubicaciones) => this.ubicaciones = ubicaciones,
      error: (err) => this.error = 'Error al cargar ubicaciones: ' + (err.error?.message || 'Error desconocido')
    });
  }

  mover() {
    if (this.ubicacionId) {
      this.apiService.moverBien(this.bienId, { nueva_ubicacion_id: this.ubicacionId }).subscribe({
        next: () => this.success = 'Bien movido correctamente',
        error: (err) => this.error = 'Error al mover bien: ' + (err.error?.message || 'Error desconocido')
      });
    }
  }
}
