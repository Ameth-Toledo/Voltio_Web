import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserResponse } from '../../auth/models/auth.models';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = environment.apiUrl;

  constructor(
    private http:        HttpClient,
    private authService: AuthService,
  ) {}

  /** Obtiene el perfil actual desde el backend.
   *  El endpoint devuelve { user: UserResponse } — hacemos unwrap aquí. */
  getProfile(): Observable<UserResponse> {
    return this.http.get<{ user: UserResponse }>(`${this.api}/auth/profile`).pipe(
      map(res => res.user)
    );
  }

  /** Actualiza nombre, apellido, email, teléfono (opcionalmente imagen) */
  updateProfile(id: number, data: Partial<{
    name: string;
    secondname: string | null;
    lastname: string;
    secondlastname: string | null;
    email: string;
    phone: string | null;
  }>, imagen?: File): Observable<{ message: string }> {
    const fd = new FormData();
    if (data.name)          fd.append('name',          data.name);
    if (data.lastname)      fd.append('lastname',      data.lastname);
    if (data.email)         fd.append('email',         data.email);
    fd.append('secondname',      data.secondname      ?? '');
    fd.append('secondlastname',  data.secondlastname  ?? '');
    fd.append('phone',           data.phone           ?? '');
    if (imagen) fd.append('imagen', imagen);

    return this.http.put<{ message: string }>(`${this.api}/users/${id}`, fd).pipe(
      tap(() => {
        // Actualizar el usuario en localStorage para reflejar los cambios
        const current = this.authService.getUser();
        if (current) {
          const updated: UserResponse = {
            ...current,
            name:          data.name          ?? current.name,
            secondname:    data.secondname    ?? current.secondname,
            lastname:      data.lastname      ?? current.lastname,
            secondlastname: data.secondlastname ?? current.secondlastname,
            email:         data.email         ?? current.email,
            phone:         data.phone         ?? current.phone,
          };
          localStorage.setItem('user', JSON.stringify(updated));
        }
      })
    );
  }

  /** Cambia la contraseña verificando la actual */
  changePassword(id: number, currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/users/${id}/password`, {
      currentPassword,
      newPassword,
    });
  }
}
