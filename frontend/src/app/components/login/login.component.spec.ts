import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let toastrServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
    };

    toastrServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate form when filled correctly', () => {
    component.form.get('username')?.setValue('testuser');
    component.form.get('password')?.setValue('testpass');
    expect(component.form.valid).toBeTruthy();
  });

  it('should call authService and navigate on valid login', () => {
    const mockResponse = { username: 'testuser', token: 'mock-token' };
    authServiceMock.login.mockReturnValue(of(mockResponse));
    
    component.form.get('username')?.setValue('user1');
    component.form.get('password')?.setValue('pass1');
    component.onSubmit();

    expect(component.isLoading).toBe(true);
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Welcome back!', 'Login Successful');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show error toaster on login failure', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));
    
    component.form.get('username')?.setValue('user1');
    component.form.get('password')?.setValue('wrongpass');
    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Invalid username or password', 'Login Failed');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
