import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  infoMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const msg = this.route.snapshot.queryParamMap.get('message');
    if (msg) {
      this.infoMessage = msg;
    }
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.loading = false;
          const role = (response.user as any)?.role;
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.loading = false;
          this.error = 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        if (error.status === 0) {
          this.error = 'Cannot connect to server. Please make sure the backend server is running on port 3000.';
        } else if (error.error?.message) {
          this.error = error.error.message;
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }
    });
  }
}
