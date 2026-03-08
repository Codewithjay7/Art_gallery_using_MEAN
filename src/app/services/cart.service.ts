import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artwork } from './artwork.service';

export interface CartItem {
  id: string;
  artwork: Artwork;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'artGallery_cart';
  private purchasedKey = 'artGallery_purchased';

  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$ = this.itemsSubject.asObservable();

  private loadFromStorage(): CartItem[] {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(items: CartItem[]) {
    this.itemsSubject.next(items);
    sessionStorage.setItem(this.storageKey, JSON.stringify(items));
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
    const id = this.getId(artwork);
    if (!id || this.isInCart(artwork)) return;
    const items = [...this.items, { id, artwork }];
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
      sessionStorage.setItem(this.purchasedKey, JSON.stringify(updated));
    }
    this.clear();
  }

  getPurchasedIds(): string[] {
    try {
      const raw = sessionStorage.getItem(this.purchasedKey);
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

