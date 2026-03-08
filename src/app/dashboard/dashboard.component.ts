import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { AdminService, DashboardStats } from '../services/admin.service';
import { ArtworkService, Artwork } from '../services/artwork.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive, NgIf, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sidebarOpen = true;
  loading: boolean = true;
  stats: DashboardStats = {
    totalArtists: 0,
    totalArtworks: 0,
    categories: {},
    recentArtworks: []
  };

  constructor(
    public authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadStats();
    }, 200);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadStats() {
    if (!this.authService.isAuthenticated()) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.adminService.getStats().subscribe({
      next: (response) => {
        if (response.success && response.stats) {
          this.stats = response.stats;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  getCategoryCount(): number {
    return Object.keys(this.stats.categories || {}).length;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
