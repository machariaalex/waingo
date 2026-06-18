'use client';
import { useState } from 'react';
import type { Order } from '@/types';

const STATUSES = ['pending', 'paid', 'processing', 'ready', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-maize-gold/10 text-maize-gold border-maize-gold/30',
  paid: 'bg-sukuma-green/10 text-sukuma-green border-sukuma-green/30',
  processing: 'bg-sukuma-green/10 text-sukuma-green border-sukuma-green/30',
  ready: 'bg-sukuma-green/10 text-sukuma-green border-sukuma-green/30',
  delivered: 'bg-charcoal-ink/5 text-charcoal-ink/40 border-charcoal-ink/10',
  cancelled: 'bg-soil-red/10 text-soil-red border-soil-red/20',
};

interface Props { orders: Order[] }

export default function OrdersTable({ orders: initial }: Props) {
  const [orders, setOrders] = useState(initial);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setOrders((os) => os.map((o) => o.id === id ? { ...o, status: status as Order['status'] } : o));
  }

  return (
    <div>
      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-mono text-xs px-3 py-1 rounded-sm uppercase tracking-wider border transition-colors ${filter === s ? 'bg-charcoal-ink text-manila border-charcoal-ink' : 'bg-light-manila border-charcoal-ink/20 text-charcoal-ink/60 hover:border-charcoal-ink/40'}`}
          >
            {s} {s !== 'all' && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <p className="font-body text-sm text-charcoal-ink/40 py-8 text-center">No orders.</p>}
        {filtered.map((order) => (
          <div key={order.id} className="bg-light-manila border border-charcoal-ink/10 rounded-sm overflow-hidden">
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-4 px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <span className="font-mono font-bold text-sm text-charcoal-ink/40">#{order.id}</span>
              <div className="flex-1">
                <div className="font-body font-semibold text-sm text-charcoal-ink">{order.customerName}</div>
                <div className="font-mono text-xs text-charcoal-ink/40">{order.phone} · {order.type} · {new Date(order.createdAt).toLocaleDateString('en-KE')}</div>
              </div>
              <div className="font-mono font-bold text-sm text-soil-red">KES {order.total.toLocaleString()}</div>
              <select
                value={order.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className={`font-mono text-xs px-2 py-1 rounded-sm border uppercase ${STATUS_COLORS[order.status]} bg-transparent cursor-pointer`}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-charcoal-ink/30 font-mono text-sm">{expanded === order.id ? '▲' : '▼'}</span>
            </div>

            {/* Expanded details */}
            {expanded === order.id && (
              <div className="border-t border-charcoal-ink/10 px-4 py-4 bg-dark-manila/30">
                <div className="grid md:grid-cols-2 gap-4 mb-4 text-xs font-mono text-charcoal-ink/60">
                  {order.email && <span>Email: {order.email}</span>}
                  {order.address && <span>Address: {order.address}</span>}
                  {order.mpesaRef && <span>M-Pesa Ref: <strong className="text-sukuma-green">{order.mpesaRef}</strong></span>}
                </div>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="ledger-row text-sm">
                      <span className="font-body text-charcoal-ink">{item.product.name} × {item.quantity}</span>
                      <span className="font-mono text-charcoal-ink/70">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://wa.me/${order.phone.replace(/^0/, '254').replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-sukuma-green hover:underline"
                >
                  WhatsApp {order.customerName} →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
