import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, type, date, notes } = body;

  if (!name || !phone || !type || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: { name, phone, type, date, notes: notes || null },
  });
  return NextResponse.json(booking, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  const booking = await prisma.booking.update({
    where: { id: Number(id) },
    data: { status },
  });
  return NextResponse.json(booking);
}
