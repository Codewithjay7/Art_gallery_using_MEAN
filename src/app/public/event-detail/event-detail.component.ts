import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    public router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    } else {
      this.error = 'Invalid event id';
      this.loading = false;
    }
  }

  loadEvent(id: string) {
    this.loading = true;
    this.publicService.getEvent(id).subscribe({
      next: (res) => {
        if (res.success && res.event) {
          this.event = res.event;
        } else {
          this.error = 'Event not found';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.error = 'Failed to load event';
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}

