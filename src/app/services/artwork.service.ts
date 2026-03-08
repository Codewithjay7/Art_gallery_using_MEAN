import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Artwork {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  price: number;
  category: 'Painting' | 'Sketch' | 'Digital Art' | 'Sculpture';
  artist: string | { id?: string; _id?: string; name: string };
  createdAt?: string;
}

export interface ArtworkResponse {
  success: boolean;
  artwork?: Artwork;
  artworks?: Artwork[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = 'http://localhost:3000/api/admin/artworks';

  constructor(private http: HttpClient) {}

  getArtworks(): Observable<ArtworkResponse> {
    return this.http.get<ArtworkResponse>(this.apiUrl);
  }

  getArtwork(id: string): Observable<ArtworkResponse> {
    return this.http.get<ArtworkResponse>(`${this.apiUrl}/${id}`);
  }

  createArtwork(formData: FormData): Observable<ArtworkResponse> {
    return this.http.post<ArtworkResponse>(this.apiUrl, formData);
  }

  updateArtwork(id: string, formData: FormData): Observable<ArtworkResponse> {
    return this.http.put<ArtworkResponse>(`${this.apiUrl}/${id}`, formData);
  }

  deleteArtwork(id: string): Observable<ArtworkResponse> {
    return this.http.delete<ArtworkResponse>(`${this.apiUrl}/${id}`);
  }
}
