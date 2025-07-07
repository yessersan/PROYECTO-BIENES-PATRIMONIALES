<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
>>>>>>> origin/yezer

@Component({
  selector: 'app-categoria-list',
  standalone: false,
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
<<<<<<< HEAD
export class CategoriaListComponent {

}
=======
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  error = '';
  
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (data: Categoria[]) => { this.categorias = data; this.loading = false; },
      error: (err) => { this.error = 'Error al cargar categorías'; this.loading = false; }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/categorias', id]);
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.api.deleteCategoria(id).subscribe({
        next: () => this.getCategorias(),
        error: () => alert('No se pudo eliminar la categoría')
      });
    }
  }

  crearCategoria() {
    this.router.navigate(['/categorias', 'nuevo']);
  }
}
>>>>>>> origin/yezer
