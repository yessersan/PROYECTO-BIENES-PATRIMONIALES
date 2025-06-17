import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ubicacion-detail',
  standalone: false,
  templateUrl: './ubicacion-detail.component.html',
  styleUrl: './ubicacion-detail.component.css'
})
export class UbicacionDetailComponent implements OnInit {
  ubicacion?: Ubicacion;
  bienes: Bien[] = [];
  loading = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.api.getUbicacion(id).subscribe({
      next: (data) => {
        this.ubicacion = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Cargar bienes en esta ubicación
    this.api.getBienes().subscribe({
      next: (bienes) => {
        this.bienes = bienes.filter(b => b.ubicacion === id);
      }
    });
  }
}
