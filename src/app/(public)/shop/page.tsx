import { prisma } from '@/lib/db';
import ProductCard from '@/components/shop/ProductCard';
import Link from 'next/link';
import type { Product } from '@/types';

export const revalidate = 30;

interface Props {
  searchParams: { category?: string; q?: string };
}

async function getProducts(category?: string, q?: string): Promise<Product[]> {
  const where: Record<string, unknown> = { active: true };
  if (category && category !== 'all') where.category = category;
  if (q) where.name = { contains: q };
  const products = await prisma.product.findMany({ where, orderBy: { name: 'asc' } });
  return products as unknown as Product[];
}

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'animal-health', label: 'Animal Health' },
  { value: 'feeds', label: 'Feeds & Supplements' },
  { value: 'seeds', label: 'Seeds & Seedlings' },
  { value: 'tools', label: 'Tools & Equipment' },
];

export default async function ShopPage({ searchParams }: Props) {
  const { category = 'all', q } = searchParams;
  const products = await getProducts(category === 'all' ? undefined : category, q);
  const activeLabel = CATEGORIES.find((c) => c.value === category)?.label ?? 'All Products';

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-parchment border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <nav className="font-sans text-sm text-ink-light mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Shop</span>
            {category !== 'all' && (
              <>
                <span>/</span>
                <span className="text-ink">{activeLabel}</span>
              </>
            )}
          </nav>
          <h1 className="font-serif font-bold text-3xl text-ink">{activeLabel}</h1>
          {q && (
            <p className="font-sans text-sm text-ink-light mt-1">Showing results for &ldquo;{q}&rdquo;</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            {/* Search */}
            <form method="GET" className="mb-6">
              <div className="relative">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search products…"
                  className="w-full bg-parchment border border-rule rounded px-3 py-2.5 pl-9 font-sans text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-forest"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {category !== 'all' && <input type="hidden" name="category" value={category} />}
              <button type="submit" className="sr-only">Search</button>
            </form>

            {/* Category filter */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-ink-light uppercase tracking-wider mb-2.5">Categories</h3>
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={cat.value === 'all' ? '/shop' : `/shop?category=${cat.value}`}
                    className={`flex items-center justify-between px-3 py-2 rounded font-sans text-sm transition-colors ${
                      category === cat.value
                        ? 'bg-forest text-white font-medium'
                        : 'text-ink-mid hover:bg-parchment hover:text-forest'
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Help CTA */}
            <div className="mt-8 bg-parchment rounded-lg p-4 border border-rule">
              <p className="font-sans font-semibold text-sm text-ink mb-1">Need advice?</p>
              <p className="font-sans text-xs text-ink-light mb-3 leading-relaxed">Talk to Wilson directly about what products work for your farm.</p>
              <a href="https://wa.me/254704659267" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-forest font-sans font-semibold text-xs hover:text-forest-mid transition-colors">
                WhatsApp Wilson →
              </a>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="font-sans text-sm text-ink-light">
                <span className="font-semibold text-ink">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
                {q && <> for &ldquo;{q}&rdquo;</>}
              </p>
              {q && (
                <Link href={`/shop${category !== 'all' ? `?category=${category}` : ''}`} className="font-sans text-sm text-bark hover:underline">
                  Clear search
                </Link>
              )}
            </div>

            {products.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-sans text-ink-light text-base mb-2">No products found.</p>
                <Link href="/shop" className="font-sans text-sm text-forest hover:underline">View all products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
