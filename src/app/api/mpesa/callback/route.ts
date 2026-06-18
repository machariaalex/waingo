import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const stk = body?.Body?.stkCallback;
    if (!stk) return NextResponse.json({ ok: true });

    const resultCode = stk.ResultCode;
    const ref = stk.CheckoutRequestID;

    // Find order by account reference
    const meta: Record<string, string> = {};
    stk.CallbackMetadata?.Item?.forEach((item: { Name: string; Value: unknown }) => {
      meta[item.Name] = String(item.Value);
    });

    const accountRef = meta['AccountReference'] ?? '';
    const orderId = parseInt(accountRef.replace('WAINGO-', ''));
    const mpesaRef = meta['MpesaReceiptNumber'] ?? ref;

    if (!isNaN(orderId)) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: resultCode === 0 ? 'paid' : 'pending',
          mpesaRef: resultCode === 0 ? mpesaRef : undefined,
        },
      });
    }
  } catch (err) {
    console.error('M-Pesa callback error:', err);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
