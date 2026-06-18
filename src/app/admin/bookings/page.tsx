import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BookingsTable from './BookingsTable';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Back-office</div>
        <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Bookings</h1>
      </div>
      <BookingsTable bookings={bookings as unknown as import('@/types').Booking[]} />
    </div>
  );
}
