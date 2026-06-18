'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import type { Product } from '@/types';

const CAT_LABEL: Record<string, string> = {
  'animal-health': 'Animal Health',
  'feeds': 'Feeds & Supplements',
  'seeds': 'Seeds & Seedlings',
  'tools': 'Tools & Equipment',
};

const CAT_IMG: Record<string, string> = {
  'animal-health': 'img-placeholder-health',
  'feeds': 'img-placeholder-feeds',
  'seeds': 'img-placeholder-seeds',
  'tools': 'img-placeholder-tools',
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push('/shop'); return; }
        setProduct(data);
        setLoading(false);
      });
  }, [slug, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 text-center">
        <div className="font-sans text-sm text-ink-light">Loading…</div>
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= product.minStock;
  const inCart = items.find((i) => i.id === product.id);
  const imgClass = CAT_IMG[product.category] ?? 'img-placeholder-tools';

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      add({ id: product!.id, name: product!.name, price: product!.price, unit: product!.unit, slug: product!.slug });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-parchment border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <nav className="font-sans text-sm text-ink-light flex items-center gap-1.5">
            <Link href="/shop" className="hover:text-forest transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-forest transition-colors">
              {CAT_LABEL[product.category] ?? product.category}
            </Link>
            <span>/</span>
            <span className="text-ink line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Image panel */}
          <div className={`${product.imageUrl ? 'bg-parchment' : imgClass} rounded-lg h-72 md:h-auto md:min-h-80 flex items-center justify-center relative overflow-hidden`}>
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <>
                <div className="absolute inset-0 rounded-lg bg-black/10" />
                <div className="relative text-center">
                  <div className="font-serif font-bold text-white/20 text-7xl select-none">
                    {product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </div>
                  <div className="font-sans text-white/40 text-xs mt-2">
                    {CAT_LABEL[product.category] ?? product.category}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="inline-block font-sans text-xs font-semibold uppercase tracking-wider text-forest bg-forest/10 px-2.5 py-1 rounded w-fit mb-3">
              {CAT_LABEL[product.category] ?? product.category}
            </span>

            <h1 className="font-serif font-bold text-3xl text-ink leading-tight mb-4">{product.name}</h1>

            {product.description && (
              <p className="font-sans text-base text-ink-mid leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Stock indicator */}
            <div className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded mb-6 text-sm font-sans font-medium ${outOfStock ? 'bg-bark/8 text-bark' : lowStock ? 'bg-harvest/8 text-harvest' : 'bg-forest/8 text-forest'}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${outOfStock ? 'bg-bark' : lowStock ? 'bg-harvest' : 'bg-forest'}`} />
              {outOfStock ? 'Out of Stock' : lowStock ? `Low Stock — ${product.stock} ${product.unit}s remaining` : `In Stock — ${product.stock} available`}
            </div>

            {/* Price */}
            <div className="border border-rule rounded-lg p-5 mb-6">
              <div className="font-sans text-xs text-ink-light uppercase tracking-wider mb-1">Price</div>
              <div className="font-mono font-bold text-3xl text-ink">KES {product.price.toLocaleString()}</div>
              <div className="font-sans text-sm text-ink-light mt-0.5">per {product.unit}</div>
            </div>

            {/* Add to cart */}
            {!outOfStock && (
              <div className="flex gap-3 mb-4">
                <div className="flex items-center border border-rule rounded overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 flex items-center justify-center font-sans text-lg text-ink-mid hover:bg-parchment transition-colors">−</button>
                  <span className="w-12 text-center font-mono text-sm font-semibold text-ink border-x border-rule h-11 flex items-center justify-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-11 flex items-center justify-center font-sans text-lg text-ink-mid hover:bg-parchment transition-colors">+</button>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex-1 font-sans font-semibold py-2.5 px-6 rounded transition-colors text-base ${added ? 'bg-forest-light text-white' : 'bg-forest text-white hover:bg-forest-mid'}`}
                >
                  {added ? '✓ Added to Cart' : inCart ? `Add More (${inCart.quantity} in cart)` : 'Add to Cart'}
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/cart" className="flex-1 text-center border border-rule text-ink-mid font-sans font-medium py-2.5 px-6 rounded hover:bg-parchment transition-colors text-sm">
                View Cart
              </Link>
              <a
                href="https://wa.me/254704659267"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-parchment border border-rule text-ink-mid font-sans font-medium py-2.5 px-6 rounded hover:bg-parchment-dark transition-colors text-sm"
              >
                Ask Wilson
              </a>
            </div>

            <p className="font-sans text-xs text-ink-light mt-4 text-center">
              Or call <a href="tel:+254704659267" className="font-mono text-forest hover:underline">0704 659 267</a> to check availability or ask about bulk pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
