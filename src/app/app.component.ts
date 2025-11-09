import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FooterComponent } from "./share/footer/footer.component";
import { CabeceraComponent } from "./share/cabecera/cabecera.component";
import { CabeceraClienteComponent } from './share/cabecera-cliente/cabecera-cliente.component';
import { CabeceraAdminComponent } from './share/cabecera-admin/cabecera-admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FooterComponent,
    CabeceraComponent,
    CabeceraClienteComponent,
    CabeceraAdminComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chicharrones-web-frontend';

  // Inyectamos AuthService para poder usarlo en la plantilla
  constructor(public authService: AuthService) { }

  // Getters para simplificar el HTML
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userRole(): 'CLIENTE' | 'ADMIN' | null {
    return this.authService.userRole;
  }
}