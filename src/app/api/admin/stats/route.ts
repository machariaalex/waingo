import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [totalProducts, lowStockProducts, pendingOrders, totalOrders, totalRevenue, pendingBookings, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { active: true, stock: { lte: prisma.product.fields.minStock } } }).catch(() =>
      prisma.product.findMany({ where: { active: true } }).then((ps) => ps.filter((p) => p.stock <= p.minStock).length)
    ),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ['paid', 'processing', 'delivered'] } } }),
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: { include: { product: true } } },
    }),
  ]);

  const lowStock = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, name: true, stock: true, minStock: true, category: true },
  }).then((ps) => ps.filter((p) => p.stock <= p.minStock));

  return NextResponse.json({
    totalProducts,
    lowStockCount: lowStock.length,
    pendingOrders,
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    pendingBookings,
    recentOrders,
    lowStockProducts: lowStock,
  });
}
