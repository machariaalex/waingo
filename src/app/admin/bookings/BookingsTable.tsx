'use client';
import { useState } from 'react';
import type { Booking } from '@/types';

const TYPE_LABELS: Record<string, string> = { vet: 'Vet Call-out', tour: 'Farm Tour', bulk: 'Bulk Pickup' };
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-maize-gold/10 text-maize-gold border-maize-gold/30',
  confirmed: 'bg-sukuma-green/10 text-sukuma-green border-sukuma-green/30',
  cancelled: 'bg-soil-red/10 text-soil-red border-soil-red/20',
};

export default function BookingsTable({ bookings: initial }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState(initial);

  async function updateStatus(id: number, status: string) {
    await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status: status as Booking['status'] } : b));
  }

  if (bookings.length === 0) {
    return <p className="font-body text-sm text-charcoal-ink/40 py-8 text-center">No bookings yet.</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="bg-light-manila border border-charcoal-ink/10 rounded-sm p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-bold text-sm text-charcoal-ink">{b.name}</span>
                <span className="font-mono text-xs text-charcoal-ink/40 bg-dark-manila px-2 py-0.5 rounded-sm">{TYPE_LABELS[b.type] ?? b.type}</span>
              </div>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-charcoal-ink/50">
                <a href={`tel:${b.phone}`} className="hover:text-sukuma-green transition-colors">{b.phone}</a>
                <span>Date: {b.date}</span>
                <span>Submitted: {new Date(b.createdAt).toLocaleDateString('en-KE')}</span>
              </div>
              {b.notes && (
                <p className="font-body text-sm text-charcoal-ink/60 mt-2 bg-dark-manila/50 px-3 py-2 rounded-sm">{b.notes}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <select
                value={b.status}
                onChange={(e) => updateStatus(b.id, e.target.value)}
                className={`font-mono text-xs px-2 py-1 rounded-sm border uppercase ${STATUS_COLORS[b.status]} bg-transparent cursor-pointer`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <a
                href={`https://wa.me/${b.phone.replace(/^0/, '254').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-sukuma-green hover:underline"
              >
                WhatsApp →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
