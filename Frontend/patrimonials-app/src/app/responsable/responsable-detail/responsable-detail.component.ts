<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../models/responsable.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
>>>>>>> origin/yezer

@Component({
  selector: 'app-responsable-detail',
  standalone: false,
  templateUrl: './responsable-detail.component.html',
<<<<<<< HEAD
  styleUrl: './responsable-detail.component.css'
})
export class ResponsableDetailComponent {

}
=======
  styleUrls: ['./responsable-detail.component.css']
})
export class ResponsableDetailComponent implements OnInit {
  responsable: Responsable | null = null;
  loading = false;
  error: string | null = null;
  editForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public router: Router, // Changed from private to public
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      usuario_id: ['', Validators.required],
      cargo: ['', Validators.required],
      departamento: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadResponsable(+id);
    }
  }

  loadResponsable(id: number) {
    this.loading = true;
    this.apiService.getResponsable(id).subscribe({
      next: (data) => {
        this.responsable = data;
        this.editForm.patchValue({
          usuario_id: data.usuario.id,
          cargo: data.cargo,
          departamento: data.departamento,
          activo: data.activo
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el responsable';
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateResponsable() {
    if (this.editForm.invalid) {
      this.error = 'Por favor, completa todos los campos requeridos';
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.apiService.updateResponsable(+id, this.editForm.value).subscribe({
        next: () => {
          this.loadResponsable(+id);
          this.isEditing = false;
          this.error = null;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        }
      });
    }
  }

  isUsuarioObject(usuario: any): usuario is { username: string, email?: string, rol?: string } {
    return usuario && typeof usuario === 'object' && 'username' in usuario;
  }
}
>>>>>>> origin/yezer
