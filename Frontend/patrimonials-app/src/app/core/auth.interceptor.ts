import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiKey = 'ABC123ABC123ABC123ABC123'; // Usa el valor de tu settings.py

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let headersConfig: any = {
      'X-API-KEY': this.apiKey
    };

    if (token) {
      headersConfig['Authorization'] = `Token ${token}`;
    }

    // Opcional: excluir login y registro si no quieres enviar la API KEY ahí
    if (req.url.includes('login') || req.url.includes('registro')) {
      headersConfig = { 'X-API-KEY': this.apiKey};
    }

    const authReq = req.clone({
      setHeaders: headersConfig
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}