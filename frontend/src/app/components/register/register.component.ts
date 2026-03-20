import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.register(this.form.value as any).subscribe({
      next: () => {
        this.toastr.success('Account created successfully!', 'Welcome to Taskify');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Registration failed. Username may already exist.', 'Error');
      }
    });
  }
}
