import {
  HttpInterceptorFn, HttpRequest, HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

let isRefreshing   = false;
const refreshDone$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login') || req.url.includes('/auth/logout')) {
    return next(req);
  }

  const token     = localStorage.getItem('access_token');
  const clonedReq = addToken(req, token);

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshDone$.pipe(
          filter(t => t !== null),
          take(1),
          switchMap(newToken => next(addToken(req, newToken)))
        );
      }

      isRefreshing = true;
      refreshDone$.next(null);

      return authService.refresh().pipe(
        switchMap(res => {
          isRefreshing = false;
          refreshDone$.next(res.accessToken);
          return next(addToken(req, res.accessToken));
        }),
        catchError(refreshError => {
          isRefreshing = false;
          refreshDone$.next(null);
          authService.clearSession();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) return req;
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
