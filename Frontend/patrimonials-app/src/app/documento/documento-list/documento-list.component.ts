import { Component, OnInit } from '@angular/core';
import { Documento } from '../../models/documento.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-documento-list',
  standalone: false,
  templateUrl: './documento-list.component.html',
  styleUrl: './documento-list.component.css'
})
export class DocumentoListComponent implements OnInit {
  documentos: Documento[] = [];
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
        this.rolUsuario = user.rol?.toUpperCase();

        const rolesPermitidos = ['ADMIN', 'GESTOR'];
        if (!rolesPermitidos.includes(this.rolUsuario)) {
          this.error = 'no tienes permiso para acceder a documentos';
          window.alert(this.error);
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();
        this.getDocumentos();
      },
      error: () => {
        this.error = 'no se pudo obtener el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const todoElMenu = [
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

    this.menuItems = todoElMenu.filter(item => item.roles.includes(this.rolUsuario));
  }

  getDocumentos() {
    this.loading = true;
    this.api.getDocumentos().subscribe({
      next: (data) => { this.documentos = data; this.loading = false; },
      error: () => { this.error = 'error al cargar documentos'; this.loading = false; }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/documentos', id]);
  }

  eliminarDocumento(id: number) {
    if (confirm('¿eliminar este documento?')) {
      this.api.deleteDocumento(id).subscribe({
        next: () => this.getDocumentos(),
        error: () => alert('no se pudo eliminar el documento')
      });
    }
  }

  crearDocumento() {
    this.router.navigate(['/documentos', 'nuevo']);
  }
}
