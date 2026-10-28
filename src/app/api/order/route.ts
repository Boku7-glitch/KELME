import { NextRequest, NextResponse } from 'next/server';
import {
  buildOrder,
  loadProducts,
  addReservations,
  UserError,
} from '../../../lib/server/core';
import {
  saveOrder,
  linkPayment,
  getReserved,
  setReserved,
  getAllOrders,
  updateOrderStatus,
  saveLead,
  getAllLeads,
} from '../../../lib/server/store';
import { createPayment, getPaymentProvider } from '../../../lib/server/payments';
import { notifyOrder, notifyLead } from '../../../lib/server/notify';
import { firebaseStoreService } from '../../../lib/firebase/service';
import { OrderStatus } from '../../../types/store';

function getSiteUrl(req: NextRequest): string {
  return (
    process.env.SITE_URL ||
    process.env.URL ||
    new URL(req.url).origin
  ).replace(/\/$/, '');
}

export async function GET() {
  try {
    const [orders, leads] = await Promise.all([getAllOrders(), getAllLeads()]);
    return NextResponse.json({ orders, leads });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'ვერ ჩაიტვირთა შეკვეთები' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body as {
      orderId?: string;
      status?: OrderStatus;
    };
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'აკლია შეკვეთის ID ან სტატუსი' },
        { status: 400 }
      );
    }
    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json(
        { error: 'შეკვეთა ვერ მოიძებნა' },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, order: updated });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'შეცდომა სტატუსის განახლებისას' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 20000) {
    return NextResponse.json(
      { error: 'ძალიან დიდი მოთხოვნა' },
      { status: 413 }
    );
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: 'არასწორი მონაცემები' },
      { status: 400 }
    );
  }

  // Honeypot bot filter
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    if (body.type === 'lead') {
      const d = {
        id: 'LEAD-' + Date.now().toString(36).toUpperCase(),
        createdAt: new Date().toISOString(),
        org: String(body.org || '').trim().slice(0, 120),
        name: String(body.name || '').trim().slice(0, 80),
        phone: String(body.phone || '').trim().slice(0, 30),
        qty: String(body.qty || '').trim().slice(0, 20),
        note: String(body.note || '').trim().slice(0, 1000),
        status: 'new' as const,
      };
      if (!d.org || !d.name || !d.phone) {
        throw new UserError('შეავსე ორგანიზაცია, სახელი და ტელეფონი');
      }
      await saveLead(d);
      await notifyLead('lead', d);
      return NextResponse.json({ ok: true, lead: d });
    }

    if (body.type === 'newsletter') {
      const email = String(body.email || '')
        .trim()
        .slice(0, 120);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new UserError('ელფოსტის ფორმატი არასწორია');
      }
      await firebaseStoreService.saveSubscriberToFirestore(email);
      await notifyLead('newsletter', { email });
      return NextResponse.json({ ok: true });
    }

    const { version } = loadProducts();
    const reserved = await getReserved(version);
    const fbProducts = await firebaseStoreService.fetchProducts();
    const order = buildOrder(
      body,
      reserved,
      fbProducts || undefined,
      process.env
    );

    if (order.pay === 'card' && !getPaymentProvider(process.env)) {
      throw new UserError(
        'ონლაინ გადახდა ჯერ არ არის ჩართული — აირჩიე გადახდა მაღაზიაში'
      );
    }

    await setReserved(version, addReservations(reserved, order, 1));
    order.stockVersion = version;

    if (order.pay === 'card') {
      try {
        const p = await createPayment(order, process.env, getSiteUrl(req));
        order.payment = { provider: p.provider, id: p.providerId };
        await saveOrder(order);
        await linkPayment(p.providerId, order.id);
        await notifyOrder(order);
        return NextResponse.json({
          orderId: order.id,
          redirect: p.redirect,
          order,
        });
      } catch (e: any) {
        console.error('payment create failed:', e?.message);
        await setReserved(
          version,
          addReservations(await getReserved(version), order, -1)
        );
        throw new UserError(
          'ბანკთან კავშირი ვერ დამყარდა. სცადე თავიდან ან აირჩიე გადახდა მაღაზიაში',
          502
        );
      }
    }

    await saveOrder(order);
    await notifyOrder(order);
    return NextResponse.json({ orderId: order.id, order });
  } catch (e: any) {
    if (e?.user) {
      return NextResponse.json(
        { error: e.user },
        { status: e.status || 400 }
      );
    }
    console.error(e);
    return NextResponse.json(
      {
        error:
          'სერვერის შეცდომა. სცადე მოგვიანებით ან მოგვწერე Messenger-ში',
      },
      { status: 500 }
    );
  }
}
