import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LandingComponent } from './components/landing/landing.component'; // Importar
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent }, // La landing es la nueva ruta raíz
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'pedidos', component: PedidosComponent },
    { path: 'calificar/:id', component: CalificacionComponent },
    { path: '', redirectTo: '/pedidos', pathMatch: 'full' },

    // Rutas protegidas
    { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
    { path: 'carrito', component: CarritoComponent, canActivate: [authGuard] },
    {
      path: 'admin',
      component: AdminDashboardComponent,
      canActivate: [authGuard, adminGuard]
    },

    // Redirección para cualquier ruta no encontrada
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
