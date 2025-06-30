import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BienListComponent } from './bien/bien-list/bien-list.component';
import { BienDetailComponent } from './bien/bien-detail/bien-detail.component';
import { BienMoverComponent } from './bien/bien-mover/bien-mover.component';
import { BienDarBajaComponent } from './bien/bien-dar-baja/bien-dar-baja.component';
import { ResponsableListComponent } from './responsable/responsable-list/responsable-list.component';
import { ResponsableDetailComponent } from './responsable/responsable-detail/responsable-detail.component';
import { CategoriaListComponent } from './categoria/categoria-list/categoria-list.component';
import { CategoriaDetailComponent } from './categoria/categoria-detail/categoria-detail.component';
import { UbicacionListComponent } from './ubicacion/ubicacion-list/ubicacion-list.component';
import { UbicacionDetailComponent } from './ubicacion/ubicacion-detail/ubicacion-detail.component';
import { MovimientoListComponent } from './movimiento/movimiento-list/movimiento-list.component';
import { MovimientoDetailComponent } from './movimiento/movimiento-detail/movimiento-detail.component';
import { ReporteListComponent } from './reporte/reporte-list/reporte-list.component';
import { ReporteDetailComponent } from './reporte/reporte-detail/reporte-detail.component';
import { HistorialAuditoriaListComponent } from './historial-auditoria/historial-auditoria-list/historial-auditoria-list.component';
import { DocumentoListComponent } from './documento/documento-list/documento-list.component';
import { DocumentoDetailComponent } from './documento/documento-detail/documento-detail.component';
import { NotificacionListComponent } from './notificacion/notificacion-list/notificacion-list.component';
import { MantenimientoListComponent } from './mantenimiento/mantenimiento-list/mantenimiento-list.component';
import { MantenimientoDetailComponent } from './mantenimiento/mantenimiento-detail/mantenimiento-detail.component';
import { MantenimientoIniciarComponent } from './mantenimiento/mantenimiento-iniciar/mantenimiento-iniciar.component';
import { MantenimientoFinalizarComponent } from './mantenimiento/mantenimiento-finalizar/mantenimiento-finalizar.component';
import { EtiquetaDigitalListComponent } from './etiqueta-digital/etiqueta-digital-list/etiqueta-digital-list.component';
import { EtiquetaDigitalDetailComponent } from './etiqueta-digital/etiqueta-digital-detail/etiqueta-digital-detail.component';
import { EtiquetaDigitalGenerarQrComponent } from './etiqueta-digital/etiqueta-digital-generar-qr/etiqueta-digital-generar-qr.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroComponent } from './registro/registro.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableModule } from 'primeng/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BienListComponent,
    BienDetailComponent,
    BienMoverComponent,
    BienDarBajaComponent,
    ResponsableListComponent,
    ResponsableDetailComponent,
    CategoriaListComponent,
    CategoriaDetailComponent,
    UbicacionListComponent,
    UbicacionDetailComponent,
    MovimientoListComponent,
    MovimientoDetailComponent,
    ReporteListComponent,
    ReporteDetailComponent,
    HistorialAuditoriaListComponent,
    DocumentoListComponent,
    DocumentoDetailComponent,
    NotificacionListComponent,
    MantenimientoListComponent,
    MantenimientoDetailComponent,
    MantenimientoIniciarComponent,
    MantenimientoFinalizarComponent,
    EtiquetaDigitalListComponent,
    EtiquetaDigitalDetailComponent,
    EtiquetaDigitalGenerarQrComponent,
    DashboardComponent,
    RegistroComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    MenubarModule,
    AvatarModule,
    PanelMenuModule,
    BadgeModule,
    CardModule,
    MessageModule,
    PasswordModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }