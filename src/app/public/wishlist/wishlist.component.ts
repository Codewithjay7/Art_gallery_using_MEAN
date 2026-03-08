import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  items: WishlistItem[] = [];

  constructor(private wishlistService: WishlistService, private cartService: CartService) {
    this.wishlistService.items$.subscribe(items => {
      this.items = items;
    });
  }

  moveToCart(item: WishlistItem) {
    this.cartService.add(item.artwork);
    this.wishlistService.remove(item.id);
  }

  remove(item: WishlistItem) {
    this.wishlistService.remove(item.id);
  }
}

