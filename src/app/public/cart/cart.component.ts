import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {
    this.cartService.items$.subscribe(items => {
      this.items = items;
    });
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  remove(item: CartItem) {
    this.cartService.remove(item.id);
  }

  goToCheckout() {
    if (!this.items.length) return;
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: this.router.url,
          message: 'Please login to continue your purchase.'
        }
      });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}

