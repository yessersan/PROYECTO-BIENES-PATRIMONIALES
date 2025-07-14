import { Component, OnInit } from '@angular/core';
import { Documento } from '../../models/documento.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documento-list',
  standalone: false,
  templateUrl: './documento-list.component.html',
  styleUrl: './documento-list.component.css'
})
export class DocumentoListComponent implements OnInit {
  documentos: Documento[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getDocumentos();
  }

  getDocumentos() {
    this.loading = true;
    this.api.getDocumentos().subscribe({
      next: (data) => { this.documentos = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar documentos'; this.loading = false; }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/documentos', id]);
  }

  eliminarDocumento(id: number) {
    if (confirm('¿Eliminar este documento?')) {
      this.api.deleteDocumento(id).subscribe({
        next: () => this.getDocumentos(),
        error: () => alert('No se pudo eliminar el documento')
      });
    }
  }

  crearDocumento() {
    this.router.navigate(['/documentos', 'nuevo']);
  }
}
