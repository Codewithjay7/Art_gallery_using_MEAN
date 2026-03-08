import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArtistService, Artist } from '../../services/artist.service';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  loading = true;
  error = '';
  showDeleteModal = false;
  artistToDelete: Artist | null = null;
  deleting = false;
  success = '';
  searchTerm = '';

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
    this.success = '';
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

  get filteredArtists(): Artist[] {
    if (!this.searchTerm) return this.artists;
    const term = this.searchTerm.toLowerCase();
    return this.artists.filter((a) =>
      (a.name || '').toLowerCase().includes(term) ||
      (a.contact?.email || '').toLowerCase().includes(term)
    );
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
    const id = (this.artistToDelete as any)?.id || (this.artistToDelete as any)?._id;
    if (!this.artistToDelete || !id) return;

    this.deleting = true;
    this.artistService.deleteArtist(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Artist deleted successfully.';
          this.loadArtists();
        }
        this.showDeleteModal = false;
        this.artistToDelete = null;
        this.deleting = false;
      },
      error: (error) => {
        console.error('Error deleting artist:', error);
        this.error = 'Failed to delete artist. Please try again.';
        this.showDeleteModal = false;
        this.artistToDelete = null;
        this.deleting = false;
      }
    });
  }
}
