import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const q = searchParams.get('q');
  const adminAll = searchParams.get('all');

  if (slug) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  }

  const where: Record<string, unknown> = adminAll ? {} : { active: true };
  if (category) where.category = category;
  if (featured) where.featured = true;
  if (q) where.name = { contains: q };

  const products = await prisma.product.findMany({ where, orderBy: { name: 'asc' } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, category, price, stock, minStock, unit, imageUrl, featured, active } = body;

  if (!name || !slug || !category || price == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, slug, description, category, price: Number(price), stock: Number(stock ?? 0), minStock: Number(minStock ?? 5), unit: unit ?? 'piece', imageUrl, featured: Boolean(featured), active: active !== false },
  });
  return NextResponse.json(product, { status: 201 });
}
