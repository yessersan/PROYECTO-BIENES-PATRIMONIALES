import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Ubicacion } from '../../models/ubicacion.model';

@Component({
  selector: 'app-bien-mover',
  standalone: false,
  templateUrl: './bien-mover.component.html',
  styleUrls: ['./bien-mover.component.css']
})
export class BienMoverComponent implements OnInit {
  bienId: number;
  ubicacionId: number | null = null;
  ubicaciones: Ubicacion[] = [];
  error: string | null = null;
<<<<<<< HEAD
=======
  success: string | null = null;
>>>>>>> origin/yezer

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.bienId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.apiService.getUbicaciones().subscribe(ubicaciones => {
      this.ubicaciones = ubicaciones;
    });
  }

  mover() {
    if (this.ubicacionId) {
<<<<<<< HEAD
      this.apiService.moverBien(this.bienId, { ubicacion_id: this.ubicacionId }).subscribe({
        next: () => console.log('Bien moved successfully'),
        error: (err) => this.error = 'Error moving bien: ' + (err.error?.message || 'Unknown error')
=======
      this.apiService.moverBien(this.bienId, { nueva_ubicacion_id: this.ubicacionId }).subscribe({
        next: () => this.success = 'Bien movido correctamente',
        error: (err) => this.error = 'Error al mover el bien: ' + (err.error?.message || 'Error desconocido')
>>>>>>> origin/yezer
      });
    }
  }
}