import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear local storage logic
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should save token and username on login', () => {
    const loginRequest = { username: 'testuser', password: 'password123' };
    const mockResponse = { token: 'mock-jwt-token', username: 'testuser' };

    service.login(loginRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('username')).toBe('testuser');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register a new user', () => {
    const registerRequest = { username: 'testuser', password: 'password123' };
    
    service.register(registerRequest).subscribe(response => {
      expect(response).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush('User registered successfully');
  });

  it('should handle logout correctly', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('username', 'some-user');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  it('should correctly identify if user is logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
    
    localStorage.setItem('token', 'some-valid-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return username if authenticated', () => {
    expect(service.getUsername()).toBeNull();
    
    localStorage.setItem('username', 'testuser');
    expect(service.getUsername()).toBe('testuser');
  });
});
