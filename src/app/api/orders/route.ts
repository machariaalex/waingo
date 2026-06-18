import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerName, phone, email, type, address, items, total } = body;

  if (!customerName || !phone || !type || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate stock
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.active) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` }, { status: 400 });
    }
  }

  // Create order and decrement stock in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName,
        phone,
        email: email || null,
        type,
        address: address || null,
        total: Number(total),
        items: {
          create: items.map((i: { productId: number; quantity: number; price: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: Number(i.price),
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
