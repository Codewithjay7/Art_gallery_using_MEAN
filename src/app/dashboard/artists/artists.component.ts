import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ArtistService, Artist } from '../../services/artist.service';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  loading = true;
  error = '';
  showDeleteModal = false;
  artistToDelete: Artist | null = null;

  constructor(
    private artistService: ArtistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArtists();
  }

  loadArtists() {
    this.loading = true;
    this.error = '';
    this.artistService.getArtists().subscribe({
      next: (response) => {
        if (response.success && response.artists) {
          this.artists = response.artists;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artists:', error);
        this.error = 'Failed to load artists. Please try again.';
        this.loading = false;
      }
    });
  }

  confirmDelete(artist: Artist) {
    this.artistToDelete = artist;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.artistToDelete = null;
  }

  deleteArtist() {
    if (!this.artistToDelete || !this.artistToDelete.id) return;

    this.artistService.deleteArtist(this.artistToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadArtists();
        }
        this.showDeleteModal = false;
        this.artistToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting artist:', error);
        this.error = 'Failed to delete artist. Please try again.';
        this.showDeleteModal = false;
        this.artistToDelete = null;
      }
    });
  }
}
