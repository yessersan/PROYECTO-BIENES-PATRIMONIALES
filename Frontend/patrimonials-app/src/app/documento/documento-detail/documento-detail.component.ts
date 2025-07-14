import { Component, OnInit } from '@angular/core';
import { Documento } from '../../models/documento.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-documento-detail',
  standalone: false,
  templateUrl: './documento-detail.component.html',
  styleUrl: './documento-detail.component.css'
})
export class DocumentoDetailComponent implements OnInit {
  documento: Partial<Documento> = {};
  id: string | null = null;
  esNuevo = false;
  error = '';
  archivo: File | null = null;
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
        this.rolUsuario = user.rol?.toUpperCase();

        const rolesPermitidos = ['ADMIN', 'GESTOR'];

        if (!rolesPermitidos.includes(this.rolUsuario)) {
          this.error = 'no tienes permiso para acceder a documentos';
          window.alert(this.error);
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();

        this.id = this.route.snapshot.paramMap.get('id');
        this.esNuevo = this.id === 'nuevo';
        if (!this.esNuevo && this.id) {
          this.api.getDocumento(Number(this.id)).subscribe({
            next: (doc) => this.documento = doc,
            error: () => this.error = 'no se pudo cargar el documento'
          });
        }
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
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] }
    ];

    this.menuItems = todoElMenu.filter(item => item.roles.includes(this.rolUsuario));
  }

  onFileChange(event: any) {
    if (event.target.files.length) {
      this.archivo = event.target.files[0];
    }
  }

  guardar() {
    const formData = new FormData();
    if (this.archivo) formData.append('ruta_archivo', this.archivo);
    if (this.documento.tipo) formData.append('tipo', this.documento.tipo);
    if (this.documento.bien) formData.append('bien', String(this.documento.bien));
    if (this.documento.usuario) formData.append('usuario', String(this.documento.usuario));
    if (this.documento.descripcion) formData.append('descripcion', this.documento.descripcion);
    if (this.documento.fecha_documento) formData.append('fecha_documento', this.documento.fecha_documento);

    if (this.esNuevo) {
      this.api.createDocumento(formData).subscribe({
        next: () => this.router.navigate(['/documentos']),
        error: () => this.error = 'no se pudo crear el documento'
      });
    } else if (this.id) {
      this.api.updateDocumento(Number(this.id), formData).subscribe({
        next: () => this.router.navigate(['/documentos']),
        error: () => this.error = 'no se pudo actualizar el documento'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/documentos']);
  }
}
