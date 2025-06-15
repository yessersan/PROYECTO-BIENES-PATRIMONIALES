import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { Categoria } from '../models/categoria.model';
import { Ubicacion } from '../models/ubicacion.model';
import { Responsable } from '../models/responsable.model';
import { Bien } from '../models/bien.model';
import { Movimiento } from '../models/movimiento.model';
import { Reporte } from '../models/reporte.model';
import { HistorialAuditoria } from '../models/historial-auditoria.model';
import { Documento } from '../models/documento.model';
import { Notificacion } from '../models/notificacion.model';
import { Mantenimiento } from '../models/mantenimiento.model';
import { EtiquetaDigital } from '../models/etiqueta-digital.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiService: any;

 get<T>(url: string): Observable<T> {
  return this.http.get<T>(`${this.apiUrl}${url}`);
}
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, body);
  }
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
patch(url: string, body: any): Observable<any> {
  return this.http.patch(`${this.apiUrl}${url}`, body);
}
  // Authentication
   login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}login/`, credentials);
  }
  registrar(usuario: Partial<Usuario>): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.apiUrl}auth/registro/`, usuario);
  }

  // Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}usuarios/`);
  }
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}usuarios/${id}/`);
  }
  createUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}usuarios/`, usuario);
  }
  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}usuarios/${id}/`, usuario);
  }
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}usuarios/${id}/`);
  }

  // Categorias
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}categorias/`);
  }
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}categorias/${id}/`);
  }
  createCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}categorias/`, categoria);
  }
  updateCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}categorias/${id}/`, categoria);
  }
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}categorias/${id}/`);
  }

  // Ubicaciones
  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}ubicaciones/`);
  }
  getUbicacion(id: number): Observable<Ubicacion> {
    return this.http.get<Ubicacion>(`${this.apiUrl}ubicaciones/${id}/`);
  }
  createUbicacion(ubicacion: Partial<Ubicacion>): Observable<Ubicacion> {
    return this.http.post<Ubicacion>(`${this.apiUrl}ubicaciones/`, ubicacion);
  }
  updateUbicacion(id: number, ubicacion: Partial<Ubicacion>): Observable<Ubicacion> {
    return this.http.put<Ubicacion>(`${this.apiUrl}ubicaciones/${id}/`, ubicacion);
  }
  deleteUbicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}ubicaciones/${id}/`);
  }

  // Responsables
  getResponsables(): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.apiUrl}responsables/`);
  }
  getResponsable(id: number): Observable<Responsable> {
    return this.http.get<Responsable>(`${this.apiUrl}responsables/${id}/`);
  }
  createResponsable(responsable: Partial<Responsable>): Observable<Responsable> {
    return this.http.post<Responsable>(`${this.apiUrl}responsables/`, responsable);
  }
  updateResponsable(id: number, responsable: Partial<Responsable>): Observable<Responsable> {
    return this.http.put<Responsable>(`${this.apiUrl}responsables/${id}/`, responsable);
  }
  deleteResponsable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}responsables/${id}/`);
  }

  // Bienes
  getBienes(): Observable<Bien[]> {
    return this.http.get<Bien[]>(`${this.apiUrl}bienes/`);
  }
  getBien(id: number): Observable<Bien> {
    return this.http.get<Bien>(`${this.apiUrl}bienes/${id}/`);
  }
  createBien(bien: Partial<Bien>): Observable<Bien> {
    return this.http.post<Bien>(`${this.apiUrl}bienes/`, bien);
  }
  updateBien(id: number, bien: Partial<Bien>): Observable<Bien> {
    return this.http.put<Bien>(`${this.apiUrl}bienes/${id}/`, bien);
  }
  deleteBien(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}bienes/${id}/`);
  }
  moverBien(id: number, data: { ubicacion_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}bienes/${id}/mover/`, data);
  }
  darBajaBien(id: number, data: { motivo: string; fecha_baja?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}bienes/${id}/dar-baja/`, data);
  }

  // Movimientos
  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.apiUrl}movimientos/`);
  }
  getMovimiento(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.apiUrl}movimientos/${id}/`);
  }
  createMovimiento(movimiento: Partial<Movimiento>): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.apiUrl}movimientos/`, movimiento);
  }
  updateMovimiento(id: number, movimiento: Partial<Movimiento>): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.apiUrl}movimientos/${id}/`, movimiento);
  }
  deleteMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}movimientos/${id}/`);
  }

  // Reportes
  getReportes(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}reportes/`);
  }
  getReporte(id: number): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.apiUrl}reportes/${id}/`);
  }
  createReporte(reporte: Partial<Reporte>): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.apiUrl}reportes/`, reporte);
  }
  updateReporte(id: number, reporte: Partial<Reporte>): Observable<Reporte> {
    return this.http.put<Reporte>(`${this.apiUrl}reportes/${id}/`, reporte);
  }
  deleteReporte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}reportes/${id}/`);
  }

  // Historial Auditoria
  getHistorialAuditoria(): Observable<HistorialAuditoria[]> {
    return this.http.get<HistorialAuditoria[]>(`${this.apiUrl}historial-auditoria/`);
  }

  // Documentos
  getDocumentos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}documentos/`);
  }
  getDocumento(id: number): Observable<Documento> {
    return this.http.get<Documento>(`${this.apiUrl}documentos/${id}/`);
  }
  createDocumento(documento: FormData): Observable<Documento> {
    return this.http.post<Documento>(`${this.apiUrl}documentos/`, documento);
  }
  updateDocumento(id: number, documento: FormData): Observable<Documento> {
    return this.http.put<Documento>(`${this.apiUrl}documentos/${id}/`, documento);
  }
  deleteDocumento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}documentos/${id}/`);
  }

  // Notificaciones
  getNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}notificaciones/`);
  }
  getNotificacion(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.apiUrl}notificaciones/${id}/`);
  }
  createNotificacion(notificacion: Partial<Notificacion>): Observable<Notificacion> {
    return this.http.post<Notificacion>(`${this.apiUrl}notificaciones/`, notificacion);
  }
  updateNotificacion(id: number, notificacion: Partial<Notificacion>): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.apiUrl}notificaciones/${id}/`, notificacion);
  }
  deleteNotificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}notificaciones/${id}/`);
  }

  // Mantenimientos
  getMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}mantenimientos/`);
  }
  getMantenimiento(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}mantenimientos/${id}/`);
  }
  createMantenimiento(mantenimiento: Partial<Mantenimiento>): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(`${this.apiUrl}mantenimientos/`, mantenimiento);
  }
  updateMantenimiento(id: number, mantenimiento: Partial<Mantenimiento>): Observable<Mantenimiento> {
    return this.http.put<Mantenimiento>(`${this.apiUrl}mantenimientos/${id}/`, mantenimiento);
  }
  deleteMantenimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}mantenimientos/${id}/`);
  }
  iniciarMantenimiento(id: number, data: { observaciones?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}mantenimientos/${id}/iniciar/`, data);
  }
  finalizarMantenimiento(id: number, data: { observaciones?: string; costo?: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}mantenimientos/${id}/finalizar/`, data);
  }

  // Etiquetas Digitales
  getEtiquetasDigitales(): Observable<EtiquetaDigital[]> {
    return this.http.get<EtiquetaDigital[]>(`${this.apiUrl}etiquetas-digitales/`);
  }
  getEtiquetaDigital(id: number): Observable<EtiquetaDigital> {
    return this.http.get<EtiquetaDigital>(`${this.apiUrl}etiquetas-digitales/${id}/`);
  }
  createEtiquetaDigital(etiqueta: Partial<EtiquetaDigital>): Observable<EtiquetaDigital> {
    return this.http.post<EtiquetaDigital>(`${this.apiUrl}etiquetas-digitales/`, etiqueta);
  }
  updateEtiquetaDigital(id: number, etiqueta: Partial<EtiquetaDigital>): Observable<EtiquetaDigital> {
    return this.http.put<EtiquetaDigital>(`${this.apiUrl}etiquetas-digitales/${id}/`, etiqueta);
  }
  deleteEtiquetaDigital(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}etiquetas-digitales/${id}/`);
  }
  generarQR(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}etiquetas-digitales/${id}/generar-qr/`, {});
  }
}