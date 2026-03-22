import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'login',
    title: 'Iniciar Sesión',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  }
];