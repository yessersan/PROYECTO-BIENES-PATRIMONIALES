import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { Responsable } from '../../models/responsable.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getCategorias().subscribe(c => this.categorias = c);
    this.apiService.getUbicaciones().subscribe(u => this.ubicaciones = u);
    this.apiService.getResponsables().subscribe(r => this.responsables = r);
  }

  crearBien() {
    // Convierte responsable a null si no se selecciona
    if (!this.bien.responsable) this.bien.responsable = null;
    this.apiService.createBien(this.bien).subscribe({
      next: () => {
        this.success = 'Bien creado correctamente';
        setTimeout(() => this.router.navigate(['/bienes']), 1000);
      },
      error: (err) => this.error = 'Error al crear bien: ' + (err.error?.message || 'Error desconocido')
    });
  }

  volver() {
    this.router.navigate(['/bienes']);
  }
}
