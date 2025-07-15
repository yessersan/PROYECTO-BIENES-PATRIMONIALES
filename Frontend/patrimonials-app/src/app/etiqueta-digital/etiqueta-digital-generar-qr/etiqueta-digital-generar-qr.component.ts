import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-etiqueta-digital-generar-qr',
  standalone: false,
  templateUrl: './etiqueta-digital-generar-qr.component.html',
  styleUrls: ['./etiqueta-digital-generar-qr.component.css'],
  providers: [ConfirmationService]
})
export class EtiquetaDigitalGenerarQrComponent implements OnInit {
  etiquetaId: number;
  qrCodeUrl: string | null = null;
  error: string | null = null;
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private confirmationService: ConfirmationService
  ) {
    this.etiquetaId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.apiService.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();
        this.generateQrCode();
      },
      error: () => {
        this.error = 'no se pudo cargar el usuario actual';
      }
    });
  }

  filtrarMenuPorRol() {
    const menuCompleto = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN','AUDITOR','GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN','GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN','GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN','GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN','GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN','GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN','GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN','GESTOR'] },
    ];
    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  generateQrCode() {
    this.apiService.generarQR(this.etiquetaId).subscribe({
      next: (response) => {
        this.qrCodeUrl = 'http://localhost:8000' + (response.qr_url || response.imagen_qr);
      },
      error: (err) => {
        this.error = 'error generando qr: ' + (err.error?.message || 'desconocido');
      }
    });
  }

  confirmarDescarga() {
    this.confirmationService.confirm({
      message: '¿Deseas descargar este código QR?',
      header: 'Confirmación de descarga',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.descargarQR();
      }
    });
  }

  descargarQR() {
    if (!this.qrCodeUrl) return;
    this.apiService.getQrImageFromUrl(this.qrCodeUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_BP-ELEC-${this.etiquetaId}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
