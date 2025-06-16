import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../models/responsable.model';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-responsable-list',
  standalone: false,
  templateUrl: './responsable-list.component.html',
  styleUrl: './responsable-list.component.css'
})
export class ResponsableListComponent implements OnInit {
  responsables: Responsable[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loading = true;
    this.apiService.getResponsables().subscribe({
      next: (data) => {
        this.responsables = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar responsables';
        this.loading = false;
      }
    });
  }

 isUsuarioObject(usuario: any): usuario is { username: string, email?: string, rol?: string } {
  return usuario && typeof usuario === 'object' && 'username' in usuario;
}
}
