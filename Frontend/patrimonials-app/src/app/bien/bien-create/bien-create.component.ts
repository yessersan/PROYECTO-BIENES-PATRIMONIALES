import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Responsable } from '../../models/responsable.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-bien-create',
  standalone: false,
  templateUrl: './bien-create.component.html',
  styleUrl: './bien-create.component.css'
})
export class BienCreateComponent implements OnInit {
  bien: any = {
    codigo: '',
    descripcion: '',
    valor_adquisicion: null,
    fecha_adquisicion: '',
    estado: 'BUENO',
    categoria: null,
    ubicacion: null,
    responsable: null
  };
  categorias: Categoria[] = [];
  ubicaciones: Ubicacion[] = [];
  responsables: Responsable[] = [];
  error: string | null = null;
  success: string | null = null;

  usuarioActual: Usuario | null = null;
  rolUsuario: string = '';
  menuItems: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();

        // restringe solo a admin y gestor
        if (!['ADMIN', 'GESTOR'].includes(this.rolUsuario)) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.apiService.getCategorias().subscribe(c => this.categorias = c);
        this.apiService.getUbicaciones().subscribe(u => this.ubicaciones = u);
        this.apiService.getResponsables().subscribe(r => this.responsables = r);
      },
      error: () => {
        this.error = 'no se pudo cargar el usuario actual';
      }
    });
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

  crearBien() {
    if (!['ADMIN', 'GESTOR'].includes(this.rolUsuario)) {
      this.error = 'no tiene permisos para crear bienes';
      return;
    }

    if (!this.bien.responsable) this.bien.responsable = null;

    this.apiService.createBien(this.bien).subscribe({
      next: () => {
        this.success = 'bien creado correctamente';
        setTimeout(() => this.router.navigate(['/bienes']), 1000);
      },
      error: (err) =>
        this.error = 'error al crear bien: ' + (err.error?.message || 'error desconocido')
    });
  }

  volver() {
    this.router.navigate(['/bienes']);
  }
}
