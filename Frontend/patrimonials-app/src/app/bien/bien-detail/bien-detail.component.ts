import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Bien } from '../../models/bien.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Responsable } from '../../models/responsable.model';
<<<<<<< HEAD
=======
import { Categoria } from '../../models/categoria.model';
>>>>>>> origin/yezer

@Component({
  selector: 'app-bien-detail',
  templateUrl: './bien-detail.component.html',
  styleUrls: ['./bien-detail.component.css'],
  standalone: false
})
export class BienDetailComponent implements OnInit {
  bien: Bien | null = null;
  ubicacion?: Ubicacion;
  responsable?: Responsable;
<<<<<<< HEAD
=======
  categoria?: Categoria;
>>>>>>> origin/yezer
  editMode = false;
  editedBien: Partial<Bien> = {};
  error: string | null = null;
  showDeleteConfirm = false;
  loading = true;
<<<<<<< HEAD

  constructor(
    private route: ActivatedRoute,
    private router: Router,
=======
  categorias: Categoria[] = [];
  ubicaciones: Ubicacion[] = [];
  responsables: Responsable[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
>>>>>>> origin/yezer
    private apiService: ApiService
  ) {}

  ngOnInit() {
<<<<<<< HEAD
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadBien(id);
=======
    this.loadCategorias();
    this.loadUbicaciones();
    this.loadResponsables();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === 'nuevo') {
      this.editMode = true;
      this.bien = null;
      this.editedBien = { estado: 'BUENO', activo: true };
      this.loading = false;
    } else {
      const id = +idParam!;
      this.loadBien(id);
    }
  }

  loadCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  loadUbicaciones() {
    this.apiService.getUbicaciones().subscribe({
      next: (ubicaciones) => this.ubicaciones = ubicaciones,
      error: (err) => console.error('Error cargando ubicaciones:', err)
    });
  }

  loadResponsables() {
    this.apiService.getResponsables().subscribe({
      next: (responsables) => this.responsables = responsables,
      error: (err) => console.error('Error cargando responsables:', err)
    });
>>>>>>> origin/yezer
  }

  loadBien(id: number) {
    this.loading = true;
    this.apiService.getBien(id).subscribe({
      next: (bien) => {
        this.bien = bien;
        this.editedBien = { 
<<<<<<< HEAD
          descripcion: bien.descripcion, 
          estado: bien.estado 
        };
        
        // Cargar ubicación si existe
=======
          codigo: bien.codigo,
          descripcion: bien.descripcion,
          estado: bien.estado,
          ubicacion: bien.ubicacion,
          responsable: bien.responsable,
          valor_adquisicion: bien.valor_adquisicion,
          fecha_adquisicion: bien.fecha_adquisicion,
          categoria: bien.categoria,
          marca: bien.marca,
          modelo: bien.modelo,
          serie: bien.serie,
          activo: bien.activo
        };
        
>>>>>>> origin/yezer
        if (bien.ubicacion) {
          this.apiService.getUbicacion(bien.ubicacion).subscribe({
            next: (ubicacion) => this.ubicacion = ubicacion,
            error: (err) => console.error('Error cargando ubicación:', err)
          });
        }
        
<<<<<<< HEAD
        // Cargar responsable si existe
=======
>>>>>>> origin/yezer
        if (bien.responsable) {
          this.apiService.getResponsable(bien.responsable).subscribe({
            next: (responsable) => this.responsable = responsable,
            error: (err) => console.error('Error cargando responsable:', err)
          });
        }
        
<<<<<<< HEAD
=======
        if (bien.categoria) {
          this.apiService.getCategoria(bien.categoria).subscribe({
            next: (categoria) => this.categoria = categoria,
            error: (err) => console.error('Error cargando categoría:', err)
          });
        }
        
>>>>>>> origin/yezer
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar bien: ' + (err.error?.message || 'Error desconocido');
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.bien) {
      this.editedBien = { 
<<<<<<< HEAD
        descripcion: this.bien.descripcion, 
        estado: this.bien.estado 
=======
        codigo: this.bien.codigo,
        descripcion: this.bien.descripcion,
        estado: this.bien.estado,
        ubicacion: this.bien.ubicacion,
        responsable: this.bien.responsable,
        valor_adquisicion: this.bien.valor_adquisicion,
        fecha_adquisicion: this.bien.fecha_adquisicion,
        categoria: this.bien.categoria,
        marca: this.bien.marca,
        modelo: this.bien.modelo,
        serie: this.bien.serie,
        activo: this.bien.activo
>>>>>>> origin/yezer
      };
    }
  }

  saveChanges() {
<<<<<<< HEAD
    if (this.bien) {
=======
    if (!this.bien) {
      // Crear nuevo bien
      this.apiService.createBien(this.editedBien).subscribe({
        next: (bien) => {
          this.router.navigate(['/bienes', bien.id]);
        },
        error: (err) => this.error = 'Error al crear bien: ' + (err.error?.message || 'Error desconocido')
      });
    } else {
      // Actualizar bien existente
>>>>>>> origin/yezer
      this.apiService.updateBien(this.bien.id, this.editedBien).subscribe({
        next: (updatedBien) => {
          this.bien = updatedBien;
          this.editMode = false;
          this.error = null;
        },
        error: (err) => this.error = 'Error al actualizar bien: ' + (err.error?.message || 'Error desconocido')
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
          this.error = 'Error al eliminar bien: ' + (err.error?.message || 'Error desconocido');
          this.showDeleteConfirm = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/bienes']);
  }

  moveBien() {
    if (this.bien) {
      this.router.navigate(['/bienes', this.bien.id, 'mover']);
    }
  }
<<<<<<< HEAD
=======

  darBaja() {
    if (this.bien) {
      this.router.navigate(['/bienes', this.bien.id, 'dar-baja']);
    }
  }
>>>>>>> origin/yezer
}