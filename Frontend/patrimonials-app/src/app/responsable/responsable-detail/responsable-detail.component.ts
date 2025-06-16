import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../models/responsable.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-responsable-detail',
  standalone: false,
  templateUrl: './responsable-detail.component.html',
  styleUrl: './responsable-detail.component.css'
})
export class ResponsableDetailComponent implements OnInit {
  responsable: Responsable | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.apiService.getResponsable(+id).subscribe({
        next: (data) => {
          this.responsable = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el responsable';
          this.loading = false;
        }
      });
    }
  }
  isUsuarioObject(usuario: any): usuario is { username: string, email?: string, rol?: string } {
  return usuario && typeof usuario === 'object' && 'username' in usuario;
}
}