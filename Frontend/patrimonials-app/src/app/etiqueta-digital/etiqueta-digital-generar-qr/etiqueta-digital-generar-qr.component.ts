import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-etiqueta-digital-generar-qr',
  standalone: false,
  templateUrl: './etiqueta-digital-generar-qr.component.html',
  styleUrls: ['./etiqueta-digital-generar-qr.component.css']
})
export class EtiquetaDigitalGenerarQrComponent implements OnInit {
  etiquetaId: number;
  qrCodeUrl: string | null = null;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.etiquetaId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.generateQrCode();
  }

  generateQrCode() {
    this.apiService.generarQR(this.etiquetaId).subscribe({
      next: (response) => {
        this.qrCodeUrl = response.qr_url || response.imagen_qr;
      },
      error: (err) => this.error = 'Error generando QR: ' + (err.error?.message || 'Desconocido')
    });
  }
}