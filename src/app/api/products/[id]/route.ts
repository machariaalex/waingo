import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: Number(params.id) } });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, category, price, stock, minStock, unit, imageUrl, featured, active } = body;

  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(price !== undefined && { price: Number(price) }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(minStock !== undefined && { minStock: Number(minStock) }),
      ...(unit !== undefined && { unit }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
      ...(active !== undefined && { active: Boolean(active) }),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.product.update({ where: { id: Number(params.id) }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
