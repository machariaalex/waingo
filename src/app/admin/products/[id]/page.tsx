import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductForm from '../ProductForm';
import type { Product } from '@/types';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const product = await prisma.product.findUnique({ where: { id: Number(params.id) } });
  if (!product) notFound();

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Products</div>
        <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Edit Product</h1>
      </div>
      <ProductForm product={product as unknown as Product} />
    </div>
  );
}
