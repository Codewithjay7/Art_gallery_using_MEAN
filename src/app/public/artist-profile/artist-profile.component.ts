import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { Artist } from '../../services/artist.service';
import { Artwork } from '../../services/artwork.service';

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.css'
})
export class ArtistProfileComponent implements OnInit {
  artist: Artist | null = null;
  artworks: Artwork[] = [];
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
      this.loadArtist(id);
      this.loadArtistArtworks(id);
    }
  }

  loadArtist(id: string) {
    this.publicService.getArtist(id).subscribe({
      next: (response) => {
        if (response.success && response.artist) {
          this.artist = this.normalizeArtist(response.artist);
        } else {
          this.error = 'Artist not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artist:', error);
        this.error = 'Failed to load artist';
        this.loading = false;
      }
    });
  }

  loadArtistArtworks(artistId: string) {
    this.publicService.getArtworks({ artistId }).subscribe({
      next: (response) => {
        if (response.success && response.artworks) {
          this.artworks = response.artworks;
        }
      },
      error: (error) => {
        console.error('Error loading artworks:', error);
      }
    });
  }

  /** Map API shape (Mongo _id, social) to what templates expect */
  private normalizeArtist(raw: Artist & { _id?: string; social?: Artist['social'] }): Artist {
    const contact = raw.contact || {};
    const social = raw.social || {};
    return {
      ...raw,
      id: raw.id || (raw._id != null ? String(raw._id) : undefined),
      socialLinks: raw.socialLinks || {
        website: contact.website,
        instagram: social.instagram,
        twitter: social.twitter
      }
    };
  }

  getArtworkId(artwork: Artwork): string {
    const a = artwork as Artwork & { _id?: string };
    return String(a.id ?? a._id ?? '');
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3000${imageUrl}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
