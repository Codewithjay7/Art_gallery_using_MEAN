import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { DeliveryInfo, OrderService } from '../../services/order.service';
import { ArtworkService, Artwork } from '../../services/artwork.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  step: 'delivery' | 'payment' | 'success' = 'delivery';
  processing = false;
  success = false;
  delivery: DeliveryInfo = {
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    deliveryNotes: ''
  };
  submitted = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private artworkService: ArtworkService
  ) {}

  get total(): number {
    return this.cartService.getTotal();
  }

  get hasItems(): boolean {
    return this.cartService.items.length > 0;
  }

  continueToPayment(form: NgForm) {
    this.submitted = true;
    if (form.invalid || !this.hasItems) {
      return;
    }
    this.step = 'payment';
  }

  payNow() {
    if (this.processing || this.success) return;
    if (!this.hasItems) return;

    this.processing = true;
    setTimeout(() => {
      // create order for all cart items
      this.orderService.createOrderFromCart(this.cartService.items, this.delivery, 'Paid');

      // mark each artwork as Sold and Paid in the admin backend
      this.cartService.items.forEach(item => {
        const id = (item.artwork as any).id || (item.artwork as any)._id;
        if (!id) return;
        const formData = new FormData();
        formData.append('status', 'Sold');
        formData.append('paymentStatus', 'Paid');
        this.artworkService.updateArtwork(id, formData).subscribe({
          next: () => {},
          error: (err) => {
            console.error('Failed to update artwork after cart payment', err);
          }
        });
      });

      // persist purchased ids for public-side "Sold" display and clear cart
      this.cartService.markPurchased();
      this.processing = false;
      this.success = true;
      this.step = 'success';
    }, 1500);
  }

  backToGallery() {
    this.router.navigate(['/arts']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }
}

