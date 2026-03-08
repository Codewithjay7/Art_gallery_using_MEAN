import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ArtworkService, Artwork } from '../../../services/artwork.service';
import { ArtistService, Artist } from '../../../services/artist.service';

@Component({
  selector: 'app-artwork-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artwork-form.component.html',
  styleUrl: './artwork-form.component.css'
})
export class ArtworkFormComponent implements OnInit {
  artworkForm: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  artworkId: string | null = null;
  imagePreview: string | null = null;
  artists: Artist[] = [];
  categories = ['Painting', 'Sketch', 'Digital Art', 'Sculpture'];

  constructor(
    private fb: FormBuilder,
    private artworkService: ArtworkService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.artworkForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['Painting', [Validators.required]],
      artistId: ['', [Validators.required]],
      image: [null]
    });
  }

  ngOnInit() {
    this.loadArtists();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.artworkId = params['id'];
        this.loadArtwork();
      }
    });
  }

  loadArtists() {
    this.artistService.getArtists().subscribe({
      next: (response) => {
        if (response.success && response.artists) {
          this.artists = response.artists;
        }
      },
      error: (error) => {
        console.error('Error loading artists:', error);
      }
    });
  }

  loadArtwork() {
    if (!this.artworkId) return;
    this.loading = true;
    this.artworkService.getArtwork(this.artworkId).subscribe({
      next: (response) => {
        if (response.success && response.artwork) {
          const artwork = response.artwork;
          const artistId =
            typeof artwork.artist === 'object'
              ? ((artwork.artist as any)._id || (artwork.artist as any).id)
              : artwork.artist;
          this.artworkForm.patchValue({
            title: artwork.title,
            description: artwork.description,
            price: artwork.price,
            category: artwork.category,
            artistId
          });
          if (artwork.imageUrl) {
            this.imagePreview = `http://localhost:3000${artwork.imageUrl}`;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artwork:', error);
        this.error = 'Failed to load artwork.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.artworkForm.patchValue({ image: file });
      
      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.artworkForm.invalid) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    // Require image on create
    if (!this.isEditMode && !this.artworkForm.value.image) {
      this.error = 'Please upload an image.';
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('title', this.artworkForm.value.title);
    formData.append('description', this.artworkForm.value.description);
    formData.append('price', this.artworkForm.value.price.toString());
    formData.append('category', this.artworkForm.value.category);
    formData.append('artistId', this.artworkForm.value.artistId);
    if (this.artworkForm.value.image) {
      formData.append('image', this.artworkForm.value.image);
    }

    const request = this.isEditMode && this.artworkId
      ? this.artworkService.updateArtwork(this.artworkId, formData)
      : this.artworkService.createArtwork(formData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard/artworks']);
        } else {
          this.error = response.message || 'Failed to save artwork.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error saving artwork:', error);
        this.error =
          error.error?.message ||
          (error.status === 400 ? 'Please ensure title, category, artist, and image are provided.' : 'Failed to save artwork. Please try again.');
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/artworks']);
  }
}
