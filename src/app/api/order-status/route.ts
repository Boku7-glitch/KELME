import { NextRequest, NextResponse } from 'next/server';
import { addReservations } from '../../../lib/server/core';
import {
  getOrder,
  saveOrder,
  getReserved,
  setReserved,
} from '../../../lib/server/store';
import { paymentStatus } from '../../../lib/server/payments';
import { notifyOrder } from '../../../lib/server/notify';
import { Order } from '../../../types/store';

export async function refreshOrderPayment(
  order: Order,
  env = process.env
): Promise<Order> {
  if (!order?.payment || order.status !== 'awaiting_payment') return order;
  const s = await paymentStatus(
    order.payment.provider,
    order.payment.id,
    env
  );
  if (s.status === 'awaiting_payment') {
    return order;
  }
  if (
    s.status === 'paid' &&
    s.amount &&
    Math.abs(s.amount - order.total) > 0.01
  ) {
    order.status = 'check_amount';
  } else {
    order.status = s.status;
  }
  order.payment.raw = s.raw;
  if (['failed', 'expired'].includes(order.status) && order.stockVersion) {
    await setReserved(
      order.stockVersion,
      addReservations(await getReserved(order.stockVersion), order, -1)
    );
  }
  await saveOrder(order);
  await notifyOrder(order, env);
  return order;
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id') || '';
  if (!/^KG\d{6}-[0-9A-F]{6}$/i.test(id)) {
    return NextResponse.json({ error: 'არასწორი შეკვეთის კოდი' }, { status: 400 });
  }
  let o = await getOrder(id.toUpperCase());
  if (!o) {
    return NextResponse.json({ error: 'შეკვეთა ვერ მოიძებნა' }, { status: 404 });
  }
  try {
    o = await refreshOrderPayment(o, process.env);
  } catch (e: any) {
    console.error('status refresh:', e?.message);
  }
  return NextResponse.json({
    id: o.id,
    status: o.status,
    total: o.total,
    ship: o.ship,
    pay: o.pay,
    createdAt: o.createdAt,
  });
}
