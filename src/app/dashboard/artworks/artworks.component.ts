import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ArtworkService, Artwork } from '../../services/artwork.service';

@Component({
  selector: 'app-artworks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css'
})
export class ArtworksComponent implements OnInit {
  artworks: Artwork[] = [];
  loading = true;
  error = '';
  showDeleteModal = false;
  artworkToDelete: Artwork | null = null;

  constructor(
    private artworkService: ArtworkService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArtworks();
  }

  loadArtworks() {
    this.loading = true;
    this.error = '';
    this.artworkService.getArtworks().subscribe({
      next: (response) => {
        if (response.success && response.artworks) {
          this.artworks = response.artworks;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artworks:', error);
        this.error = 'Failed to load artworks. Please try again.';
        this.loading = false;
      }
    });
  }

  confirmDelete(artwork: Artwork) {
    this.artworkToDelete = artwork;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.artworkToDelete = null;
  }

  deleteArtwork() {
    if (!this.artworkToDelete || !this.artworkToDelete.id) return;

    this.artworkService.deleteArtwork(this.artworkToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadArtworks();
        }
        this.showDeleteModal = false;
        this.artworkToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting artwork:', error);
        this.error = 'Failed to delete artwork. Please try again.';
        this.showDeleteModal = false;
        this.artworkToDelete = null;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getArtistName(artist: any): string {
    if (typeof artist === 'object' && artist.name) {
      return artist.name;
    }
    return 'N/A';
  }
}
