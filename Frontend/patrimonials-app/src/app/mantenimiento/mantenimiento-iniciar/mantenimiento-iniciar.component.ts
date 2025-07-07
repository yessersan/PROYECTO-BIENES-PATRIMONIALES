<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
>>>>>>> origin/yezer

@Component({
  selector: 'app-mantenimiento-iniciar',
  standalone: false,
  templateUrl: './mantenimiento-iniciar.component.html',
  styleUrl: './mantenimiento-iniciar.component.css'
})
<<<<<<< HEAD
export class MantenimientoIniciarComponent {

}
=======
export class MantenimientoIniciarComponent implements OnInit {
  id!: number;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  iniciar() {
    this.loading = true;
    this.api.iniciarMantenimiento(this.id, {}).subscribe({
      next: (res) => {
        this.success = 'Mantenimiento iniciado correctamente';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudo iniciar el mantenimiento';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/mantenimientos']);
  }
}
>>>>>>> origin/yezer
