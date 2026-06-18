'use client';
import { useState } from 'react';

type BookingType = 'vet' | 'tour' | 'bulk';

const BOOKING_TYPES: { value: BookingType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'vet',
    label: 'Vet Call-out',
    desc: 'Wilson or a qualified vet visits your farm for animal treatment, vaccination, or diagnosis.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    value: 'tour',
    label: 'Farm Tour',
    desc: 'Visit Waingo Farm to see our watermelon operation, livestock setup, and farm management practices.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    value: 'bulk',
    label: 'Bulk Order Pickup',
    desc: 'Pre-arrange collection of a large order — get better pricing on feeds, seeds, and health products.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

const INPUT_CLASS = 'w-full bg-white border border-rule rounded px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-forest transition-colors';

export default function BookingPage() {
  const [form, setForm] = useState({ name: '', phone: '', type: 'vet' as BookingType, date: '', notes: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date) {
      setErrorMsg('Name, phone number and preferred date are required.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setErrorMsg(d.error ?? 'Something went wrong'); setStatus('error'); return; }
      setStatus('done');
    } catch {
      setErrorMsg('Network error. Please call Wilson directly on 0704 659 267.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl text-ink mb-2">Request Sent</h1>
          <p className="font-sans text-ink-mid mb-1 text-base">
            Wilson will call or WhatsApp you on <span className="font-semibold text-ink">{form.phone}</span> to confirm.
          </p>
          <p className="font-sans text-sm text-ink-light mb-8">Usually within a few hours during business hours.</p>
          <a
            href="https://wa.me/254704659267"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-forest text-white font-sans font-semibold px-6 py-3 rounded hover:bg-forest-mid transition-colors text-sm mb-4"
          >
            Send a WhatsApp message instead
          </a>
          <div>
            <button onClick={() => setStatus('idle')} className="font-sans text-sm text-ink-light hover:text-ink transition-colors">
              Make another request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-parchment border-b border-rule">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
          <div className="font-sans text-xs text-ink-light uppercase tracking-wider mb-2">Waingo Farm & Agrovet</div>
          <h1 className="font-serif font-bold text-4xl text-ink mb-3">Book a Visit</h1>
          <p className="font-sans text-base text-ink-mid max-w-xl leading-relaxed">
            Request a vet call-out, farm tour, or schedule a bulk order pickup. Wilson will confirm your request by phone or WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <form onSubmit={submit} className="space-y-8">

          {/* Request type */}
          <div>
            <h2 className="font-sans font-semibold text-base text-ink mb-4">What can we help you with?</h2>
            <div className="grid gap-3">
              {BOOKING_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    form.type === t.value
                      ? 'border-forest bg-forest/4 ring-1 ring-forest/20'
                      : 'border-rule bg-parchment hover:border-stone-light'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={form.type === t.value}
                    onChange={() => setForm({ ...form, type: t.value })}
                    className="sr-only"
                  />
                  <div className={`mt-0.5 flex-shrink-0 ${form.type === t.value ? 'text-forest' : 'text-ink-light'}`}>
                    {t.icon}
                  </div>
                  <div>
                    <div className={`font-sans font-semibold text-sm ${form.type === t.value ? 'text-forest' : 'text-ink'}`}>{t.label}</div>
                    <div className="font-sans text-xs text-ink-light mt-0.5 leading-relaxed">{t.desc}</div>
                  </div>
                  {form.type === t.value && (
                    <div className="ml-auto flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-forest" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Contact details */}
          <div>
            <h2 className="font-sans font-semibold text-base text-ink mb-4">Your details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="e.g. Peter Mwangi"
                  required
                />
              </div>
              <div>
                <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Phone number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${INPUT_CLASS} font-mono`}
                  placeholder="07XX XXX XXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">Preferred date</label>
            <input
              type="date"
              value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`${INPUT_CLASS} font-mono max-w-xs`}
              required
            />
            <p className="font-sans text-xs text-ink-light mt-1.5">Wilson will confirm the exact time when he contacts you.</p>
          </div>

          {/* Notes */}
          <div>
            <label className="font-sans text-sm font-medium text-ink-mid block mb-1.5">
              Notes <span className="text-ink-light font-normal">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className={`${INPUT_CLASS} resize-none`}
              placeholder="e.g. I have 120 layers showing respiratory symptoms, started 3 days ago. Also need to collect 10 bags of layer mash if possible..."
            />
          </div>

          {errorMsg && (
            <div className="bg-bark/5 border border-bark/20 rounded px-4 py-3 font-sans text-sm text-bark">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 bg-forest text-white font-sans font-semibold py-3.5 px-8 rounded hover:bg-forest-mid transition-colors disabled:opacity-60 text-base"
            >
              {status === 'loading' ? 'Sending…' : 'Send Request'}
            </button>
            <a
              href="https://wa.me/254704659267"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-[#25D366] text-white font-sans font-semibold py-3.5 px-8 rounded hover:bg-[#1ebe5b] transition-colors text-base"
            >
              WhatsApp Instead
            </a>
          </div>

          <p className="font-sans text-sm text-ink-light text-center">
            Or call <a href="tel:+254704659267" className="font-mono text-forest hover:underline">0704 659 267</a> to speak with Wilson directly.
          </p>
        </form>
      </div>
    </div>
  );
}
