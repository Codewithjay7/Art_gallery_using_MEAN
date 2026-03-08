import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  open = false;
  searchTerm = '';

  constructor(private router: Router, private searchService: SearchService) {}

  toggleMobileMenu() {
    this.open = !this.open;
  }

  onSearch() {
    this.searchService.setQuery(this.searchTerm.trim());
    const url = this.router.url;
    if (url.startsWith('/artists')) {
      this.router.navigate(['/artists']);
    } else {
      this.router.navigate(['/arts']);
    }
  }
}
