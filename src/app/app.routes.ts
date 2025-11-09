import { GestionPedidosComponent } from './components/admin/gestion-pedidos/gestion-pedidos.component';
import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LandingComponent } from './components/landing/landing.component'; // Importar
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ContactoComponent } from './share/contacto/contacto.component';
import { NosotrosComponent } from './share/nosotros/nosotros.component';
import { PerfilGestionComponent } from './components/admin/perfil-gestion/perfil-gestion.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // La landing es la nueva ruta raíz
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  {path:'pedidos',component:GestionPedidosComponent, canActivate: [authGuard, adminGuard]},

  // Rutas protegidas
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminDashboardComponent,  canActivate: [authGuard, adminGuard],  },
  { path: 'gestion-perfil', component: PerfilGestionComponent, canActivate: [authGuard, adminGuard] },

  // Redirección para cualquier ruta no encontrada
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
