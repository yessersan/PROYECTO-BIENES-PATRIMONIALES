import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../models/responsable.model';
import { Usuario } from '../../models/usuario.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-responsable-list',
  standalone: false,
  templateUrl: './responsable-list.component.html',
  styleUrls: ['./responsable-list.component.css']
})
export class ResponsableListComponent implements OnInit {
  responsables: Responsable[] = [];
  usuarios: Usuario[] = [];
  loading = false;
  error: string | null = null;
  createForm: FormGroup;
  showCreateForm = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      usuario_id: ['', Validators.required],
      cargo: ['', Validators.required],
      departamento: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit() {
    this.loadResponsables();
    this.loadUsuariosDisponibles();
  }

  loadResponsables() {
    this.loading = true;
    this.apiService.getResponsables().subscribe({
      next: (data) => {
        this.responsables = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los responsables';
        this.loading = false;
        console.error('Error fetching responsables:', err);
      }
    });
  }

  loadUsuariosDisponibles() {
    this.loading = true;
    this.apiService.getUsuariosDisponibles().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los usuarios disponibles. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
        console.error('Error fetching available users:', err);
      }
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  createResponsable() {
    if (this.createForm.invalid) {
      this.error = 'Por favor, completa todos los campos requeridos';
      return;
    }

    console.log('Datos enviados:', this.createForm.value);
    this.loading = true;
    this.apiService.createResponsable(this.createForm.value).subscribe({
      next: () => {
        this.loadResponsables();
        this.createForm.reset({ activo: true });
        this.showCreateForm = false;
        this.error = null;
      },
      error: (err) => {
        this.error = err.error?.usuario_id?.[0] || err.message || 'Error al crear el responsable';
        this.loading = false;
        console.error('Error creating responsable:', err);
      }
    });
  }

  deleteResponsable(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este responsable?')) {
      this.loading = true;
      this.apiService.deleteResponsable(id).subscribe({
        next: () => {
          this.loadResponsables();
          this.error = null;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
          console.error('Error deleting responsable:', err);
        }
      });
    }
  }

  navigateToDetail(id: number) {
    this.router.navigate(['/responsables', id]);
  }

  isUsuarioObject(usuario: any): usuario is { username: string; email?: string; rol?: string } {
    return usuario && typeof usuario === 'object' && 'username' in usuario;
  }
}