import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Notificacion } from '../../models/notificacion.model';
import { AuthService } from '../../core/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-notificacion-list',
  standalone: false,
  templateUrl: './notificacion-list.component.html',
  styleUrls: ['./notificacion-list.component.css']
})
export class NotificacionListComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  isLoading = false;
  error: string | null = null;

  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  estados = ['TODOS', 'NO_LEIDO', 'LEIDO', 'ARCHIVADO'];
  estadoSeleccionado = 'NO_LEIDO';
  soloImportantes = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cargarNotificaciones();
    } else {
      this.error = 'No autorizado. Por favor inicia sesión.';
    }
  }

  cargarNotificaciones(): void {
    this.isLoading = true;
    this.error = null;

    let url = `notificaciones/?page=${this.currentPage + 1}&page_size=${this.pageSize}`;

    if (this.estadoSeleccionado !== 'TODOS') {
      url += `&estado=${this.estadoSeleccionado}`;
    }

    if (this.soloImportantes) {
      url += `&importante=true`;
    }

    this.apiService.get(url).subscribe({
      next: (response: any) => {
        this.notificaciones = response.results;
        this.totalItems = response.count;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.error = 'Sesión expirada. Por favor inicia sesión nuevamente.';
          this.authService.logout();
          // opcional: redirigir al login
        } else {
          this.error = 'Error al cargar notificaciones';
        }
        console.error(err);
      }
    });
  }

  cambiarPagina(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.cargarNotificaciones();
  }

  marcarComoLeido(notificacion: Notificacion): void {
    this.apiService.patch(`notificaciones/${notificacion.id}/`, { estado: 'LEIDO' }).subscribe({
      next: () => {
        notificacion.estado = 'LEIDO';
      },
      error: (err) => {
        console.error('Error al marcar como leído', err);
      }
    });
  }

  aplicarFiltros(): void {
    this.currentPage = 0;
    this.cargarNotificaciones();
  }
}
