import { Component, OnInit } from '@angular/core';
import { Mantenimiento } from '../../models/mantenimiento.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mantenimiento-list',
  standalone: false,
  templateUrl: './mantenimiento-list.component.html',
  styleUrl: './mantenimiento-list.component.css'
})
export class MantenimientoListComponent implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  loading = false;
  error: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.getMantenimientos();
  }

  getMantenimientos() {
    this.loading = true;
    this.api.getMantenimientos().subscribe({
      next: (data) => {
        this.mantenimientos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar mantenimientos';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/mantenimientos', id]);
  }

  iniciarMantenimiento(id: number) {
    this.router.navigate(['/mantenimientos/iniciar', id]);
  }

  finalizarMantenimiento(id: number) {
    this.router.navigate(['/mantenimientos/finalizar', id]);
  }

  eliminarMantenimiento(id: number) {
    if (confirm('¿Seguro que desea eliminar este mantenimiento?')) {
      this.api.deleteMantenimiento(id).subscribe({
        next: () => this.getMantenimientos(),
        error: () => alert('No se pudo eliminar el mantenimiento')
      });
    }
  }
}