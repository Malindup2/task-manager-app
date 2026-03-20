import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = false;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.login(this.form.value as any).subscribe({
      next: () => {
        this.toastr.success('Welcome back!', 'Login Successful');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Invalid username or password', 'Login Failed');
      }
    });
  }
}
