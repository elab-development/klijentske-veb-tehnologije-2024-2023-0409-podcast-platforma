import type { PodcastVideo } from '../types/youtube';

export type FavoriteItem = PodcastVideo & {
  savedAt: string;
};

type Listener = () => void;

export class FavoritesStore {
  private key: string;
  private cache: Map<string, FavoriteItem>;
  private listeners = new Set<Listener>();

  constructor(key = 'podwave_favorites_v1') {
    this.key = key;
    this.cache = new Map();
    this.load();

    // sync sa drugim tabovima
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.key) {
          this.load(); // reload iz localStorage
          this.emit();
        }
      });
    }
  }

  /** Učitaj iz localStorage u memorijski cache */
  private load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) {
        this.cache.clear();
        return;
      }
      const arr = JSON.parse(raw) as FavoriteItem[];
      this.cache = new Map(arr.map((it) => [it.id, it]));
    } catch {
      this.cache.clear();
      localStorage.removeItem(this.key);
    }
  }

  /** Upis iz memorije u localStorage */
  private persist() {
    const arr = Array.from(this.cache.values());
    localStorage.setItem(this.key, JSON.stringify(arr));
  }

  /** Obavesti sve pretplaćene listenere */
  private emit() {
    for (const fn of this.listeners) fn();
  }

  /** Pretplata na promene */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Dodaj (čuva kompletne podatke) */
  add(video: PodcastVideo): FavoriteItem {
    const item: FavoriteItem = {
      ...video,
      savedAt: new Date().toISOString(),
    };
    this.cache.set(item.id, item);
    this.persist();
    this.emit();
    return item;
  }

  /** Ukloni po video ID-u */
  remove(videoId: string) {
    if (this.cache.delete(videoId)) {
      this.persist();
      this.emit();
    }
  }

  /** Toggle — vrati true ako je posle poziva u listi, false ako je uklonjen */
  toggle(video: PodcastVideo): boolean {
    if (this.cache.has(video.id)) {
      this.cache.delete(video.id);
      this.persist();
      this.emit();
      return false;
    } else {
      this.add(video);
      return true;
    }
  }

  /** Da li je video u favorites? */
  has(videoId: string): boolean {
    return this.cache.has(videoId);
  }

  /** Lista svih favorita */
  list(): FavoriteItem[] {
    return Array.from(this.cache.values()).sort(
      (a, b) => +new Date(b.savedAt) - +new Date(a.savedAt)
    );
  }

  /** Očisti sve */
  clear() {
    this.cache.clear();
    this.persist();
    this.emit();
  }

  /** Broj favorita */
  count(): number {
    return this.cache.size;
  }
}

export const favorites = new FavoritesStore();