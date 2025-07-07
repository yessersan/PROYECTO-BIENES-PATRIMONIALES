import { Component, OnInit } from '@angular/core';
import { EtiquetaDigital } from '../../models/etiqueta-digital.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-etiqueta-digital-detail',
  standalone: false,
  templateUrl: './etiqueta-digital-detail.component.html',
  styleUrl: './etiqueta-digital-detail.component.css'
})
export class EtiquetaDigitalDetailComponent implements OnInit {
  etiqueta: Partial<EtiquetaDigital> = {};
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
      this.api.getEtiquetaDigital(Number(this.id)).subscribe({
        next: (data) => this.etiqueta = data,
        error: () => this.error = 'No se pudo cargar la etiqueta digital'
      });
    }
  }

  guardar() {
    if (this.esNuevo) {
      this.api.createEtiquetaDigital(this.etiqueta).subscribe({
        next: () => this.router.navigate(['/etiquetas-digitales']),
        error: () => this.error = 'No se pudo crear la etiqueta digital'
      });
    } else if (this.id) {
      this.api.updateEtiquetaDigital(Number(this.id), this.etiqueta).subscribe({
        next: () => this.router.navigate(['/etiquetas-digitales']),
        error: () => this.error = 'No se pudo actualizar la etiqueta digital'
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿Eliminar esta etiqueta digital?')) {
      this.api.deleteEtiquetaDigital(Number(this.id)).subscribe({
        next: () => this.router.navigate(['/etiquetas-digitales']),
        error: () => this.error = 'No se pudo eliminar la etiqueta digital'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/etiquetas-digitales']);
  }
}