import { Component, OnInit } from '@angular/core';
import { Reporte } from '../../models/reporte.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-reporte-list',
  standalone: false,
  templateUrl: './reporte-list.component.html',
  styleUrl: './reporte-list.component.css'
})
export class ReporteListComponent implements OnInit {
  reportes: Reporte[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Para crear un nuevo reporte rápido (ajusta según tu modelo real)
  nuevoReporte: Partial<Reporte> = {
    tipo: 'INVENTARIO',
    formato: 'PDF',
    parametros: {}
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getReportes();
  }

  getReportes() {
    this.loading = true;
    this.api.getReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar reportes';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/reportes', id]);
  }

  crearReporte() {
    this.loading = true;
    this.api.createReporte(this.nuevoReporte).subscribe({
      next: (data) => {
        this.success = 'Reporte creado correctamente';
        this.getReportes();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo crear el reporte';
        this.loading = false;
      }
    });
  }

  eliminarReporte(id: number) {
    if (confirm('¿Seguro que desea eliminar este reporte?')) {
      this.api.deleteReporte(id).subscribe({
        next: () => this.getReportes(),
        error: () => alert('No se pudo eliminar el reporte')
      });
    }
  }
}