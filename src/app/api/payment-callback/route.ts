import { NextRequest, NextResponse } from 'next/server';
import { orderByPayment } from '../../../lib/server/store';
import { refreshOrderPayment } from '../order-status/route';

export async function POST(req: NextRequest) {
  const p = new URL(req.url).searchParams.get('p');
  const raw = await req.text();
  let body: any = {};
  try {
    body = JSON.parse(raw);
  } catch {
    try {
      body = Object.fromEntries(new URLSearchParams(raw));
    } catch {}
  }
  const providerId =
    p === 'tbc'
      ? body.PaymentId || body.paymentId || body.payId
      : body.body?.order_id || body.order_id;
  if (!providerId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const order = await orderByPayment(String(providerId));
  if (!order) {
    return NextResponse.json({ ok: true });
  }
  try {
    await refreshOrderPayment(order, process.env);
  } catch (e: any) {
    console.error('callback refresh:', e?.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
