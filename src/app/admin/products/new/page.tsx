import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductForm from '../ProductForm';

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="font-mono text-xs text-charcoal-ink/40 uppercase tracking-widest mb-1">Products</div>
        <h1 className="font-heading font-bold text-3xl text-charcoal-ink">Add Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
