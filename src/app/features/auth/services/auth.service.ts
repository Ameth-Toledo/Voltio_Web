import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginCredentials, AuthResponse } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(catchError((error) => throwError(() => error)));
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  loginWithGithub(): void {
    window.location.href = `${this.apiUrl}/github`;
  }
}