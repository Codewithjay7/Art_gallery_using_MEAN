import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Artist {
  id?: string;
  _id?: string;
  name: string;
  bio: string;
  profileImageUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt?: string;
}

export interface ArtistResponse {
  success: boolean;
  artist?: Artist;
  artists?: Artist[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'http://localhost:3000/api/admin/artists';

  constructor(private http: HttpClient) {}

  getArtists(): Observable<ArtistResponse> {
    return this.http.get<ArtistResponse>(this.apiUrl);
  }

  getArtist(id: string): Observable<ArtistResponse> {
    return this.http.get<ArtistResponse>(`${this.apiUrl}/${id}`);
  }

  createArtist(formData: FormData): Observable<ArtistResponse> {
    return this.http.post<ArtistResponse>(this.apiUrl, formData);
  }

  updateArtist(id: string, formData: FormData): Observable<ArtistResponse> {
    return this.http.put<ArtistResponse>(`${this.apiUrl}/${id}`, formData);
  }

  deleteArtist(id: string): Observable<ArtistResponse> {
    return this.http.delete<ArtistResponse>(`${this.apiUrl}/${id}`);
  }
}
