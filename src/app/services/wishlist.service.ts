import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artwork } from './artwork.service';

export interface WishlistItem {
  id: string;
  artwork: Artwork;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private storageKey = 'artGallery_wishlist';
  private itemsSubject = new BehaviorSubject<WishlistItem[]>(this.loadFromStorage());
  items$ = this.itemsSubject.asObservable();

  private loadFromStorage(): WishlistItem[] {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(items: WishlistItem[]) {
    this.itemsSubject.next(items);
    sessionStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  get items(): WishlistItem[] {
    return this.itemsSubject.value;
  }

  private getId(artwork: Artwork): string {
    return (artwork as any).id || (artwork as any)._id || '';
  }

  isInWishlist(artwork: Artwork): boolean {
    const id = this.getId(artwork);
    return !!id && this.items.some(i => i.id === id);
  }

  add(artwork: Artwork) {
    const id = this.getId(artwork);
    if (!id || this.isInWishlist(artwork)) return;
    const items = [...this.items, { id, artwork }];
    this.save(items);
  }

  remove(id: string) {
    this.save(this.items.filter(i => i.id !== id));
  }

  clear() {
    this.save([]);
  }
}

