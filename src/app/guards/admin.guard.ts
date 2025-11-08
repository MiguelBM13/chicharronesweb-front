import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn && authService.userRole === 'ADMIN') {
    return true; // Si es admin, permite el acceso
  }

  // Si no es admin, redirige al menú
  router.navigate(['/menu']);
  return false;
};
