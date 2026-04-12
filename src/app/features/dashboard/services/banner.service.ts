import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Banner } from '../models/Banner';

/** Shape returned by the backend */
interface BannerApi {
  id_banner:    number;
  id_empresa:   number;
  nombre:       string;
  imagen_url:   string | null;
  activo:       boolean;
  fecha_inicio: string;
  fecha_fin:    string;
  clicks:       number;
  vistas:       number;
}

@Injectable({ providedIn: 'root' })
export class BannerService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByEmpresa(id_empresa: number): Observable<Banner[]> {
    return this.http.get<BannerApi[]>(`${this.api}/banners/empresa/${id_empresa}`)
      .pipe(map(list => list.map(b => this.toModel(b))));
  }

  create(formData: FormData): Observable<Banner> {
    return this.http.post<BannerApi>(`${this.api}/banners`, formData)
      .pipe(map(b => this.toModel(b)));
  }

  toggle(id: number, activo: boolean): Observable<Banner> {
    return this.http.patch<BannerApi>(`${this.api}/banners/${id}/toggle`, { activo })
      .pipe(map(b => this.toModel(b)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/banners/${id}`);
  }

  private toModel(b: BannerApi): Banner {
    return {
      id:           b.id_banner,
      nombre:       b.nombre,
      imagen_url:   b.imagen_url ?? '',
      activo:       b.activo,
      fecha_inicio: b.fecha_inicio,
      fecha_fin:    b.fecha_fin,
      clicks:       b.clicks,
      vistas:       b.vistas,
    };
  }
}
