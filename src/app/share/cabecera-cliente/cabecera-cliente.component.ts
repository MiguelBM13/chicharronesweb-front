import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cabecera-cliente',
  templateUrl: './cabecera-cliente.component.html',
  styleUrls: ['./cabecera-cliente.component.css']
})
export class CabeceraClienteComponent {
  constructor(public authService: AuthService) {}
}
