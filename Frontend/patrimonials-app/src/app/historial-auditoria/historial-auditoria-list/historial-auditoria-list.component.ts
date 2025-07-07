<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { HistorialAuditoria } from '../../models/historial-auditoria.model';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';
import { Bien } from '../../models/bien.model';
>>>>>>> origin/yezer

@Component({
  selector: 'app-historial-auditoria-list',
  standalone: false,
  templateUrl: './historial-auditoria-list.component.html',
  styleUrl: './historial-auditoria-list.component.css'
})
<<<<<<< HEAD
export class HistorialAuditoriaListComponent {

}
=======
export class HistorialAuditoriaListComponent implements OnInit {
  historial: HistorialAuditoria[] = [];
  usuarios: Usuario[] = [];
  bienes: Bien[] = [];
  loading = false;
  error: string | null = null;

  form: Partial<HistorialAuditoria> = {};
  editMode = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getHistorial();
    this.api.getUsuarios().subscribe(data => this.usuarios = data);
    this.api.getBienes().subscribe(data => this.bienes = data);
  }

  getUsuarioNombre(id: number): string {
    const usuario = this.usuarios.find(u => u.id === id);
    return usuario ? usuario.username : id?.toString();
  }
  
  getBienCodigo(id: number): string {
    const bien = this.bienes.find(b => b.id === id);
    return bien ? bien.codigo : id?.toString();
  }
  getHistorial() {
    this.loading = true;
    this.api.getHistorialAuditoria().subscribe({
      next: (data) => {
        this.historial = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar historial';
        this.loading = false;
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este registro de auditoría?')) {
      this.api.deleteHistorialAuditoria(id).subscribe({
        next: () => this.getHistorial(),
        error: () => alert('No se pudo eliminar el registro')
      });
    }
  }

  editar(h: HistorialAuditoria) {
    this.form = { ...h };
      if (this.form.fecha) {
      this.form.fecha = this.form.fecha.split("T")[0];
    }
     this.editMode = true;
  }


  cancelar() {
    this.form = {};
    this.editMode = false;
  }

  guardar() {
    if (this.editMode && this.form.id) {
      this.api.updateHistorialAuditoria(this.form.id, this.form).subscribe({
        next: () => {
          this.getHistorial();
          this.cancelar();
        },
        error: () => alert('No se pudo actualizar el registro')
      });
    } else {
      this.api.createHistorialAuditoria(this.form).subscribe({
        next: () => {
          this.getHistorial();
          this.cancelar();
        },
        error: (err) => {
          alert('No se pudo crear el registro');
          console.error(err);
        }
      });
    }
  }
}
>>>>>>> origin/yezer
