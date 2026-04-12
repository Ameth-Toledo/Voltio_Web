import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/Product';

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByEmpresa(id_empresa: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products/empresa/${id_empresa}`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.api}/categorias`);
  }

  create(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.api}/products`, formData);
  }

  update(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.api}/products/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/products/${id}`);
  }
}
