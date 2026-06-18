import { NextRequest, NextResponse } from 'next/server';
import { initiateSTKPush } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  const { phone, amount, orderId } = await req.json();

  if (!phone || !amount || !orderId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await initiateSTKPush(phone, amount, orderId);
    return NextResponse.json(result);
  } catch (err) {
    console.error('M-Pesa STK Push error:', err);
    return NextResponse.json({ error: 'M-Pesa request failed' }, { status: 500 });
  }
}
