import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { Artwork } from '../../services/artwork.service';

@Component({
  selector: 'app-artwork-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artwork-detail.component.html',
  styleUrl: './artwork-detail.component.css'
})
export class ArtworkDetailComponent implements OnInit {
  artwork: Artwork | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    public router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id || id === 'undefined' || id === 'null') {
        this.error = 'Invalid artwork id';
        this.loading = false;
        return;
      }
      this.loadArtwork(id);
    });
  }

  loadArtwork(id: string) {
    this.loading = true;
    this.publicService.getArtwork(id).subscribe({
      next: (response) => {
        if (response.success && response.artwork) {
          this.artwork = response.artwork;
        } else {
          this.error = 'Artwork not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artwork:', error);
        this.error = 'Failed to load artwork';
        this.loading = false;
      }
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3000${imageUrl}`;
  }

  getArtistName(artist: any): string {
    if (typeof artist === 'object' && artist.name) {
      return artist.name;
    }
    return 'Unknown Artist';
  }

  getArtistId(artist: any): string | null {
    if (typeof artist === 'object' && artist.id) {
      return artist.id;
    }
    if (typeof artist === 'string') {
      return artist;
    }
    return null;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
