import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-bien-dar-baja',
  standalone: false,
  templateUrl: './bien-dar-baja.component.html',
  styleUrls: ['./bien-dar-baja.component.css']
})
export class BienDarBajaComponent {
  loading: boolean = false;
  mensaje: string = '';
  error: string = '';
  motivo: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  darDeBaja() {
    if (!this.motivo.trim()) {
      this.error = 'Por favor, proporcione un motivo para la baja.';
      return;
    }
    const id = this.route.snapshot.params['id'];
    this.apiService.darBajaBien(id, { motivo: this.motivo }).subscribe({
      next: () => {
        this.mensaje = 'Bien dado de baja correctamente';
        setTimeout(() => this.router.navigate(['/bienes']), 1500);
      },
      error: (err) => this.error = 'Error al dar de baja el bien: ' + (err.error?.message || err.message)
    });
  }
}