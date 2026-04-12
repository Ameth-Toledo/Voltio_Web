import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PlanBackend, SuscripcionEstado } from '../models/Suscripcion';

@Injectable({ providedIn: 'root' })
export class SuscripcionService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlanes(tipo_rol?: string): Observable<PlanBackend[]> {
    const url = tipo_rol
      ? `${this.base}/planes?tipo_rol=${tipo_rol}`
      : `${this.base}/planes`;
    return this.http.get<PlanBackend[]>(url);
  }

  getEstado(id_usuario: number): Observable<SuscripcionEstado> {
    return this.http.get<SuscripcionEstado>(
      `${this.base}/suscripciones/estado/${id_usuario}`
    );
  }

  iniciarSuscripcion(id_plan: number): Observable<{ approveUrl: string; paypal_subscription_id: string }> {
    return this.http.post<{ approveUrl: string; paypal_subscription_id: string }>(
      `${this.base}/suscripciones/iniciar`,
      { id_plan }
    );
  }

  cancelar(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.base}/suscripciones/cancelar`,
      {}
    );
  }
}
