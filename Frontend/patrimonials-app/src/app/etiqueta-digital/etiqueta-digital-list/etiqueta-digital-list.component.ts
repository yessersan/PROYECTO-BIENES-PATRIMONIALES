<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { EtiquetaDigital } from '../../models/etiqueta-digital.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
>>>>>>> origin/yezer

@Component({
  selector: 'app-etiqueta-digital-list',
  standalone: false,
  templateUrl: './etiqueta-digital-list.component.html',
  styleUrl: './etiqueta-digital-list.component.css'
})
<<<<<<< HEAD
export class EtiquetaDigitalListComponent {

}
=======
export class EtiquetaDigitalListComponent implements OnInit {
  etiquetas: EtiquetaDigital[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getEtiquetas();
  }

  getEtiquetas() {
    this.loading = true;
    this.api.getEtiquetasDigitales().subscribe({
      next: (data) => { this.etiquetas = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar etiquetas digitales'; this.loading = false; }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/etiquetas-digitales', id]);
  }

  eliminarEtiqueta(id: number) {
    if (confirm('¿Eliminar esta etiqueta digital?')) {
      this.api.deleteEtiquetaDigital(id).subscribe({
        next: () => this.getEtiquetas(),
        error: () => alert('No se pudo eliminar la etiqueta digital')
      });
    }
  }

  crearEtiqueta() {
    this.router.navigate(['/etiquetas-digitales', 'nuevo']);
  }

  generarQR(id: number) {
    this.router.navigate(['/etiquetas-digitales/generar-qr', id]);
  }
}

>>>>>>> origin/yezer
