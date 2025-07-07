<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
>>>>>>> origin/yezer

@Component({
  selector: 'app-mantenimiento-finalizar',
  standalone: false,
  templateUrl: './mantenimiento-finalizar.component.html',
  styleUrl: './mantenimiento-finalizar.component.css'
})
<<<<<<< HEAD
export class MantenimientoFinalizarComponent {

}
=======
export class MantenimientoFinalizarComponent implements OnInit {
  id!: number;
  observaciones = '';
  costo?: number;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  finalizar() {
    this.loading = true;
    this.api.finalizarMantenimiento(this.id, {
      observaciones: this.observaciones,
      costo: this.costo
    }).subscribe({
      next: (res) => {
        this.success = 'Mantenimiento finalizado correctamente';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudo finalizar el mantenimiento';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/mantenimientos']);
  }
}
>>>>>>> origin/yezer
