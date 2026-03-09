import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.storeToken(response.token);
          this.storeUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAllUsers(): Observable<{ success: boolean; count: number; users: User[] }> {
    const token = this.getToken();
    
    if (!token) {
      console.error('No authentication token found. Please login first.');
      return throwError(() => ({ status: 401, message: 'No authentication token' }));
    }
    
    console.log('Fetching users from:', `${this.apiUrl}/users`);
    console.log('Using token:', token.substring(0, 20) + '...');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<{ success: boolean; count: number; users: User[] }>(`${this.apiUrl}/users`, { headers }).pipe(
      tap(response => {
        console.log('Users API response:', response);
        console.log('Number of users received:', response.users?.length || 0);
      }),
      catchError(error => {
        console.error('Error in getAllUsers API call:', error);
        return throwError(() => error);
      })
    );
  }
}
