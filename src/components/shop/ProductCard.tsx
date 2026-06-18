'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import type { Product } from '@/types';
import type { Category } from '@/types';

interface Props {
  product: Product;
  variant?: 'default' | 'featured';
}

const CAT_LABEL: Record<string, string> = {
  'animal-health': 'Animal Health',
  'feeds': 'Feeds & Supplements',
  'seeds': 'Seeds & Seedlings',
  'tools': 'Tools & Equipment',
};

const CAT_IMG_CLASS: Record<string, string> = {
  'animal-health': 'img-placeholder-health',
  'feeds': 'img-placeholder-feeds',
  'seeds': 'img-placeholder-seeds',
  'tools': 'img-placeholder-tools',
};

const CAT_BADGE: Record<string, string> = {
  'animal-health': 'bg-bark/10 text-bark',
  'feeds': 'bg-harvest/10 text-harvest',
  'seeds': 'bg-forest/10 text-forest',
  'tools': 'bg-stone/10 text-stone',
};

function StarRating({ rating = 4.7 }: { rating?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < full ? 'text-harvest' : i === full && half ? 'text-harvest' : 'text-rule'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="font-mono text-[10px] text-ink-light ml-1">{rating}</span>
    </div>
  );
}

export default function ProductCard({ product, variant = 'default' }: Props) {
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const inCart = items.find((i) => i.id === product.id);

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= product.minStock;
  const imgClass = CAT_IMG_CLASS[product.category] ?? 'img-placeholder-tools';
  const badgeClass = CAT_BADGE[product.category] ?? 'bg-stone/10 text-stone';

  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group">
        {/* Image */}
        <Link href={`/shop/${product.slug}`} className="block relative">
          <div className={`${product.imageUrl ? '' : imgClass} h-56 relative flex items-center justify-center overflow-hidden`}>
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 400px" />
            ) : (
              <ProductImagePlaceholder name={product.name} category={product.category} size="lg" />
            )}
            {product.featured && (
              <span className="absolute top-3 left-3 bg-white text-forest font-sans font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded z-10">
                Best Seller
              </span>
            )}
            {outOfStock && (
              <span className="absolute top-3 right-3 bg-bark/90 text-white font-sans font-medium text-xs px-2.5 py-1 rounded z-10">
                Out of Stock
              </span>
            )}
          </div>
        </Link>

        <div className="p-5">
          <span className={`inline-block text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${badgeClass} mb-3`}>
            {CAT_LABEL[product.category] ?? product.category}
          </span>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-serif font-semibold text-lg text-ink group-hover:text-forest transition-colors leading-snug mb-1.5 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="font-sans text-sm text-ink-light leading-relaxed line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
          <StarRating />
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <div className="font-mono font-semibold text-xl text-ink">
                KES {product.price.toLocaleString()}
              </div>
              <div className="font-sans text-xs text-ink-light mt-0.5">per {product.unit}</div>
            </div>
            <StockBadge stock={product.stock} low={lowStock} out={outOfStock} />
          </div>
          <button
            disabled={outOfStock}
            onClick={() => add({ id: product.id, name: product.name, price: product.price, unit: product.unit, slug: product.slug })}
            className={`mt-4 w-full py-2.5 px-4 rounded font-sans font-semibold text-sm transition-colors ${
              outOfStock
                ? 'bg-parchment text-ink-light cursor-not-allowed'
                : inCart
                ? 'bg-forest text-white hover:bg-forest-mid'
                : 'bg-forest text-white hover:bg-forest-mid'
            }`}
          >
            {outOfStock ? 'Out of Stock' : inCart ? `In Cart · ${inCart.quantity} added` : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-rule hover:border-sage hover:shadow-card transition-all group">
      <Link href={`/shop/${product.slug}`} className="block relative">
        <div className={`${product.imageUrl ? '' : imgClass} h-40 relative flex items-center justify-center overflow-hidden`}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 300px" />
          ) : (
            <ProductImagePlaceholder name={product.name} category={product.category} size="sm" />
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <span className="font-sans text-xs font-semibold text-ink bg-white px-3 py-1 rounded shadow-sm">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <span className={`inline-block text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${badgeClass} mb-2`}>
          {CAT_LABEL[product.category] ?? product.category}
        </span>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-sans font-semibold text-sm text-ink group-hover:text-forest transition-colors leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <StarRating />
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <div className="font-mono font-semibold text-base text-ink">KES {product.price.toLocaleString()}</div>
            {lowStock && !outOfStock && (
              <div className="font-sans text-[10px] text-harvest font-medium">Only {product.stock} left</div>
            )}
          </div>
          <button
            disabled={outOfStock}
            onClick={() => add({ id: product.id, name: product.name, price: product.price, unit: product.unit, slug: product.slug })}
            className={`w-9 h-9 flex items-center justify-center rounded transition-colors flex-shrink-0 ${
              outOfStock
                ? 'bg-parchment text-ink-light cursor-not-allowed'
                : inCart
                ? 'bg-forest text-white'
                : 'bg-forest/10 text-forest hover:bg-forest hover:text-white'
            }`}
            aria-label={outOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {inCart ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock, low, out }: { stock: number; low: boolean; out: boolean }) {
  if (out) return <span className="font-sans text-xs text-bark font-medium">Out of Stock</span>;
  if (low) return <span className="font-sans text-xs text-harvest font-medium">{stock} left</span>;
  return <span className="font-sans text-xs text-forest-light font-medium">In Stock</span>;
}

function ProductImagePlaceholder({ name, category, size }: { name: string; category: string; size: 'sm' | 'lg' }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${size === 'lg' ? 'gap-2' : ''}`}>
      <span className={`font-serif font-bold text-white/30 select-none ${size === 'lg' ? 'text-5xl' : 'text-3xl'}`}>{initials}</span>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
