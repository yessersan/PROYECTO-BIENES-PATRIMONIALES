import { Component, OnInit } from '@angular/core';
import { HistorialAuditoria } from '../../models/historial-auditoria.model';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';
import { Bien } from '../../models/bien.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-auditoria-list',
  standalone: false,
  templateUrl: './historial-auditoria-list.component.html',
  styleUrl: './historial-auditoria-list.component.css'
})
export class HistorialAuditoriaListComponent implements OnInit {
  historial: HistorialAuditoria[] = [];
  usuarios: Usuario[] = [];
  bienes: Bien[] = [];
  loading = false;
  error: string | null = null;

  form: Partial<HistorialAuditoria> = {};
  editMode = false;
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol?.toUpperCase(); // ✅ fuerza a mayúsculas

        this.filtrarMenuPorRol();

        if (!['ADMIN', 'AUDITOR', 'GESTOR'].includes(this.rolUsuario)) {
          this.router.navigate(['/no-autorizado']); // 🚫 redirección si no tiene permiso
          return;
        }

        this.getHistorial();
        this.api.getUsuarios().subscribe(data => this.usuarios = data);
        this.api.getBienes().subscribe(data => this.bienes = data);
      },
      error: () => {
        this.error = 'no se pudo cargar el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const menuCompleto = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN', 'AUDITOR', 'GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'AUDITOR', 'GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'AUDITOR', 'GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'AUDITOR', 'GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'AUDITOR', 'GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] },
    ];

    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  getUsuarioNombre(id: number): string {
    const usuario = this.usuarios.find(u => u.id === id);
    return usuario ? usuario.username : id?.toString();
  }

  getBienCodigo(id: number): string {
    const bien = this.bienes.find(b => b.id === id);
    return bien ? bien.codigo : id?.toString();
  }

  getHistorial() {
    this.loading = true;
    this.api.getHistorialAuditoria().subscribe({
      next: (data) => {
        this.historial = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'error al cargar historial';
        this.loading = false;
      }
    });
  }

  eliminar(id: number) {
    if (this.rolUsuario !== 'AUDITOR') {
      if (confirm('¿eliminar este registro de auditoría?')) {
        this.api.deleteHistorialAuditoria(id).subscribe({
          next: () => this.getHistorial(),
          error: () => alert('no se pudo eliminar el registro')
        });
      }
    }
  }

  editar(h: HistorialAuditoria) {
    if (this.rolUsuario !== 'AUDITOR') {
      this.form = { ...h };
      if (this.form.fecha) {
        this.form.fecha = this.form.fecha.split("T")[0];
      }
      this.editMode = true;
    }
  }

  cancelar() {
    this.form = {};
    this.editMode = false;
  }

  guardar() {
    if (this.rolUsuario === 'AUDITOR') return;

    if (this.editMode && this.form.id) {
      this.api.updateHistorialAuditoria(this.form.id, this.form).subscribe({
        next: () => {
          this.getHistorial();
          this.cancelar();
        },
        error: () => alert('no se pudo actualizar el registro')
      });
    } else {
      this.api.createHistorialAuditoria(this.form).subscribe({
        next: () => {
          this.getHistorial();
          this.cancelar();
        },
        error: (err) => {
          alert('no se pudo crear el registro');
          console.error(err);
        }
      });
    }
  }
}
