import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { Artist } from '../../services/artist.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-artists-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artists-list.component.html',
  styleUrl: './artists-list.component.css'
})
export class ArtistsListComponent implements OnInit {
  artists: Artist[] = [];
  loading = true;
  error = '';

  searchTerm = '';

  constructor(private publicService: PublicService, private searchService: SearchService) {}

  ngOnInit() {
    this.fetchArtists();
    this.searchService.query$.subscribe(q => {
      this.searchTerm = q;
    });
  }

  fetchArtists() {
    this.loading = true;
    this.error = '';
    this.publicService.getArtists().subscribe({
      next: (res) => {
        this.artists = res.artists || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading artists:', err);
        this.error = 'Unable to load data. Please try again later.';
        this.loading = false;
      }
    });
  }

  getImageUrl(url?: string): string {
    if (!url) return 'https://via.placeholder.com/300?text=No+Image';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  }

  get filteredArtists(): Artist[] {
    if (!this.searchTerm) return this.artists;
    const term = this.searchTerm.toLowerCase();
    return this.artists.filter(a =>
      (a.name || '').toLowerCase().includes(term) ||
      (a.contact?.email || '').toLowerCase().includes(term)
    );
  }

  getArtistId(artist: any): string | null {
    return artist?.id || artist?._id || null;
  }
}
