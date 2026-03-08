import { Routes } from '@angular/router';
import { LoginComponent } from './header/login/login.component';
import { RegisterComponent } from './header/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './dashboard/users/users.component';
import { HomeComponent } from './home/home.component';
import { adminGuard } from './guards/admin.guard';

// Lazy load admin components
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/users',
    component: UsersComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/artists',
    loadComponent: () => import('./dashboard/artists/artists.component').then(m => m.ArtistsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/artists/new',
    loadComponent: () => import('./dashboard/artists/artist-form/artist-form.component').then(m => m.ArtistFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/artists/edit/:id',
    loadComponent: () => import('./dashboard/artists/artist-form/artist-form.component').then(m => m.ArtistFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/artworks',
    loadComponent: () => import('./dashboard/artworks/artworks.component').then(m => m.ArtworksComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/artworks/new',
    loadComponent: () => import('./dashboard/artworks/artwork-form/artwork-form.component').then(m => m.ArtworkFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/artworks/edit/:id',
    loadComponent: () => import('./dashboard/artworks/artwork-form/artwork-form.component').then(m => m.ArtworkFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'artwork/:id',
    loadComponent: () => import('./public/artwork-detail/artwork-detail.component').then(m => m.ArtworkDetailComponent)
  },
  {
    path: 'artist/:id',
    loadComponent: () => import('./public/artist-profile/artist-profile.component').then(m => m.ArtistProfileComponent)
  },
  {
    path: 'arts',
    loadComponent: () => import('./public/arts-list/arts-list.component').then(m => m.ArtsListComponent)
  },
  {
    path: 'artists',
    loadComponent: () => import('./public/artists-list/artists-list.component').then(m => m.ArtistsListComponent)
  }
];
