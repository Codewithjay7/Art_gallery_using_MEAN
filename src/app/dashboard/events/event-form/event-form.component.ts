import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, EventModel } from '../../../services/event.service';
import { Artist, ArtistService } from '../../../services/artist.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  isEditMode = false;
  eventId: string | null = null;

  artists: Artist[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      location: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      participatingArtists: [[]]
    });
  }

  ngOnInit() {
    this.loadArtists();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = params['id'];
        this.loadEvent();
      }
    });
  }

  loadArtists() {
    this.artistService.getArtists().subscribe({
      next: (res) => {
        if (res.success && res.artists) this.artists = res.artists;
      },
      error: (err) => console.error('Error loading artists for event form:', err)
    });
  }

  loadEvent() {
    if (!this.eventId) return;
    this.loading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (res) => {
        if (res.success && res.event) {
          const e = res.event as any;
          const ids =
            Array.isArray(e.participatingArtists)
              ? e.participatingArtists.map((a: any) => a?._id || a?.id || a).filter(Boolean)
              : [];
          this.eventForm.patchValue({
            title: e.title,
            description: e.description || '',
            location: e.location,
            startDate: this.toInputDateTime(e.startDate),
            endDate: this.toInputDateTime(e.endDate),
            participatingArtists: ids
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.error = 'Failed to load event.';
        this.loading = false;
      }
    });
  }

  private toInputDateTime(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  onSubmit() {
    console.log('[EventForm] submit clicked');
    if (this.eventForm.invalid) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const payload: Partial<EventModel> = {
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      location: this.eventForm.value.location,
      startDate: this.eventForm.value.startDate,
      endDate: this.eventForm.value.endDate,
      participatingArtists: this.eventForm.value.participatingArtists || []
    };

    console.log('[EventForm] sending payload', payload);

    const req = this.isEditMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, payload)
      : this.eventService.createEvent(payload);

    req.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = res.message || 'Event added successfully';
          console.log('[EventForm] success:', this.success);
          this.router.navigate(['/dashboard/events'], {
            state: { successMessage: this.success, refresh: true }
          });
        } else {
          this.error = res.message || 'Failed to save event.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error saving event:', err);
        this.error = err.error?.message || 'Failed to save event. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/events']);
  }
}

