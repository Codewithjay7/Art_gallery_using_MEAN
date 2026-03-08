import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ArtistService, Artist } from '../../../services/artist.service';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artist-form.component.html',
  styleUrl: './artist-form.component.css'
})
export class ArtistFormComponent implements OnInit {
  artistForm: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  artistId: string | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.artistForm = this.fb.group({
      name: ['', [Validators.required]],
      bio: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      website: [''],
      instagram: [''],
      twitter: [''],
      profileImage: [null]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.artistId = params['id'];
        this.loadArtist();
      }
    });
  }

  loadArtist() {
    if (!this.artistId) return;
    this.loading = true;
    this.artistService.getArtist(this.artistId).subscribe({
      next: (response) => {
        if (response.success && response.artist) {
          const artist = response.artist;
          this.artistForm.patchValue({
            name: artist.name,
            bio: artist.bio,
            email: artist.contact?.email || '',
            phone: artist.contact?.phone || '',
            website: artist.socialLinks?.website || '',
            instagram: artist.socialLinks?.instagram || '',
            twitter: artist.socialLinks?.twitter || ''
          });
          if (artist.profileImageUrl) {
            this.imagePreview = `http://localhost:3000${artist.profileImageUrl}`;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading artist:', error);
        this.error = 'Failed to load artist.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.artistForm.patchValue({ profileImage: file });
      
      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.artistForm.invalid) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('name', this.artistForm.value.name);
    formData.append('bio', this.artistForm.value.bio);
    formData.append('email', this.artistForm.value.email);
    formData.append('phone', this.artistForm.value.phone);
    if (this.artistForm.value.website) formData.append('website', this.artistForm.value.website);
    if (this.artistForm.value.instagram) formData.append('instagram', this.artistForm.value.instagram);
    if (this.artistForm.value.twitter) formData.append('twitter', this.artistForm.value.twitter);
    if (this.artistForm.value.profileImage) {
      formData.append('profileImage', this.artistForm.value.profileImage);
    }

    const request = this.isEditMode && this.artistId
      ? this.artistService.updateArtist(this.artistId, formData)
      : this.artistService.createArtist(formData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard/artists']);
        } else {
          this.error = response.message || 'Failed to save artist.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error saving artist:', error);
        this.error = error.error?.message || 'Failed to save artist. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/artists']);
  }
}
