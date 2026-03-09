import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order, OrderService, OrderStatus } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink, DatePipe],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.orders = [];
      return;
    }
    this.orders = this.orderService
      .getOrdersForCurrentUser()
      .slice()
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  getStatusClasses(status: OrderStatus): string {
    switch (status) {
      case 'Processing':
        return 'bg-orange-100 text-orange-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

