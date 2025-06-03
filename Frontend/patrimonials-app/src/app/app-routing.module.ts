import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component'; // Nuevo import

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
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent }, // Nueva ruta de registro
  
  // Rutas protegidas
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },

  // Rutas de bienes
  { 
    path: 'bienes', 
    component: BienListComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] } 
  },
  { 
    path: 'bienes/:id', 
    component: BienDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'bienes/mover/:id', 
    component: BienMoverComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'bienes/dar-baja/:id', 
    component: BienDarBajaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] } // Solo admin puede dar de baja
  },

  // Rutas de responsables
  { 
    path: 'responsables', 
    component: ResponsableListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'responsables/:id', 
    component: ResponsableDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },

  // Rutas de categorías
  { 
    path: 'categorias', 
    component: CategoriaListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'categorias/:id', 
    component: CategoriaDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },

  // Rutas de ubicaciones
  { 
    path: 'ubicaciones', 
    component: UbicacionListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'ubicaciones/:id', 
    component: UbicacionDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },

  // Rutas de movimientos
  { 
    path: 'movimientos', 
    component: MovimientoListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR', 'AUDITOR'] }
  },
  { 
    path: 'movimientos/:id', 
    component: MovimientoDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR', 'AUDITOR'] }
  },

  // Rutas de reportes
  { 
    path: 'reportes', 
    component: ReporteListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR', 'AUDITOR', 'CONSULTA'] }
  },
  { 
    path: 'reportes/:id', 
    component: ReporteDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR', 'AUDITOR', 'CONSULTA'] }
  },

  // Ruta de historial de auditoría
  { 
    path: 'historial-auditoria', 
    component: HistorialAuditoriaListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'AUDITOR'] }
  },

  // Rutas de documentos
  { 
    path: 'documentos', 
    component: DocumentoListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'documentos/:id', 
    component: DocumentoDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },

  // Rutas de notificaciones
  { 
    path: 'notificaciones', 
    component: NotificacionListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'notificaciones/:id', 
    component: NotificacionDetailComponent,
    canActivate: [AuthGuard]
  },

  // Rutas de mantenimiento
  { 
    path: 'mantenimientos', 
    component: MantenimientoListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'mantenimientos/:id', 
    component: MantenimientoDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'mantenimientos/iniciar/:id', 
    component: MantenimientoIniciarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'mantenimientos/finalizar/:id', 
    component: MantenimientoFinalizarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },

  // Rutas de etiquetas digitales
  { 
    path: 'etiquetas-digitales', 
    component: EtiquetaDigitalListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'etiquetas-digitales/:id', 
    component: EtiquetaDigitalDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },
  { 
    path: 'etiquetas-digitales/generar-qr/:id', 
    component: EtiquetaDigitalGenerarQrComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'GESTOR'] }
  },

  // Rutas por defecto y comodín
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }