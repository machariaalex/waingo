import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import StockManager from './StockManager';

export default async function StockPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  const lowStock = products.filter((p) => p.stock <= p.minStock);

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Inventory</div>
        <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Stock & Reorder</h1>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-soil-red/5 border border-soil-red/20 rounded-sm p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-soil-red/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-soil-red font-bold text-sm">!</span>
          </div>
          <div>
            <div className="font-heading font-bold text-sm text-charcoal-ink">
              {lowStock.length} item{lowStock.length > 1 ? 's' : ''} below minimum stock level
            </div>
            <div className="font-mono text-xs text-charcoal-ink/50 mt-0.5">
              {lowStock.map((p) => p.name).join(', ')}
            </div>
          </div>
        </div>
      )}

      <StockManager products={products as unknown as import('@/types').Product[]} />
    </div>
  );
}
