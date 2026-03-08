import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        if (response.success) {
          this.loading = false;
          console.log('Token stored:', !!this.authService.getToken());
          console.log('Navigating to dashboard...');
          // Small delay to ensure token is stored
          setTimeout(() => {
            this.router.navigate(['/dashboard']).then(() => {
              console.log('Navigation complete');
            });
          }, 100);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        
        if (error.status === 0) {
          this.error = 'Cannot connect to server. Please make sure the backend server is running on port 3000.';
        } else if (error.error?.message) {
          this.error = error.error.message;
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
