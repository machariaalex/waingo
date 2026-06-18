export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl: string | null;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  email: string | null;
  type: 'pickup' | 'delivery';
  address: string | null;
  status: 'pending' | 'paid' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  mpesaRef: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Booking {
  id: number;
  name: string;
  phone: string;
  type: 'vet' | 'tour' | 'bulk';
  date: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export type Category = 'animal-health' | 'feeds' | 'seeds' | 'tools';

export const CATEGORY_LABELS: Record<Category, string> = {
  'animal-health': 'Animal Health',
  'feeds': 'Feeds & Supplements',
  'seeds': 'Seeds & Seedlings',
  'tools': 'Tools & Fencing',
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  'animal-health': { bg: 'bg-soil-red', text: 'text-manila', border: 'border-soil-red' },
  'feeds': { bg: 'bg-maize-gold', text: 'text-charcoal-ink', border: 'border-maize-gold' },
  'seeds': { bg: 'bg-sukuma-green', text: 'text-manila', border: 'border-sukuma-green' },
  'tools': { bg: 'bg-charcoal-ink', text: 'text-manila', border: 'border-charcoal-ink' },
};
