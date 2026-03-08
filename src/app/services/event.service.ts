import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventModel {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  participatingArtists: { id?: string; _id?: string; name: string }[] | string[];
}

export interface EventsResponse {
  success: boolean;
  events?: EventModel[];
  event?: EventModel;
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/admin/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.apiUrl);
  }

  getEvent(id: string): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(`${this.apiUrl}/${id}`);
  }

  createEvent(body: any): Observable<EventsResponse> {
    return this.http.post<EventsResponse>(this.apiUrl, body);
  }

  updateEvent(id: string, body: any): Observable<EventsResponse> {
    return this.http.put<EventsResponse>(`${this.apiUrl}/${id}`, body);
  }

  deleteEvent(id: string): Observable<EventsResponse> {
    return this.http.delete<EventsResponse>(`${this.apiUrl}/${id}`);
  }
}

