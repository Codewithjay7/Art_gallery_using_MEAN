import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from './artist.service';
import { Artwork } from './artwork.service';

export interface PublicArtistsResponse {
  success: boolean;
  artists?: Artist[];
  count?: number;
}

export interface PublicArtworksResponse {
  success: boolean;
  artworks?: Artwork[];
  count?: number;
}

export interface PublicEventsResponse {
  success: boolean;
  events?: any[];
  event?: any;
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private apiUrl = 'http://localhost:3000/api/public';

  constructor(private http: HttpClient) {}

  getArtists(): Observable<PublicArtistsResponse> {
    return this.http.get<PublicArtistsResponse>(`${this.apiUrl}/artists`);
  }

  getArtist(id: string): Observable<{ success: boolean; artist?: Artist }> {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Artist ID missing');
    }
    return this.http.get<{ success: boolean; artist?: Artist }>(`${this.apiUrl}/artists/${id}`);
  }

  getArtworks(options?: { category?: string; artistId?: string }): Observable<PublicArtworksResponse> {
    const params = new URLSearchParams();
    if (options?.category) params.set('category', options.category);
    if (options?.artistId) params.set('artistId', options.artistId);
    const qs = params.toString();
    const url = qs ? `${this.apiUrl}/artworks?${qs}` : `${this.apiUrl}/artworks`;
    return this.http.get<PublicArtworksResponse>(url);
  }

  getArtwork(id: string): Observable<{ success: boolean; artwork?: Artwork }> {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Artwork ID missing');
    }
    return this.http.get<{ success: boolean; artwork?: Artwork }>(`${this.apiUrl}/artworks/${id}`);
  }

  getEvents(): Observable<PublicEventsResponse> {
    return this.http.get<PublicEventsResponse>(`${this.apiUrl}/events`);
  }

  getEvent(id: string): Observable<PublicEventsResponse> {
    return this.http.get<PublicEventsResponse>(`${this.apiUrl}/events/${id}`);
  }
}
