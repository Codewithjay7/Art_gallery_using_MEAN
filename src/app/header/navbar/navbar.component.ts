import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  open = false;
  artsOpen = false;
  artistOpen = false;
  
  toggleMobileMenu() {
    this.open = !this.open;
  }

  toggleArtsMenu() {
    this.artsOpen = !this.artsOpen;
  }

  toggleArtistMenu() {
    this.artistOpen = !this.artistOpen;
  }
}
