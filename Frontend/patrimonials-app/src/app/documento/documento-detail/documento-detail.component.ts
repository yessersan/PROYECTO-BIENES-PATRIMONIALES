<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Documento } from '../../models/documento.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
>>>>>>> origin/yezer

@Component({
  selector: 'app-documento-detail',
  standalone: false,
  templateUrl: './documento-detail.component.html',
  styleUrl: './documento-detail.component.css'
})
<<<<<<< HEAD
export class DocumentoDetailComponent {

=======
export class DocumentoDetailComponent implements OnInit {
  documento: Partial<Documento> = {};
  id: string | null = null;
  esNuevo = false;
  error = '';
  archivo: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';
    if (!this.esNuevo && this.id) {
      this.api.getDocumento(Number(this.id)).subscribe({
        next: (doc) => this.documento = doc,
        error: () => this.error = 'No se pudo cargar el documento'
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length) {
      this.archivo = event.target.files[0];
    }
  }

  guardar() {
    const formData = new FormData();
    if (this.archivo) formData.append('ruta_archivo', this.archivo);
    if (this.documento.tipo) formData.append('tipo', this.documento.tipo);
    if (this.documento.bien) formData.append('bien', String(this.documento.bien));
    if (this.documento.usuario) formData.append('usuario', String(this.documento.usuario));
    if (this.documento.descripcion) formData.append('descripcion', this.documento.descripcion);
    if (this.documento.fecha_documento) formData.append('fecha_documento', this.documento.fecha_documento);

    if (this.esNuevo) {
      this.api.createDocumento(formData).subscribe({
        next: () => this.router.navigate(['/documentos']),
        error: () => this.error = 'No se pudo crear el documento'
      });
    } else if (this.id) {
      this.api.updateDocumento(Number(this.id), formData).subscribe({
        next: () => this.router.navigate(['/documentos']),
        error: () => this.error = 'No se pudo actualizar el documento'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/documentos']);
  }
>>>>>>> origin/yezer
}
