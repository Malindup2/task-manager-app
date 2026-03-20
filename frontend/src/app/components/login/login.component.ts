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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
            MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  errorMessage = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.authService.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => this.errorMessage = 'Invalid username or password'
    });
  }
}
