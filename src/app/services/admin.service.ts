import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalArtists: number;
  totalArtworks: number;
  totalUsers: number;
  totalEvents: number;
  soldArtworks: number;
  unsoldArtworks: number;
  totalRevenue: number;
  categories: { [key: string]: number };
  recentArtworks: any[];
  recentArtists: any[];
}

export interface StatsResponse {
  success: boolean;
  stats?: DashboardStats;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats`);
  }
}
