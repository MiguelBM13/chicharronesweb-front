import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true; // Si está logueado, permite el acceso
  }

  // Si no está logueado, redirige a la página de login
  router.navigate(['/login']);
  return false;
};
