import { Component, OnInit } from '@angular/core';
import { Reporte } from '../../models/reporte.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-reporte-detail',
  standalone: false,
  templateUrl: './reporte-detail.component.html',
  styleUrl: './reporte-detail.component.css'
})
export class ReporteDetailComponent implements OnInit {
  reporte?: Reporte;
  loading = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.api.getReporte(id).subscribe({
      next: (data) => {
        this.reporte = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}