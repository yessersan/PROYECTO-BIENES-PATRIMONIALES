import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Bien } from '../../models/bien.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Responsable } from '../../models/responsable.model';
import { Categoria } from '../../models/categoria.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-bien-detail',
  standalone: false,
  templateUrl: './bien-detail.component.html',
  styleUrls: ['./bien-detail.component.css'],
})
export class BienDetailComponent implements OnInit {
  bien: Bien | null = null;
  ubicacion?: Ubicacion;
  responsable?: Responsable;

  categorias: Categoria[] = [];
  ubicaciones: Ubicacion[] = [];
  responsables: Responsable[] = [];

  editMode = false;
  editedBien: Partial<Bien> = {};
  error: string | null = null;
  showDeleteConfirm = false;
  loading = true;

  usuarioActual: Usuario | null = null;
  rolUsuario = '';

  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.verificarPermiso();
        this.filtrarMenuPorRol();
        this.cargarDatos();
      },
      error: () => {
        this.error = 'error al obtener el usuario actual';
        this.loading = false;
      },
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
    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario.toUpperCase()));
  }

  cargarDatos() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.error = 'ID de bien inválido';
      this.loading = false;
      return;
    }
    const id = +idParam;
    this.loadBien(id);
    this.loadCategorias();
    this.loadUbicaciones();
    this.loadResponsables();
  }

  loadBien(id: number) {
    this.loading = true;
    this.apiService.getBien(id).subscribe({
      next: (bien) => {
        this.bien = bien;
        this.editedBien = {
          descripcion: bien.descripcion,
          estado: bien.estado,
          valor_adquisicion: bien.valor_adquisicion,
          fecha_adquisicion: bien.fecha_adquisicion,
          categoria: bien.categoria,
          ubicacion: bien.ubicacion,
          responsable: bien.responsable,
        };

        if (bien.ubicacion) {
          this.apiService.getUbicacion(bien.ubicacion).subscribe({
            next: (ubicacion) => (this.ubicacion = ubicacion),
            error: (err) =>
              console.error('Error cargando ubicación:', err),
          });
        }

        if (bien.responsable) {
          this.apiService.getResponsable(bien.responsable).subscribe({
            next: (responsable) => (this.responsable = responsable),
            error: (err) =>
              console.error('Error cargando responsable:', err),
          });
        }

        this.loading = false;
      },
      error: (err) => {
        this.error =
          'Error al cargar bien: ' +
          (err.error?.message || 'Error desconocido');
        this.loading = false;
      },
    });
  }

  loadCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: (err) =>
        console.error('Error cargando categorías:', err),
    });
  }

  loadUbicaciones() {
    this.apiService.getUbicaciones().subscribe({
      next: (ubicaciones) => (this.ubicaciones = ubicaciones),
      error: (err) =>
        console.error('Error cargando ubicaciones:', err),
    });
  }

  loadResponsables() {
    this.apiService.getResponsables().subscribe({
      next: (responsables) => (this.responsables = responsables),
      error: (err) =>
        console.error('Error cargando responsables:', err),
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.bien) {
      this.editedBien = {
        descripcion: this.bien.descripcion,
        estado: this.bien.estado,
        valor_adquisicion: this.bien.valor_adquisicion,
        fecha_adquisicion: this.bien.fecha_adquisicion,
        categoria: this.bien.categoria,
        ubicacion: this.bien.ubicacion,
        responsable: this.bien.responsable,
      };
    }
  }

  saveChanges() {
    if (this.bien) {
      const payload: Bien = {
        id: this.bien.id,
        codigo: this.bien.codigo,
        serie: this.bien.serie || null,
        descripcion: this.editedBien.descripcion!,
        marca: this.bien.marca || null,
        modelo: this.bien.modelo || null,
        valor_adquisicion: this.editedBien.valor_adquisicion!,
        fecha_adquisicion: this.editedBien.fecha_adquisicion!,
        estado: this.editedBien.estado!,
        depreciacion: this.bien.depreciacion,
        valor_residual: this.bien.valor_residual,
        categoria: this.editedBien.categoria!,
        ubicacion: this.editedBien.ubicacion!,
        responsable: this.editedBien.responsable || null,
        fecha_registro: this.bien.fecha_registro,
        fecha_actualizacion: this.bien.fecha_actualizacion,
        activo: this.bien.activo,
      };

      this.apiService.updateBien(this.bien.id, payload).subscribe({
        next: (updatedBien) => {
          this.bien = updatedBien;
          this.editMode = false;
          this.error = null;

          if (updatedBien.ubicacion) {
            this.apiService.getUbicacion(updatedBien.ubicacion).subscribe({
              next: (ubicacion) => (this.ubicacion = ubicacion),
            });
          }

          if (updatedBien.responsable) {
            this.apiService.getResponsable(updatedBien.responsable).subscribe({
              next: (responsable) => (this.responsable = responsable),
            });
          }
        },
        error: (err) => {
          this.error =
            'Error al actualizar bien: ' +
            (err.error?.message || 'Error desconocido');
        },
      });
    }
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  deleteBien() {
    if (this.bien) {
      this.apiService.deleteBien(this.bien.id).subscribe({
        next: () => {
          this.router.navigate(['/bienes']);
        },
        error: (err) => {
          this.error =
            'Error al eliminar bien: ' +
            (err.error?.message || 'Error desconocido');
          this.showDeleteConfirm = false;
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/bienes']);
  }

  moveBien() {
    if (this.bien && ['ADMIN', 'GESTOR'].includes(this.rolUsuario.toUpperCase())) {
      this.router.navigate(['/bienes', this.bien.id, 'mover']);
    }
  }
}
