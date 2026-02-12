import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadChildren: () => import('./features/landing/landing.routes').then(m => m.LANDING_ROUTES) }
];
