import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-ubicacion-detail',
  standalone: false,
  templateUrl: './ubicacion-detail.component.html',
  styleUrls: ['./ubicacion-detail.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class UbicacionDetailComponent implements OnInit {
  ubicacionForm: FormGroup;
  bienes: Bien[] = [];
  id: string | null = null;
  esNuevo = false;
  loading = false;
  error = '';
  map!: L.Map;
  marker: L.Marker | null = null;
  displayDeleteConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.ubicacionForm = this.fb.group({
      codigo: ['', Validators.required],
      edificio: ['', Validators.required],
      piso: ['', Validators.required],
      oficina: ['', Validators.required],
      direccion: ['', Validators.required],
      capacidad: [0, [Validators.required, Validators.min(1)]],
      ocupados: [0, [Validators.required, Validators.min(0)]],
      responsable: [null],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required]
    }, { validators: this.capacidadOcupadosValidator });
  }

  capacidadOcupadosValidator = (form: FormGroup) => {
    const capacidad = Number(form.get('capacidad')?.value);
    const ocupados = Number(form.get('ocupados')?.value);
    return ocupados <= capacidad ? null : { ocupadosExcedeCapacidad: true };
  };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';

    if (!this.esNuevo && this.id) {
      this.loading = true;
      this.api.getUbicacion(Number(this.id)).subscribe({
        next: (data) => {
          this.ubicacionForm.patchValue(data);
          this.loading = false;
          setTimeout(() => this.inicializarMapa());
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la ubicación' });
          this.loading = false;
        }
      });

      this.api.getBienes().subscribe({
        next: (bienes) => {
          this.bienes = bienes.filter(b => b.ubicacion === Number(this.id));
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los bienes' });
        }
      });
    } else {
      setTimeout(() => this.inicializarMapa());
    }
  }

  inicializarMapa() {
    if (this.map) return;
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    this.map = L.map('map').setView([-9.93, -76.24], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.ubicacionForm.patchValue({ latitud: e.latlng.lat, longitud: e.latlng.lng });
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });

    if (this.ubicacionForm.value.latitud && this.ubicacionForm.value.longitud) {
      const latlng = L.latLng(this.ubicacionForm.value.latitud, this.ubicacionForm.value.longitud);
      this.marker = L.marker(latlng).addTo(this.map);
      this.map.setView(latlng, 16);
    }
  }

  guardar() {
    if (this.ubicacionForm.invalid) {
      this.ubicacionForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos' });
      return;
    }

    const ubicacion: Ubicacion = {
      id: this.esNuevo ? 0 : Number(this.id),
      ...this.ubicacionForm.value
    };

    this.loading = true;
    const request = this.esNuevo
      ? this.api.createUbicacion(ubicacion)
      : this.api.updateUbicacion(Number(this.id), ubicacion);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Ubicación guardada' });
        this.router.navigate(['/ubicaciones']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      }
    });
  }

  confirmarEliminacion() {
    this.confirmationService.confirm({
      message: '¿Eliminar esta ubicación?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminar()
    });
  }

  eliminar() {
    if (!this.id) return;
    this.loading = true;
    this.api.deleteUbicacion(Number(this.id)).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ubicación eliminada' });
        this.router.navigate(['/ubicaciones']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/ubicaciones']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ubicacionForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
