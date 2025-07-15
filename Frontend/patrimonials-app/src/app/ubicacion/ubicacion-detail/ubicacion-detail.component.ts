import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Bien } from '../../models/bien.model';
import { Usuario } from '../../models/usuario.model';
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

  usuarioActual!: Usuario;
  rolUsuario: string = '';
  menuItems: any[] = [];

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
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol?.toUpperCase();

        const rolesPermitidos = ['ADMIN', 'GESTOR'];
        if (!rolesPermitidos.includes(this.rolUsuario)) {
          this.error = 'no tienes permiso para acceder a ubicaciones';
          alert(this.error);
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();
        this.cargarDatos();
      },
      error: () => {
        this.error = 'no se pudo obtener el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const menu = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] },
    ];

    this.menuItems = menu.filter(item => item.roles.includes(this.rolUsuario));
  }

  cargarDatos() {
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
      setTimeout(() => this.inicializarMapa());
    }
  }

  inicializarMapa() {
    if (this.map || !document.getElementById('map')) return;

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

    if (this.ubicacionForm.value.latitud && this.ubicacionForm.value.longitud) {
      this.setMarkerOnMap();
    }
  }

  setMarkerOnMap() {
    const { latitud, longitud } = this.ubicacionForm.value;
    if (latitud && longitud && this.map) {
      const latlng = L.latLng(Number(latitud), Number(longitud));
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

    this.loading = true;

    if (this.esNuevo) {
      const { id, ...ubicacionSinId } = ubicacion;
      this.api.createUbicacion(ubicacionSinId).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: (err) => {
          this.error = err.error?.message || 'no se pudo crear la ubicación';
          this.loading = false;
        }
      });
    } else {
      this.api.updateUbicacion(Number(this.id), ubicacion).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: (err) => {
          this.error = err.error?.message || 'no se pudo actualizar la ubicación';
          this.loading = false;
        }
      });
    }
  }

  eliminar() {
    if (this.id && confirm('¿Eliminar esta ubicación?')) {
      this.loading = true;
      this.api.deleteUbicacion(Number(this.id)).subscribe({
        next: () => this.router.navigate(['/ubicaciones']),
        error: () => {
          this.error = 'No se pudo eliminar';
          this.loading = false;
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
