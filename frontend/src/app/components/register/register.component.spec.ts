import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let toastrServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      register: vi.fn(),
    };

    toastrServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form if fields are missing or too short', () => {
    component.form.get('username')?.setValue('ab');
    component.form.get('password')?.setValue('12345');
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate form when criteria is met', () => {
    component.form.get('username')?.setValue('testuser');
    component.form.get('password')?.setValue('securepassword');
    expect(component.form.valid).toBeTruthy();
  });

  it('should call authService and navigate on valid registration', () => {
    authServiceMock.register.mockReturnValue(of('Success'));
    
    component.form.get('username')?.setValue('newuser');
    component.form.get('password')?.setValue('pass1234');
    component.onSubmit();

    expect(component.isLoading).toBe(true);
    expect(authServiceMock.register).toHaveBeenCalled();
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Account created successfully!', 'Welcome to Taskify');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show error toaster on registration failure', () => {
    authServiceMock.register.mockReturnValue(throwError(() => new Error('Registration failed')));
    
    component.form.get('username')?.setValue('newuser');
    component.form.get('password')?.setValue('pass1234');
    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(authServiceMock.register).toHaveBeenCalled();
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Registration failed. Username may already exist.', 'Error');
  });
});
