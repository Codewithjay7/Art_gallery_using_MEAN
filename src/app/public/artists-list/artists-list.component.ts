import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { Artist } from '../../services/artist.service';

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

  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.fetchArtists();
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

  getArtistId(artist: any): string | null {
    return artist?.id || artist?._id || null;
  }
}
