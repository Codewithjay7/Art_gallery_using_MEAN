import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order, OrderService, OrderStatus } from '../../../services/order.service';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgIf],
  templateUrl: './order-detail.component.html'
})
export class AdminOrderDetailComponent implements OnInit {
  order: Order | undefined;
  availableStatuses: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('orderId');
    if (id) {
      this.order = this.orderService.getOrderById(id);
    }
    if (!this.order) {
      this.router.navigate(['/dashboard/orders']);
    }
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

  updateStatus(newStatus: OrderStatus) {
    if (!this.order || this.order.orderStatus === newStatus) {
      return;
    }
    this.orderService.updateOrderStatus(this.order.orderId, newStatus);
    this.order = this.orderService.getOrderById(this.order.orderId);
  }
}

