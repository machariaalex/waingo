import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const [products, orders, bookings] = await Promise.all([
    prisma.product.findMany({ where: { active: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { items: { include: { product: true } } } }),
    prisma.booking.findMany({ where: { status: 'pending' }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenue = orders.filter((o) => ['paid', 'delivered'].includes(o.status)).reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Back-office</div>
        <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, link: '/admin/products', color: 'text-charcoal-ink' },
          { label: 'Low Stock Items', value: lowStock.length, link: '/admin/stock', color: lowStock.length > 0 ? 'text-soil-red' : 'text-sukuma-green', alert: lowStock.length > 0 },
          { label: 'Pending Orders', value: pendingOrders.length, link: '/admin/orders', color: pendingOrders.length > 0 ? 'text-maize-gold' : 'text-charcoal-ink' },
          { label: 'Pending Bookings', value: bookings.length, link: '/admin/bookings', color: bookings.length > 0 ? 'text-maize-gold' : 'text-charcoal-ink' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.link} className={`bg-light-manila border rounded-sm p-4 hover:shadow-sm transition-shadow ${stat.alert ? 'border-soil-red/30' : 'border-charcoal-ink/10'}`}>
            <div className={`font-mono font-bold text-3xl ${stat.color}`}>{stat.value}</div>
            <div className="font-body text-xs text-charcoal-ink/50 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="bg-soil-red/5 border border-soil-red/20 rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-base text-charcoal-ink">Low Stock Alert</h2>
              <Link href="/admin/stock" className="font-mono text-xs text-soil-red hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="ledger-row">
                  <span className="font-body text-sm text-charcoal-ink line-clamp-1">{p.name}</span>
                  <span className="font-mono text-sm font-semibold text-soil-red flex-shrink-0">
                    {p.stock} / {p.minStock} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="bg-light-manila border border-charcoal-ink/10 rounded-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-base text-charcoal-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="font-mono text-xs text-soil-red hover:underline">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="font-body text-sm text-charcoal-ink/40">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 6).map((o) => (
                <div key={o.id} className="ledger-row">
                  <div>
                    <div className="font-body text-sm text-charcoal-ink">{o.customerName}</div>
                    <div className="font-mono text-[10px] text-charcoal-ink/40">{o.phone} · {o.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-sm text-soil-red">KES {o.total.toLocaleString()}</div>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending bookings */}
        {bookings.length > 0 && (
          <div className="bg-maize-gold/5 border border-maize-gold/20 rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-base text-charcoal-ink">Pending Bookings</h2>
              <Link href="/admin/bookings" className="font-mono text-xs text-soil-red hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="ledger-row">
                  <div>
                    <div className="font-body text-sm text-charcoal-ink">{b.name}</div>
                    <div className="font-mono text-[10px] text-charcoal-ink/40">{b.type} · {b.date}</div>
                  </div>
                  <a href={`tel:${b.phone}`} className="font-mono text-xs text-sukuma-green hover:underline flex-shrink-0">{b.phone}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue summary */}
        <div className="bg-sukuma-green/5 border border-sukuma-green/20 rounded-sm p-5">
          <h2 className="font-heading font-bold text-base text-charcoal-ink mb-3">Revenue (Paid Orders)</h2>
          <div className="font-mono font-bold text-3xl text-sukuma-green mb-1">
            KES {totalRevenue.toLocaleString()}
          </div>
          <div className="font-body text-xs text-charcoal-ink/40">
            From {orders.filter((o) => ['paid', 'delivered'].includes(o.status)).length} completed orders
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'text-maize-gold',
    paid: 'text-sukuma-green',
    processing: 'text-sukuma-green',
    ready: 'text-sukuma-green',
    delivered: 'text-charcoal-ink/40',
    cancelled: 'text-soil-red',
  };
  return <div className={`font-mono text-[10px] uppercase ${colors[status] ?? 'text-charcoal-ink/40'}`}>{status}</div>;
}
