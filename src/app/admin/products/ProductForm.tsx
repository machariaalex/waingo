'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface Props {
  product?: Product;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    category: product?.category ?? 'animal-health',
    price: product?.price ?? '',
    stock: product?.stock ?? 0,
    minStock: product?.minStock ?? 5,
    unit: product?.unit ?? 'piece',
    featured: product?.featured ?? false,
    active: product?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); return; }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-body text-sm focus:outline-none focus:border-soil-red"
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-light-manila border border-charcoal-ink/10 rounded-sm p-6 space-y-4">
      {field('Product Name *', 'name', 'text', 'e.g. Terramycin Spray 150ml')}

      <div>
        <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Slug (URL) *</label>
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          onBlur={() => !form.slug && setForm({ ...form, slug: toSlug(form.name) })}
          className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-soil-red"
          placeholder="auto-generated from name"
        />
        <button type="button" onClick={() => setForm({ ...form, slug: toSlug(form.name) })} className="font-mono text-[10px] text-soil-red mt-1 hover:underline">Generate from name</button>
      </div>

      <div>
        <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-body text-sm focus:outline-none focus:border-soil-red resize-none"
          placeholder="What is this product? Who is it for?"
        />
      </div>

      <div>
        <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-body text-sm focus:outline-none focus:border-soil-red"
        >
          <option value="animal-health">Animal Health</option>
          <option value="feeds">Feeds & Supplements</option>
          <option value="seeds">Seeds & Seedlings</option>
          <option value="tools">Tools & Fencing</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Price (KES) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={String(form.price)}
            onChange={(e) => setForm({ ...form, price: e.target.value as unknown as number })}
            className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-soil-red"
          />
        </div>
        <div>
          <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Unit</label>
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-body text-sm focus:outline-none focus:border-soil-red"
            placeholder="piece, bag, vial, packet..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Current Stock</label>
          <input
            type="number"
            min="0"
            value={String(form.stock)}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-soil-red"
          />
        </div>
        <div>
          <label className="font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider block mb-1">Low Stock Alert Below</label>
          <input
            type="number"
            min="0"
            value={String(form.minStock)}
            onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
            className="w-full bg-manila border border-charcoal-ink/20 rounded-sm px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-soil-red"
          />
        </div>
      </div>

      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-soil-red" />
          <span className="font-body text-sm text-charcoal-ink">Featured on homepage</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-soil-red" />
          <span className="font-body text-sm text-charcoal-ink">Active (visible in shop)</span>
        </label>
      </div>

      {error && <p className="text-soil-red font-mono text-xs">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-soil-red text-manila font-heading font-bold py-3 rounded-sm hover:bg-dark-soil transition-colors disabled:opacity-60">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-5 py-3 border border-charcoal-ink/20 rounded-sm font-heading font-semibold text-sm text-charcoal-ink hover:bg-charcoal-ink/5 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
