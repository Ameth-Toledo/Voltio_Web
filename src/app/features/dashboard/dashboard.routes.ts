import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
        title: 'Inicio'
      },
      {
        path: 'overview',
        title: 'Inicio',
        loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'products',
        title: 'Productos',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'orders',
        title: 'Pedidos',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'analytics',
        title: 'Estadísticas',
        loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'profile',
        title: 'Perfil',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        title: 'Configuración',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'subscription',
        title: 'Mi Suscripción',
        loadComponent: () => import('./pages/subscription/subscription.component').then(m => m.SubscriptionComponent)
      },
      {
        path: 'products/:id',
        title: 'Detalle de Producto',
        loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'orders/:id',
        title: 'Detalle de Pedido',
        loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      {
        path: 'advertising',
        title: 'Publicidad',
        loadComponent: () => import('./pages/advertising/advertising.component').then(m => m.AdvertisingComponent)
      },
      {
        path: 'chat',
        title: 'Chat',
        loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent)
      },
    ]
  }
];