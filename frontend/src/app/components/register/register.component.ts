import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
            MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  errorMessage = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.authService.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => this.errorMessage = 'Registration failed. Username may already exist.'
    });
  }
}
