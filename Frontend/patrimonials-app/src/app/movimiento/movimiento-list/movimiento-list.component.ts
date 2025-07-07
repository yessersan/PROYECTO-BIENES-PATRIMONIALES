import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Movimiento } from '../../models/movimiento.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimiento-list',
  standalone: false,
  templateUrl: './movimiento-list.component.html',
  styleUrls: ['./movimiento-list.component.css']
})
export class MovimientoListComponent implements OnInit {
  movimientos: Movimiento[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getMovimientos();
  }

  getMovimientos() {
    this.loading = true;
    this.api.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar movimientos';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/movimientos', id]);
  }

  eliminarMovimiento(id: number) {
    if (confirm('¿Eliminar este movimiento?')) {
      this.api.deleteMovimiento(id).subscribe({
        next: () => this.getMovimientos(),
        error: () => {
          this.error = 'No se pudo eliminar el movimiento';
        }
      });
    }
  }

  crearMovimiento() {
    this.router.navigate(['/movimientos', 'nuevo']);
  }
}