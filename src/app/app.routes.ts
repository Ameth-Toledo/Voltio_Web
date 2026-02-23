import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./features/landing/landing.routes').then(m => m.LANDING_ROUTES) },
    { path: 'login', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
];
