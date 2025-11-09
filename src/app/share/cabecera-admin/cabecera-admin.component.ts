import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cabecera-admin',
    templateUrl: './cabecera-admin.component.html',
    styleUrls: ['./cabecera-admin.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class CabeceraAdminComponent {
    constructor(public authService: AuthService) { }

    // Método para capitalizar solo la primera letra
    get nombreCapitalizado(): string {
        const nombre = this.authService.currentUserValue?.nombre;
        if (!nombre) return '';
        return nombre.charAt(0).toUpperCase() + nombre.slice(1);
    }
}
