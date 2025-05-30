import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Bien } from '../../models/bien.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Responsable } from '../../models/responsable.model';

@Component({
  selector: 'app-bien-detail',
  templateUrl: './bien-detail.component.html',
  styleUrls: ['./bien-detail.component.css']
})
export class BienDetailComponent implements OnInit {
  bien: Bien | null = null;
  ubicacion?: Ubicacion;
  responsable?: Responsable;
  editMode = false;
  editedBien: Partial<Bien> = {};
  error: string | null = null;
  showDeleteConfirm = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadBien(id);
  }

  loadBien(id: number) {
    this.loading = true;
    this.apiService.getBien(id).subscribe({
      next: (bien) => {
        this.bien = bien;
        this.editedBien = { 
          descripcion: bien.descripcion, 
          estado: bien.estado 
        };
        
        // Cargar ubicación si existe
        if (bien.ubicacion) {
          this.apiService.getUbicacion(bien.ubicacion).subscribe({
            next: (ubicacion) => this.ubicacion = ubicacion,
            error: (err) => console.error('Error cargando ubicación:', err)
          });
        }
        
        // Cargar responsable si existe
        if (bien.responsable) {
          this.apiService.getResponsable(bien.responsable).subscribe({
            next: (responsable) => this.responsable = responsable,
            error: (err) => console.error('Error cargando responsable:', err)
          });
        }
        
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
        descripcion: this.bien.descripcion, 
        estado: this.bien.estado 
      };
    }
  }

  saveChanges() {
    if (this.bien) {
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
}