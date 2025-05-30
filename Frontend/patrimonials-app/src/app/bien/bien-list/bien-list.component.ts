import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Bien } from '../../models/bien.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bien-list',
  standalone: false,
  templateUrl: './bien-list.component.html',
  styleUrls: ['./bien-list.component.css']
})
export class BienListComponent implements OnInit {
  bienes: Bien[] = [];
  error: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getBienes().subscribe({
      next: (bienes) => this.bienes = bienes,
      error: (err) => this.error = 'Error al cargar bienes: ' + (err.error?.message || 'Error desconocido')
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/bienes', id]);
  }

  moveBien(id: number) {
    this.router.navigate(['/bienes', id, 'mover']);
  }
}