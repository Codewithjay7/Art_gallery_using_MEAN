import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArtworkService, Artwork } from '../../services/artwork.service';

@Component({
  selector: 'app-artworks',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css'
})
export class ArtworksComponent implements OnInit {
  artworks: Artwork[] = [];
  loading = true;
  error = '';
  showDeleteModal = false;
  artworkToDelete: Artwork | null = null;
   deleting = false;
   success = '';
   searchTerm = '';

  constructor(
    private artworkService: ArtworkService,
    private router: Router
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const successMessage = (nav?.extras?.state as any)?.successMessage;
    const refresh = (nav?.extras?.state as any)?.refresh;
    if (successMessage) {
      this.success = successMessage;
    }
    this.loadArtworks();
  }

  loadArtworks() {
    this.loading = true;
    this.error = '';
    this.success = '';
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

  get filteredArtworks(): Artwork[] {
    if (!this.searchTerm) return this.artworks;
    const term = this.searchTerm.toLowerCase();
    return this.artworks.filter((a) =>
      (a.title || '').toLowerCase().includes(term) ||
      (a.category || '').toLowerCase().includes(term)
    );
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
    const id = (this.artworkToDelete as any)?.id || (this.artworkToDelete as any)?._id;
    if (!this.artworkToDelete || !id) return;

    this.deleting = true;
    this.artworkService.deleteArtwork(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Artwork deleted successfully.';
          this.loadArtworks();
        }
        this.showDeleteModal = false;
        this.artworkToDelete = null;
        this.deleting = false;
      },
      error: (error) => {
        console.error('Error deleting artwork:', error);
        this.error = 'Failed to delete artwork. Please try again.';
        this.showDeleteModal = false;
        this.artworkToDelete = null;
        this.deleting = false;
      }
    });
  }

  markSold(artwork: Artwork) {
    const id = (artwork as any).id || (artwork as any)._id;
    if (!id) return;
    const formData = new FormData();
    formData.append('status', 'Sold');
    this.artworkService.updateArtwork(id, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadArtworks();
        }
      },
      error: (err) => {
        console.error('Error marking sold:', err);
        this.error = 'Failed to update artwork status.';
      }
    });
  }

  markPaid(artwork: Artwork) {
    const id = (artwork as any).id || (artwork as any)._id;
    if (!id) return;
    const formData = new FormData();
    formData.append('paymentStatus', 'Paid');
    this.artworkService.updateArtwork(id, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadArtworks();
        }
      },
      error: (err) => {
        console.error('Error marking paid:', err);
        this.error = 'Failed to update payment status.';
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
