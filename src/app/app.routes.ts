import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LandingComponent } from './components/landing/landing.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    
    // ✅ AGREGA ESTAS RUTAS DE RECUPERACIÓN
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

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