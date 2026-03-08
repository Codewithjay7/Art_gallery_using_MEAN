import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  processing = false;
  success = false;

  constructor(private cartService: CartService, private router: Router) {}

  get total(): number {
    return this.cartService.getTotal();
  }

  payNow() {
    if (this.processing || this.success) return;
    this.processing = true;
    setTimeout(() => {
      this.cartService.markPurchased();
      this.processing = false;
      this.success = true;
    }, 1500);
  }

  backToGallery() {
    this.router.navigate(['/arts']);
  }
}

