'use client';
import { useState } from 'react';
import type { Product } from '@/types';
import { CATEGORY_LABELS, type Category } from '@/types';

export default function StockManager({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [saving, setSaving] = useState<number | null>(null);
  const [showReorder, setShowReorder] = useState(false);

  const lowStock = products.filter((p) => p.stock <= p.minStock);

  async function updateStock(id: number, stock: number) {
    setSaving(id);
    await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stock }) });
    setProducts((ps) => ps.map((p) => p.id === id ? { ...p, stock } : p));
    setSaving(null);
  }

  async function updateMinStock(id: number, minStock: number) {
    await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ minStock }) });
    setProducts((ps) => ps.map((p) => p.id === id ? { ...p, minStock } : p));
  }

  function exportReorder() {
    const rows = [['Product', 'Category', 'Current Stock', 'Min Stock', 'Reorder Qty'], ...lowStock.map((p) => [
      p.name,
      CATEGORY_LABELS[p.category as Category] ?? p.category,
      p.stock,
      p.minStock,
      Math.max(0, p.minStock * 3 - p.stock),
    ])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `waingo-reorder-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  }

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowReorder(!showReorder)}
          className={`font-heading font-semibold text-sm px-4 py-2 rounded-sm border transition-colors ${showReorder ? 'bg-soil-red text-manila border-soil-red' : 'bg-light-manila border-charcoal-ink/20 text-charcoal-ink'}`}
        >
          {showReorder ? 'Show All' : `Show Low Stock (${lowStock.length})`}
        </button>
        {lowStock.length > 0 && (
          <button
            onClick={exportReorder}
            className="font-heading font-semibold text-sm px-4 py-2 rounded-sm border border-sukuma-green/30 bg-sukuma-green/5 text-sukuma-green hover:bg-sukuma-green/10 transition-colors"
          >
            Export Reorder List (CSV)
          </button>
        )}
      </div>

      {/* Stock table by category */}
      {Object.entries(grouped).map(([cat, catProducts]) => {
        const display = showReorder ? catProducts.filter((p) => p.stock <= p.minStock) : catProducts;
        if (display.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h2 className="font-heading font-bold text-sm text-charcoal-ink/60 uppercase tracking-wider mb-2">
              {CATEGORY_LABELS[cat as Category] ?? cat}
            </h2>
            <div className="bg-light-manila border border-charcoal-ink/10 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-charcoal-ink/10 bg-dark-manila">
                    <th className="px-4 py-2.5 text-left font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2.5 text-center font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-2.5 text-center font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Min</th>
                    <th className="px-4 py-2.5 text-center font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-center font-mono text-xs text-charcoal-ink/50 uppercase tracking-wider hidden md:table-cell">Reorder Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {display.map((p) => {
                    const low = p.stock <= p.minStock;
                    const out = p.stock === 0;
                    return (
                      <tr key={p.id} className="border-b border-charcoal-ink/5 hover:bg-dark-manila/30">
                        <td className="px-4 py-3 font-body text-sm text-charcoal-ink">{p.name}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))} className="w-7 h-7 rounded bg-charcoal-ink/10 hover:bg-charcoal-ink/20 font-mono text-sm">−</button>
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => setProducts((ps) => ps.map((x) => x.id === p.id ? { ...x, stock: Number(e.target.value) } : x))}
                              onBlur={(e) => updateStock(p.id, Number(e.target.value))}
                              className={`w-14 text-center font-mono font-bold text-sm bg-manila border rounded-sm px-1 py-1 focus:outline-none focus:border-soil-red ${out ? 'text-soil-red border-soil-red/30' : low ? 'text-maize-gold border-maize-gold/30' : 'text-sukuma-green border-charcoal-ink/20'}`}
                            />
                            <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-7 h-7 rounded bg-charcoal-ink/10 hover:bg-charcoal-ink/20 font-mono text-sm">+</button>
                          </div>
                          {saving === p.id && <div className="font-mono text-[10px] text-charcoal-ink/30 text-center mt-0.5">saving...</div>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={p.minStock}
                            onChange={(e) => setProducts((ps) => ps.map((x) => x.id === p.id ? { ...x, minStock: Number(e.target.value) } : x))}
                            onBlur={(e) => updateMinStock(p.id, Number(e.target.value))}
                            className="w-14 text-center font-mono text-xs bg-manila border border-charcoal-ink/20 rounded-sm px-1 py-1 focus:outline-none focus:border-soil-red"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-sm ${out ? 'bg-soil-red/10 text-soil-red' : low ? 'bg-maize-gold/10 text-maize-gold' : 'bg-sukuma-green/10 text-sukuma-green'}`}>
                            {out ? 'Out' : low ? 'Low' : 'OK'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-xs text-charcoal-ink/40 hidden md:table-cell">
                          {low ? `+${Math.max(0, p.minStock * 3 - p.stock)} units` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
