import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { NotificacionDetailComponent } from './notificacion/notificacion-detail/notificacion-detail.component';

import { MantenimientoListComponent } from './mantenimiento/mantenimiento-list/mantenimiento-list.component';
import { MantenimientoDetailComponent } from './mantenimiento/mantenimiento-detail/mantenimiento-detail.component';
import { MantenimientoIniciarComponent } from './mantenimiento/mantenimiento-iniciar/mantenimiento-iniciar.component';
import { MantenimientoFinalizarComponent } from './mantenimiento/mantenimiento-finalizar/mantenimiento-finalizar.component';

import { EtiquetaDigitalListComponent } from './etiqueta-digital/etiqueta-digital-list/etiqueta-digital-list.component';
import { EtiquetaDigitalDetailComponent } from './etiqueta-digital/etiqueta-digital-detail/etiqueta-digital-detail.component';
import { EtiquetaDigitalGenerarQrComponent } from './etiqueta-digital/etiqueta-digital-generar-qr/etiqueta-digital-generar-qr.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'bienes', component: BienListComponent },
  { path: 'bienes/:id', component: BienDetailComponent },
  { path: 'bienes/mover/:id', component: BienMoverComponent },
  { path: 'bienes/dar-baja/:id', component: BienDarBajaComponent },

  { path: 'responsables', component: ResponsableListComponent },
  { path: 'responsables/:id', component: ResponsableDetailComponent },

  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categorias/:id', component: CategoriaDetailComponent },

  { path: 'ubicaciones', component: UbicacionListComponent },
  { path: 'ubicaciones/:id', component: UbicacionDetailComponent },

  { path: 'movimientos', component: MovimientoListComponent },
  { path: 'movimientos/:id', component: MovimientoDetailComponent },

  { path: 'reportes', component: ReporteListComponent },
  { path: 'reportes/:id', component: ReporteDetailComponent },

  { path: 'historial-auditoria', component: HistorialAuditoriaListComponent },

  { path: 'documentos', component: DocumentoListComponent },
  { path: 'documentos/:id', component: DocumentoDetailComponent },

  { path: 'notificaciones', component: NotificacionListComponent },
  { path: 'notificaciones/:id', component: NotificacionDetailComponent },

  { path: 'mantenimientos', component: MantenimientoListComponent },
  { path: 'mantenimientos/:id', component: MantenimientoDetailComponent },
  { path: 'mantenimientos/iniciar/:id', component: MantenimientoIniciarComponent },
  { path: 'mantenimientos/finalizar/:id', component: MantenimientoFinalizarComponent },

  { path: 'etiquetas-digitales', component: EtiquetaDigitalListComponent },
  { path: 'etiquetas-digitales/:id', component: EtiquetaDigitalDetailComponent },
  { path: 'etiquetas-digitales/generar-qr/:id', component: EtiquetaDigitalGenerarQrComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },   // Ruta por defecto
  { path: '**', redirectTo: 'login' }                    // Ruta comodín para no encontrados
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
