import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Wait a bit to ensure authentication is ready
    setTimeout(() => {
      this.loadUsers();
    }, 200);
  }

  loadUsers() {
    if (!this.authService.isAuthenticated()) {
      this.loading = false;
      this.error = 'Please login to view users. Go to /login or /register to authenticate.';
      console.warn('User not authenticated. Token:', this.authService.getToken());
      return;
    }
    
    console.log('User is authenticated. Token exists:', !!this.authService.getToken());

    this.loading = true;
    this.error = '';
    
    console.log('Loading users in UsersComponent...');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Token exists:', !!this.authService.getToken());
    
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        console.log('✅ Users loaded successfully:', response);
        console.log('Response success:', response.success);
        console.log('Response count:', response.count);
        console.log('Response users array:', response.users);
        
        if (response && response.success) {
          this.users = response.users || [];
          console.log('✅ Users array set:', this.users);
          console.log('✅ Number of users:', this.users.length);
          
          if (this.users.length === 0) {
            console.warn('⚠️ Users array is empty even though response was successful');
          }
        } else {
          this.error = 'Failed to load users: Invalid response';
          console.error('❌ Failed to load users: response.success is false or response is invalid');
          console.error('Response:', response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        if (error.status === 401) {
          this.error = 'Authentication required. Please login again.';
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Make sure the backend is running on port 3000.';
        } else {
          this.error = error.error?.message || error.message || 'Failed to load users. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getRandomColor(index: number): string {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'];
    return colors[index % colors.length];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  refreshUsers() {
    this.loadUsers();
  }
}

