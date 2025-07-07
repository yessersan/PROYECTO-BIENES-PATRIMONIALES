<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { Mantenimiento } from '../../models/mantenimiento.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
>>>>>>> origin/yezer

@Component({
  selector: 'app-mantenimiento-detail',
  standalone: false,
  templateUrl: './mantenimiento-detail.component.html',
  styleUrl: './mantenimiento-detail.component.css'
})
<<<<<<< HEAD
export class MantenimientoDetailComponent {

}
=======
export class MantenimientoDetailComponent implements OnInit {
  mantenimiento?: Mantenimiento;
  loading = false;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getMantenimiento(id);
    }
  }

  getMantenimiento(id: number) {
    this.loading = true;
    this.api.getMantenimiento(id).subscribe({
      next: (data) => {
        this.mantenimiento = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el mantenimiento';
        this.loading = false;
      }
    });
  }
   volver() {
    this.router.navigate(['/mantenimientos']);
  }
}

>>>>>>> origin/yezer
