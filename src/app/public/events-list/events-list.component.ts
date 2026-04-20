import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent implements OnInit {
  events: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filter: 'all' | 'upcoming' | 'past' = 'all';

  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = '';
    this.publicService.getEvents().subscribe({
      next: (res) => {
        const list = res.events || [];
        // Show upcoming first, then past
        const now = Date.now();
        this.events = list.sort((a, b) => {
          const aTime = new Date(a.startDate || a.createdAt || 0).getTime();
          const bTime = new Date(b.startDate || b.createdAt || 0).getTime();
          const aIsUpcoming = aTime >= now;
          const bIsUpcoming = bTime >= now;
          if (aIsUpcoming !== bIsUpcoming) return aIsUpcoming ? -1 : 1;
          return aTime - bTime;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Unable to load events. Please try again later.';
        this.loading = false;
      }
    });
  }

  get filteredEvents(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    const now = Date.now();

    return (this.events || []).filter((e) => {
      const title = String(e?.title || '').toLowerCase();
      const location = String(e?.location || '').toLowerCase();
      const desc = String(e?.description || '').toLowerCase();
      const match = !term || title.includes(term) || location.includes(term) || desc.includes(term);
      if (!match) return false;

      const start = new Date(e?.startDate || 0).getTime();
      const end = new Date(e?.endDate || e?.startDate || 0).getTime();
      const isUpcoming = (start || end) >= now;
      if (this.filter === 'upcoming') return isUpcoming;
      if (this.filter === 'past') return !isUpcoming;
      return true;
    });
  }

  setFilter(value: 'all' | 'upcoming' | 'past') {
    this.filter = value;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  formatRange(start: string, end: string): string {
    const s = this.formatDate(start);
    const e = this.formatDate(end);
    if (!s && !e) return '';
    if (s && e && s === e) return s;
    return `${s} - ${e}`;
  }

  getStatus(event: any): 'Upcoming' | 'Ongoing' | 'Ended' {
    const now = Date.now();
    const start = new Date(event?.startDate || 0).getTime();
    const end = new Date(event?.endDate || event?.startDate || 0).getTime();
    if (start && start > now) return 'Upcoming';
    if (end && end < now) return 'Ended';
    return 'Ongoing';
  }
}

