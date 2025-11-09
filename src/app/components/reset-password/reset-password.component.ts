import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.message = 'Token no válido o enlace incorrecto';
        this.messageType = 'error';
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirm = form.get('confirmPassword');
    
    if (password && confirm && password.value !== confirm.value) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.loading = true;
      this.message = '';

      this.authService.resetPassword(this.token, this.resetForm.value.newPassword).subscribe({
        next: (response: any) => {
          this.message = response.message || 'Contraseña actualizada exitosamente';
          this.messageType = 'success';
          this.loading = false;
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.message = error.error?.message || 'Error al restablecer la contraseña';
          this.messageType = 'error';
          this.loading = false;
        }
      });
    }
  }
}