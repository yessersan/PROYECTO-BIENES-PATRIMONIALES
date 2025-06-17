import { Component, OnInit } from '@angular/core';
import { Reporte } from '../../models/reporte.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-reporte-list',
  standalone: false,
  templateUrl: './reporte-list.component.html',
  styleUrl: './reporte-list.component.css'
})
export class ReporteListComponent implements OnInit {
  reportes: Reporte[] = [];
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/reportes', id]);
  }
}
