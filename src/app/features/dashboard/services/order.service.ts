import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../models/Order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByEmpresa(id_empresa: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}/empresas/${id_empresa}/ordenes`);
  }

  updateEstado(id_orden: number, estado: string): Observable<any> {
    return this.http.put(`${this.api}/ordenes/${id_orden}`, { estado_orden: estado });
  }
}
