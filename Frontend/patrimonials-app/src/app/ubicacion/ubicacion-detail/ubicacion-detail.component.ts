import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-ubicacion-detail',
  standalone: false,
  templateUrl: './ubicacion-detail.component.html',
  styleUrls: ['./ubicacion-detail.component.css']
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
  coordenadasPendientes: { lat: number, lon: number } | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
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
          this.ubicacionForm.patchValue({
            codigo: data.codigo,
            edificio: data.edificio,
            piso: data.piso,
            oficina: data.oficina,
            direccion: data.direccion,
            capacidad: data.capacidad,
            ocupados: data.ocupados,
            responsable: data.responsable,
            latitud: data.latitud,
            longitud: data.longitud
          });
          this.loading = false;

          setTimeout(() => this.inicializarMapa());
        },
        error: () => {
          this.error = 'No se pudo cargar la ubicación';
          this.loading = false;
        }
      });

      this.api.getBienes().subscribe({
        next: (bienes) => {
          this.bienes = bienes.filter(b => b.ubicacion === Number(this.id));
        },
        error: () => {
          this.error = 'No se pudo cargar los bienes';
        }
      });
    } else {
      // Si es nuevo, inicializamos el mapa apenas cargue
      setTimeout(() => this.inicializarMapa());
    }
  }

  inicializarMapa() {
    if (this.map) return; // evitar reinicializar

    if (!document.getElementById('map')) return;

    this.map = L.map('map').setView([-9.93, -76.24], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      this.ubicacionForm.patchValue({
        latitud: lat,
        longitud: lon
      });

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });

    // Si ya hay coordenadas cargadas, colocar marcador
    if (this.ubicacionForm.value.latitud && this.ubicacionForm.value.longitud) {
      this.setMarkerOnMap();
    }
  }

  setMarkerOnMap() {
    if (this.ubicacionForm.value.latitud && this.ubicacionForm.value.longitud && this.map) {
      const latlng = L.latLng(
        Number(this.ubicacionForm.value.latitud),
        Number(this.ubicacionForm.value.longitud)
      );

      if (this.marker) {
        this.marker.setLatLng(latlng);
      } else {
        this.marker = L.marker(latlng).addTo(this.map);
      }
      this.map.setView(latlng, 16);
    }
  }

  guardar() {
    if (this.ubicacionForm.invalid) {
      this.ubicacionForm.markAllAsTouched();
      this.error = 'Complete correctamente todos los campos.';
      return;
    }

    if (this.ubicacionForm.value.latitud === null || this.ubicacionForm.value.longitud === null) {
      this.error = 'Debe seleccionar una ubicación en el mapa.';
      return;
    }

    const latitudRedondeada = Number(this.ubicacionForm.value.latitud).toFixed(6);
    const longitudRedondeada = Number(this.ubicacionForm.value.longitud).toFixed(6);

    const ubicacion: Ubicacion = {
      id: this.esNuevo ? 0 : Number(this.id),
      ...this.ubicacionForm.value,
      latitud: latitudRedondeada,
      longitud: longitudRedondeada
    };

    console.log('Datos a enviar:', ubicacion);
    this.loading = true;

    if (this.esNuevo) {
      const { id, ...ubicacionSinId } = ubicacion;
      this.api.createUbicacion(ubicacionSinId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/ubicaciones']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Respuesta completa del backend:', err);
          this.error = JSON.stringify(err.error, null, 2);
        }
      });
    } else if (this.id) {
      this.api.updateUbicacion(Number(this.id), ubicacion).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/ubicaciones']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Respuesta completa del backend:', err);
          this.error = JSON.stringify(err.error, null, 2);
        }
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿Eliminar esta ubicación?')) {
      this.loading = true;
      this.api.deleteUbicacion(Number(this.id)).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/ubicaciones']);
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo eliminar';
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/ubicaciones']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ubicacionForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
