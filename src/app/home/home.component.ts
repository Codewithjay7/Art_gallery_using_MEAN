import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicService } from '../services/public.service';
import { Artwork } from '../services/artwork.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  artworks: Artwork[] = [];
  filteredArtworks: Artwork[] = [];
  selectedCategory: string = 'All';
  loading = true;
  categories = ['All', 'Painting', 'Sketch', 'Digital Art', 'Sculpture'];

  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.loadArtworks();
  }

  loadArtworks() {
    this.loading = true;
    this.publicService.getArtworks().subscribe({
      next: (response) => {
        if (response.success && response.artworks) {
          this.artworks = response.artworks;
          this.filteredArtworks = this.artworks;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artworks:', error);
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredArtworks = this.artworks;
    } else {
      this.publicService.getArtworks({ category }).subscribe({
        next: (response) => {
          if (response.success && response.artworks) {
            this.filteredArtworks = response.artworks;
          }
        }
      });
    }
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
    if (typeof artist === 'object' && artist.name) {
      return artist.name;
    }
    return 'Unknown Artist';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
