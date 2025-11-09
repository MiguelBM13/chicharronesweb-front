import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  imports: [CommonModule, ReactiveFormsModule] 
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.loading = true;
      this.message = '';

      this.authService.recoverPassword(this.forgotForm.value.email).subscribe({
        next: (response: any) => {
          this.message = response.message || 'Se ha enviado un enlace de recuperación a tu email';
          this.messageType = 'success';
          this.loading = false;
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error: any) => {
          this.message = error.error?.message || 'Error al procesar la solicitud';
          this.messageType = 'error';
          this.loading = false;
        }
      });
    }
  }
}