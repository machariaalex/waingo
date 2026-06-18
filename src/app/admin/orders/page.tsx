import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import OrdersTable from './OrdersTable';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
    take: 200,
  });

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Back-office</div>
        <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Orders</h1>
      </div>
      <OrdersTable orders={orders as unknown as import('@/types').Order[]} />
    </div>
  );
}
