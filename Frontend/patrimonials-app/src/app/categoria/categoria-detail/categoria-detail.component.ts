import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-categoria-detail',
  standalone: false,
  templateUrl: './categoria-detail.component.html',
  styleUrl: './categoria-detail.component.css'
})
export class CategoriaDetailComponent implements OnInit {
  categoria: Partial<Categoria> = {};
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
      this.api.getCategoria(Number(this.id)).subscribe({
        next: (cat) => this.categoria = cat,
        error: () => this.error = 'No se pudo cargar la categoría'
      });
    }
  }

  guardar() {
    if (this.esNuevo) {
      this.api.createCategoria(this.categoria).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: () => this.error = 'No se pudo crear la categoría'
      });
    } else if (this.id) {
      this.api.updateCategoria(Number(this.id), this.categoria).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: () => this.error = 'No se pudo actualizar la categoría'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/categorias']);
  }
}