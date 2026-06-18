'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types';
import { CATEGORY_LABELS, type Category } from '@/types';

interface Props {
  products: Product[];
}

export default function ProductAdminTable({ products: initial }: Props) {
  const [products, setProducts] = useState(initial);
  const [filter, setFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = products.filter((p) => {
    const matchCat = catFilter === 'all' || p.category === catFilter;
    const matchQ = !filter || p.name.toLowerCase().includes(filter.toLowerCase());
    return matchCat && matchQ;
  });

  async function quickUpdateStock(id: number, stock: number) {
    await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stock }) });
    setProducts((ps) => ps.map((p) => p.id === id ? { ...p, stock } : p));
  }

  async function toggleActive(id: number, active: boolean) {
    await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) });
    setProducts((ps) => ps.map((p) => p.id === id ? { ...p, active } : p));
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search products..."
          className="bg-light-manila border border-charcoal-ink/20 rounded-sm px-3 py-2 font-body text-sm focus:outline-none focus:border-soil-red"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="bg-light-manila border border-charcoal-ink/20 rounded-sm px-3 py-2 font-body text-sm focus:outline-none focus:border-soil-red"
        >
          <option value="all">All Categories</option>
          <option value="animal-health">Animal Health</option>
          <option value="feeds">Feeds & Supplements</option>
          <option value="seeds">Seeds & Seedlings</option>
          <option value="tools">Tools & Fencing</option>
        </select>
        <span className="font-mono text-xs text-charcoal-ink/40 self-center">{filtered.length} items</span>
      </div>

      <div className="bg-light-manila border border-charcoal-ink/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-ink/10 bg-dark-manila">
                <th className="px-4 py-3 text-left font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-right font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-center font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-center font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.stock <= p.minStock;
                const out = p.stock === 0;
                return (
                  <tr key={p.id} className={`border-b border-charcoal-ink/5 hover:bg-dark-manila/50 transition-colors ${!p.active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-body text-sm font-medium text-charcoal-ink">{p.name}</div>
                      <div className="font-mono text-[10px] text-charcoal-ink/30">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-xs text-charcoal-ink/60">{CATEGORY_LABELS[p.category as Category] ?? p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-sm text-soil-red">
                      {p.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => quickUpdateStock(p.id, Math.max(0, p.stock - 1))} className="w-6 h-6 rounded bg-charcoal-ink/10 hover:bg-charcoal-ink/20 font-mono text-xs">−</button>
                        <span className={`font-mono font-bold text-sm w-8 text-center ${out ? 'text-soil-red' : low ? 'text-maize-gold' : 'text-sukuma-green'}`}>{p.stock}</span>
                        <button onClick={() => quickUpdateStock(p.id, p.stock + 1)} className="w-6 h-6 rounded bg-charcoal-ink/10 hover:bg-charcoal-ink/20 font-mono text-xs">+</button>
                      </div>
                      <div className="font-mono text-[10px] text-charcoal-ink/30 text-center">min {p.minStock}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(p.id, !p.active)}
                        className={`font-mono text-[10px] uppercase px-2 py-1 rounded-sm ${p.active ? 'bg-sukuma-green/10 text-sukuma-green' : 'bg-charcoal-ink/10 text-charcoal-ink/40'}`}
                      >
                        {p.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/products/${p.id}`} className="font-mono text-xs text-soil-red hover:underline">Edit</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
