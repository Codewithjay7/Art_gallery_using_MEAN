import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { Artwork } from '../../services/artwork.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-arts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './arts-list.component.html',
  styleUrl: './arts-list.component.css'
})
export class ArtsListComponent implements OnInit {
  arts: Artwork[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  constructor(private publicService: PublicService, private searchService: SearchService) {}

  ngOnInit() {
    this.fetchArts();
    this.searchService.query$.subscribe(q => {
      this.searchTerm = q;
    });
  }

  fetchArts() {
    this.loading = true;
    this.error = '';
    this.publicService.getArtworks().subscribe({
      next: (res) => {
        this.arts = res.artworks || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading arts:', err);
        this.error = 'Unable to load data. Please try again later.';
        this.loading = false;
      }
    });
  }

  get filteredArts(): Artwork[] {
    if (!this.searchTerm) return this.arts;
    const term = this.searchTerm.toLowerCase();
    return this.arts.filter(a =>
      (a.title || '').toLowerCase().includes(term) ||
      (a.category || '').toLowerCase().includes(term) ||
      (typeof a.artist === 'object' && (a.artist as any).name
        ? (a.artist as any).name.toLowerCase().includes(term)
        : false)
    );
  }
  getArtworkId(artwork: any): string | null {
    return artwork?.id || artwork?._id || null;
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3000${imageUrl}`;
  }

  getArtistName(artist: any): string {
    if (typeof artist === 'object' && artist?.name) return artist.name;
    return 'Unknown Artist';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);
  }
}
