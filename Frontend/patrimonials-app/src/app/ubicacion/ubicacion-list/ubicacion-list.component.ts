import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicacion-list',
  standalone: false,
  templateUrl: './ubicacion-list.component.html',
  styleUrl: './ubicacion-list.component.css'
})
export class UbicacionListComponent implements OnInit {
  ubicaciones: Ubicacion[] = [];
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getUbicaciones().subscribe({
      next: (data) => {
        this.ubicaciones = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/ubicaciones', id]);
  }
}
