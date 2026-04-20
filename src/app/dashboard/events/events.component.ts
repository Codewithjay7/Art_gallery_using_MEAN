import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService, EventModel } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: EventModel[] = [];
  loading = true;
  error = '';
  success = '';
  searchTerm = '';
  showDeleteModal = false;
  deleting = false;
  eventToDelete: EventModel | null = null;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const successMessage = (nav?.extras?.state as any)?.successMessage;
    const refresh = (nav?.extras?.state as any)?.refresh;
    if (successMessage) {
      this.success = successMessage;
    }
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.eventService.getEvents().subscribe({
      next: (res) => {
        this.events = res.events || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events. Please try again.';
        this.loading = false;
      }
    });
  }

  get filteredEvents(): EventModel[] {
    if (!this.searchTerm) return this.events;
    const term = this.searchTerm.toLowerCase();
    return this.events.filter((e) =>
      (e.title || '').toLowerCase().includes(term) ||
      (e.location || '').toLowerCase().includes(term)
    );
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  confirmDelete(event: EventModel) {
    this.eventToDelete = event;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.eventToDelete = null;
  }

  deleteEvent() {
    const id = (this.eventToDelete as any)?.id || (this.eventToDelete as any)?._id;
    if (!this.eventToDelete || !id) return;

    this.deleting = true;
    this.eventService.deleteEvent(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Event deleted successfully.';
          this.loadEvents();
        }
        this.showDeleteModal = false;
        this.eventToDelete = null;
        this.deleting = false;
      },
      error: (err) => {
        console.error('Error deleting event:', err);
        this.error = 'Failed to delete event.';
        this.showDeleteModal = false;
        this.eventToDelete = null;
        this.deleting = false;
      }
    });
  }
}

