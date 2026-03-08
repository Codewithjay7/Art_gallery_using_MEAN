import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './header/navbar/navbar.component';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ArtGallery';
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.url);
    });
  }

  private checkRoute(url: string) {
    // Show navbar on all routes except dashboard
    this.showNavbar = !url.startsWith('/dashboard');
  }
}
