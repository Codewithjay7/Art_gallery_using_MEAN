import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';
import { Artwork } from './artwork.service';
import { AuthService } from './auth.service';

export type PaymentStatus = 'Paid' | 'Pending';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface DeliveryInfo {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryNotes?: string;
}

export interface OrderArtworkInfo {
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  price: number;
  artworkImage?: string;
}

export interface Order {
  orderId: string;
  userId?: string;
  clientId: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: 'Cart Fake Payment';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryInfo: DeliveryInfo;
  artworks: OrderArtworkInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private storageKey = 'artGallery_orders';
  private clientIdKey = 'artGallery_clientId';
  private ordersSubject = new BehaviorSubject<Order[]>(this.loadOrders());
  orders$ = this.ordersSubject.asObservable();

  constructor(private authService: AuthService) {}

  private loadOrders(): Order[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      // lightweight migration for previous shape (single-artwork orders)
      return parsed.map((o: any) => this.migrateOrder(o)).filter((o: any) => !!o) as Order[];
    } catch {
      return [];
    }
  }

  private save(orders: Order[]) {
    this.ordersSubject.next(orders);
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  private getOrCreateClientId(): string {
    const existing = localStorage.getItem(this.clientIdKey);
    if (existing) return existing;
    const newId = `CID-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem(this.clientIdKey, newId);
    return newId;
  }

  getAllOrders(): Order[] {
    return this.ordersSubject.value;
  }

  getOrdersForCurrentUser(): Order[] {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return [];
    }
    return this.getAllOrders().filter(o => o.userId === user.id);
  }

  getOrderById(orderId: string): Order | undefined {
    return this.getAllOrders().find(o => o.orderId === orderId);
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    const updated = this.getAllOrders().map(order =>
      order.orderId === orderId ? { ...order, orderStatus: status } : order
    );
    this.save(updated);
  }

  createOrderFromCart(
    items: CartItem[],
    delivery: DeliveryInfo,
    paymentStatus: PaymentStatus = 'Paid'
  ): Order {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    const clientId = this.getOrCreateClientId();

    const now = new Date();
    const artworks = items.map(i => this.mapArtworkInfo(i.artwork));
    const totalAmount = artworks.reduce((sum, a) => sum + (a.price || 0), 0);

    const newOrder: Order = {
      orderId: this.generateOrderId(now),
      userId,
      clientId,
      orderDate: now.toISOString(),
      totalAmount,
      paymentMethod: 'Cart Fake Payment',
      paymentStatus,
      orderStatus: 'Processing',
      deliveryInfo: { ...delivery },
      artworks
    };

    const existing = this.getAllOrders();
    this.save([...existing, newOrder]);

    return newOrder;
  }

  getStatsFromOrders(): { totalOrders: number; totalRevenue: number; soldArtworks: number } {
    const orders = this.getAllOrders().filter(o => o.paymentStatus === 'Paid');
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const soldArtworks = orders.reduce((sum, o) => sum + (o.artworks?.length || 0), 0);
    return { totalOrders, totalRevenue, soldArtworks };
  }

  private mapArtworkInfo(artwork: Artwork): OrderArtworkInfo {
    const id = (artwork as any).id || (artwork as any)._id || '';
    const artistName =
      typeof artwork.artist === 'string'
        ? artwork.artist
        : artwork.artist?.name || 'Unknown Artist';

    return {
      artworkId: id,
      artworkTitle: artwork.title,
      artistName,
      price: artwork.price || 0,
      artworkImage: artwork.imageUrl
    };
  }

  private generateOrderId(date: Date): string {
    const ts = date.getTime().toString(36).toUpperCase();
    const rand = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${ts}-${rand}`;
  }

  private migrateOrder(o: any): Order | null {
    if (!o || !o.orderId) {
      return null;
    }

    // New shape already
    if (Array.isArray(o.artworks) && o.deliveryInfo) {
      return {
        ...o,
        clientId: o.clientId || this.getOrCreateClientId(),
        paymentMethod: o.paymentMethod || 'Cart Fake Payment'
      } as Order;
    }

    // Old shape: { delivery, artwork, totalPrice }
    if (o.delivery && o.artwork) {
      const artworks: OrderArtworkInfo[] = [
        {
          artworkId: o.artwork.artworkId,
          artworkTitle: o.artwork.title,
          artistName: o.artwork.artistName,
          price: o.artwork.price,
          artworkImage: o.artwork.imageUrl
        }
      ];

      return {
        orderId: o.orderId,
        userId: o.userId && o.userId !== 'guest' ? o.userId : undefined,
        clientId: o.clientId || this.getOrCreateClientId(),
        orderDate: o.orderDate,
        totalAmount: o.totalPrice ?? o.totalAmount ?? artworks[0].price ?? 0,
        paymentMethod: 'Cart Fake Payment',
        paymentStatus: o.paymentStatus || 'Paid',
        orderStatus: o.orderStatus || 'Processing',
        deliveryInfo: o.delivery,
        artworks
      };
    }

    return null;
  }
}

