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
import { EditPerfilComponent } from './components/edit-perfil/edit-perfil.component';
import { GestionPerfilComponent } from './components/admin/gestion-perfil/gestion-perfil.component';
import { GestionPedidosComponent } from './components/admin/gestion-pedidos/gestion-pedidos.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // La landing es la nueva ruta raíz
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'calificar/:id', component: CalificacionComponent },
  { path: 'edit-perfil', component: EditPerfilComponent },
  { path: '', redirectTo: '/pedidos', pathMatch: 'full' },

  // Rutas protegidas
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [authGuard] },

  {
    path: 'gestion-perfil', component: GestionPerfilComponent,
    canActivate: [authGuard, adminGuard]
  },
    {
    path: 'gestion-pedidos', component: GestionPedidosComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },

  // Redirección para cualquier ruta no encontrada
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
