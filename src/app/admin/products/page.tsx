import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import ProductAdminTable from './ProductAdminTable';

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const products = await prisma.product.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Inventory</div>
          <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Products</h1>
        </div>
        <Link href="/admin/products/new" className="bg-soil-red text-manila font-heading font-bold px-5 py-2.5 rounded-sm hover:bg-dark-soil transition-colors text-sm">
          + Add Product
        </Link>
      </div>

      <ProductAdminTable products={products as unknown as import('@/types').Product[]} />
    </div>
  );
}
