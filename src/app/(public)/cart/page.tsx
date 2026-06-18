'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const INPUT_CLASS = 'w-full bg-white border border-rule rounded px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-forest transition-colors';

export default function CartPage() {
  const { items, remove, update, clear, total } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'pickup' as 'pickup' | 'delivery', address: '' });
  const [step, setStep] = useState<'cart' | 'checkout' | 'pay' | 'done'>('cart');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cartTotal = total();

  async function placeOrder() {
    setError('');
    if (!form.name.trim() || !form.phone.trim()) { setError('Name and phone number are required.'); return; }
    if (form.type === 'delivery' && !form.address.trim()) { setError('Please provide a delivery address.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price })), total: cartTotal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to place order'); return; }
      setOrderId(data.id);
      setStep('pay');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function payMpesa() {
    if (!orderId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, amount: cartTotal, orderId }),
      });
      const data = await res.json();
      if (!res.ok || data.ResponseCode !== '0') {
        setError(data.CustomerMessage ?? data.errorMessage ?? 'M-Pesa request failed. Pay on pickup or call Wilson.');
        return;
      }
      clear();
      setStep('done');
    } catch {
      setError('Could not reach M-Pesa. Please try again or call Wilson.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl text-ink mb-2">Order Confirmed</h1>
          <p className="font-sans text-ink-mid mb-1">Order #{orderId} — M-Pesa payment request sent to {form.phone}.</p>
          <p className="font-sans text-sm text-ink-light mb-8">Accept the M-Pesa prompt on your phone. Wilson will confirm once payment is received.</p>
          <a href="https://wa.me/254704659267" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-forest hover:underline block mb-4">
            Questions? WhatsApp Wilson →
          </a>
          <Link href="/shop" className="font-sans text-sm text-ink-light hover:text-ink transition-colors">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-16 h-16 bg-rule rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl text-ink mb-2">Your cart is empty</h1>
          <p className="font-sans text-sm text-ink-light mb-6">Add products from the shop to get started.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white font-sans font-semibold px-6 py-3 rounded hover:bg-forest-mid transition-colors text-sm">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-parchment border-b border-rule">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          <h1 className="font-serif font-bold text-3xl text-ink">
            {step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Checkout' : 'Payment'}
          </h1>
          <div className="flex items-center gap-3 mt-2 font-sans text-xs text-ink-light">
            {['cart', 'checkout', 'pay'].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                {i > 0 && <span className="text-rule">›</span>}
                <span className={step === s ? 'text-forest font-semibold' : ''}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Main column */}
          <div className="md:col-span-2 space-y-4">
            {/* Cart items */}
            <div className="bg-parchment rounded-lg divide-y divide-rule overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.slug}`} className="font-sans font-semibold text-sm text-ink hover:text-forest transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="font-mono text-xs text-ink-light mt-0.5">KES {item.price.toLocaleString()} / {item.unit}</div>
                  </div>
                  <div className="flex items-center border border-rule rounded bg-white">
                    <button onClick={() => update(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center font-sans text-base text-ink-mid hover:bg-parchment transition-colors rounded-l">−</button>
                    <span className="w-10 text-center font-mono text-sm font-semibold text-ink border-x border-rule h-8 flex items-center justify-center">{item.quantity}</span>
                    <button onClick={() => update(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center font-sans text-base text-ink-mid hover:bg-parchment transition-colors rounded-r">+</button>
                  </div>
                  <div className="font-mono font-semibold text-sm text-ink w-20 text-right">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button onClick={() => remove(item.id)} className="text-ink-light hover:text-bark transition-colors p-1" aria-label="Remove">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout form */}
            {(step === 'checkout' || step === 'pay') && (
              <div className="bg-parchment rounded-lg p-6 space-y-4">
                <h2 className="font-sans font-semibold text-base text-ink">Your Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Full name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT_CLASS} placeholder="e.g. Peter Mwangi" required />
                  </div>
                  <div>
                    <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Phone (M-Pesa)</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${INPUT_CLASS} font-mono`} placeholder="07XX XXX XXX" required />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Email <span className="text-ink-light font-normal">(optional)</span></label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={INPUT_CLASS} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Order type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['pickup', 'delivery'] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} className={`py-2.5 rounded font-sans font-semibold text-sm border transition-colors ${form.type === t ? 'bg-forest text-white border-forest' : 'bg-white border-rule text-ink-mid hover:border-stone-light'}`}>
                        {t === 'pickup' ? 'Pick Up in Sabaki' : 'Local Delivery'}
                      </button>
                    ))}
                  </div>
                </div>
                {form.type === 'delivery' && (
                  <div>
                    <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Delivery address</label>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className={`${INPUT_CLASS} resize-none`} placeholder="Area, road, landmark near you…" />
                  </div>
                )}
              </div>
            )}

            {/* M-Pesa */}
            {step === 'pay' && orderId && (
              <div className="bg-parchment rounded-lg p-6">
                <h2 className="font-sans font-semibold text-base text-ink mb-1">Pay via M-Pesa</h2>
                <p className="font-sans text-sm text-ink-light mb-4 leading-relaxed">
                  We will send a payment prompt to <span className="font-mono font-semibold text-ink">{form.phone}</span>. Check your phone and enter your M-Pesa PIN to confirm.
                </p>
                {error && <div className="bg-bark/5 border border-bark/20 rounded px-3 py-2 font-sans text-sm text-bark mb-4">{error}</div>}
                <div className="flex gap-3">
                  <button onClick={payMpesa} disabled={loading} className="flex-1 bg-forest text-white font-sans font-semibold py-3 rounded hover:bg-forest-mid transition-colors disabled:opacity-60">
                    {loading ? 'Sending request…' : `Pay KES ${cartTotal.toLocaleString()} via M-Pesa`}
                  </button>
                  <a href="tel:+254704659267" className="px-4 py-3 border border-rule rounded font-sans font-medium text-sm text-ink-mid hover:bg-parchment-dark transition-colors">
                    Call Wilson
                  </a>
                </div>
              </div>
            )}

            {error && step !== 'pay' && (
              <div className="bg-bark/5 border border-bark/20 rounded px-4 py-3 font-sans text-sm text-bark">{error}</div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-parchment rounded-lg p-5 sticky top-20">
              <h2 className="font-sans font-semibold text-base text-ink mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between gap-2 text-sm">
                    <span className="font-sans text-ink-mid line-clamp-1">{i.name} × {i.quantity}</span>
                    <span className="font-mono font-semibold text-ink flex-shrink-0">KES {(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-rule pt-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-sans font-semibold text-sm text-ink">Total</span>
                  <span className="font-mono font-bold text-xl text-ink">KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {step === 'cart' && (
                <button onClick={() => setStep('checkout')} className="w-full bg-forest text-white font-sans font-semibold py-3 rounded hover:bg-forest-mid transition-colors text-sm">
                  Proceed to Checkout
                </button>
              )}
              {step === 'checkout' && (
                <button onClick={placeOrder} disabled={loading} className="w-full bg-forest text-white font-sans font-semibold py-3 rounded hover:bg-forest-mid transition-colors text-sm disabled:opacity-60">
                  {loading ? 'Processing…' : 'Place Order'}
                </button>
              )}
              {step === 'pay' && (
                <p className="font-sans text-xs text-ink-light text-center">Order #{orderId} created</p>
              )}

              <p className="font-sans text-xs text-ink-light text-center mt-3">
                M-Pesa · Pay on pickup · Call Wilson
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
