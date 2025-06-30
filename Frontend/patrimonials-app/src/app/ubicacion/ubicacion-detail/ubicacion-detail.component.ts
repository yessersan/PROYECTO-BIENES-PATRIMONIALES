import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ubicacion-detail',
  standalone: false,
  templateUrl: './ubicacion-detail.component.html',
  styleUrl: './ubicacion-detail.component.css'
})
export class UbicacionDetailComponent implements OnInit {
  ubicacion: Partial<Ubicacion> = {};
  bienes: Bien[] = [];
  id: string | null = null;
  esNuevo = false;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';
    if (!this.esNuevo && this.id) {
      this.loading = true;
      this.api.getUbicacion(Number(this.id)).subscribe({
        next: (data) => {
          this.ubicacion = data;
          this.loading = false;
        },
        error: () => { this.error = 'No se pudo cargar la ubicación'; this.loading = false; }
      });

      // Cargar bienes en esta ubicación
      this.api.getBienes().subscribe({
        next: (bienes) => {
          this.bienes = bienes.filter(b => b.ubicacion === Number(this.id));
        }
      });
    }
  }

  guardar() {
    if (this.esNuevo) {
      this.api.createUbicacion(this.ubicacion).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: () => this.error = 'No se pudo crear la ubicación'
      });
    } else if (this.id) {
      this.api.updateUbicacion(Number(this.id), this.ubicacion).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: () => this.error = 'No se pudo actualizar la ubicación'
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿Eliminar esta ubicación?')) {
      this.api.deleteUbicacion(Number(this.id)).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: () => this.error = 'No se pudo eliminar la ubicación'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/ubicaciones']);
  }
}