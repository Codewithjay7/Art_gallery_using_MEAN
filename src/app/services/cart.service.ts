import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artwork } from './artwork.service';
import { AuthService } from './auth.service';

export interface CartItem {
  id: string;
  userId: string;
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  price: number;
  image?: string;
  artwork: Artwork;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'artGallery_cart_v2';
  private purchasedKey = 'artGallery_purchased';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.refreshForCurrentUser();
    this.authService.currentUser$.subscribe(() => {
      this.refreshForCurrentUser();
    });
  }

  private loadAllFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveAll(items: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private refreshForCurrentUser() {
    const all = this.loadAllFromStorage();
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.itemsSubject.next([]);
      return;
    }
    const userItems = all.filter(i => i.userId === user.id);
    this.itemsSubject.next(userItems);
  }

  private save(items: CartItem[]) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.itemsSubject.next([]);
      return;
    }

    const all = this.loadAllFromStorage().filter(i => i.userId !== user.id);
    const updatedForUser = items.map(i => ({ ...i, userId: user.id }));
    const merged = [...all, ...updatedForUser];

    this.itemsSubject.next(updatedForUser);
    this.saveAll(merged);
  }

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  private getId(artwork: Artwork): string {
    return (artwork as any).id || (artwork as any)._id || '';
  }

  isInCart(artwork: Artwork): boolean {
    const id = this.getId(artwork);
    return !!id && this.items.some(i => i.id === id);
  }

  add(artwork: Artwork) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    const id = this.getId(artwork);
    if (!id || this.isInCart(artwork)) return;
    const artistName =
      typeof artwork.artist === 'string'
        ? artwork.artist
        : (artwork.artist as any)?.name || 'Unknown Artist';

    const item: CartItem = {
      id,
      userId: user.id,
      artworkId: id,
      artworkTitle: artwork.title,
      artistName,
      price: artwork.price || 0,
      image: artwork.imageUrl,
      artwork
    };

    const items = [...this.items, item];
    this.save(items);
  }

  remove(id: string) {
    this.save(this.items.filter(i => i.id !== id));
  }

  clear() {
    this.save([]);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.artwork.price || 0), 0);
  }

  markPurchased() {
    const purchased = this.getPurchasedIds();
    const newIds = this.items.map(i => i.id).filter(id => !!id && !purchased.includes(id));
    if (newIds.length) {
      const updated = [...purchased, ...newIds];
      localStorage.setItem(this.purchasedKey, JSON.stringify(updated));
    }
    this.clear();
  }

  getPurchasedIds(): string[] {
    try {
      const raw = localStorage.getItem(this.purchasedKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  isPurchased(artwork: Artwork): boolean {
    const id = this.getId(artwork);
    if (!id) return false;
    return this.getPurchasedIds().includes(id);
  }
}

