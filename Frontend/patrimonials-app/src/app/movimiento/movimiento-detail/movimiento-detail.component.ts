import { Component, OnInit } from '@angular/core';
import { Movimiento } from '../../models/movimiento.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movimiento-detail',
  standalone: false,
  templateUrl: './movimiento-detail.component.html',
  styleUrl: './movimiento-detail.component.css'
})
export class MovimientoDetailComponent implements OnInit {
  movimiento: Partial<Movimiento> = {};
  id: string | null = null;
  esNuevo = false;
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
      this.api.getMovimiento(Number(this.id)).subscribe({
        next: (mov) => this.movimiento = mov,
        error: () => this.error = 'No se pudo cargar el movimiento'
      });
    }
  }

  guardar() {
    if (this.esNuevo) {
      this.api.createMovimiento(this.movimiento).subscribe({
        next: () => this.router.navigate(['/movimientos']),
        error: () => this.error = 'No se pudo crear el movimiento'
      });
    } else if (this.id) {
      this.api.updateMovimiento(Number(this.id), this.movimiento).subscribe({
        next: () => this.router.navigate(['/movimientos']),
        error: () => this.error = 'No se pudo actualizar el movimiento'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/movimientos']);
  }
}