import { Order } from '../../types/store';

let tokenCache = { key: '', token: '', exp: 0 };

async function cachedToken(
  key: string,
  fetcher: () => Promise<{ token: string; ttl: number }>
): Promise<string> {
  if (tokenCache.key === key && tokenCache.exp > Date.now() + 30000) {
    return tokenCache.token;
  }
  const { token, ttl } = await fetcher();
  tokenCache = {
    key,
    token,
    exp: Date.now() + Math.min(ttl || 300, 3600) * 1000,
  };
  return token;
}

async function must(res: Response, what: string): Promise<any> {
  const text = await res.text();
  if (!res.ok) throw new Error(`${what} ${res.status}: ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/* ---------------- Bank of Georgia ---------------- */
const BOG = {
  auth: 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token',
  orders: 'https://api.bog.ge/payments/v1/ecommerce/orders',
  receipt: (id: string) =>
    `https://api.bog.ge/payments/v1/receipt/${encodeURIComponent(id)}`,
};

async function bogToken(env: NodeJS.ProcessEnv) {
  return cachedToken('bog', async () => {
    const basic = Buffer.from(
      `${env.BOG_CLIENT_ID}:${env.BOG_CLIENT_SECRET}`
    ).toString('base64');
    const j = await must(
      await fetch(BOG.auth, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + basic,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      }),
      'BoG auth'
    );
    return {
      token: j.access_token,
      ttl: Math.min(Number(j.expires_in) || 300, 300),
    };
  });
}

async function bogCreate(order: Order, env: NodeJS.ProcessEnv, site: string) {
  const t = await bogToken(env);
  const body = {
    callback_url: `${site}/api/payment-callback?p=bog`,
    external_order_id: order.id,
    capture: 'automatic',
    buyer: {
      full_name: order.customer.name,
      masked_phone: order.customer.phone,
    },
    purchase_units: {
      currency: 'GEL',
      total_amount: order.total,
      basket: order.lines.map((l) => ({
        product_id: `${l.id}-${l.size}`,
        description: `${l.model} ${l.size}`.slice(0, 60),
        quantity: l.q,
        unit_price: l.sale,
      })),
      ...(order.shipping ? { delivery: { amount: order.shipping } } : {}),
    },
    redirect_urls: {
      success: `${site}/?orderOk=${order.id}`,
      fail: `${site}/?orderOk=${order.id}&status=fail`,
    },
    ttl: 30,
  };
  const j = await must(
    await fetch(BOG.orders, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + t,
        'Content-Type': 'application/json',
        'Accept-Language': 'ka',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(body),
    }),
    'BoG create'
  );
  return { providerId: j.id as string, redirect: j._links?.redirect?.href as string };
}

async function bogStatus(providerId: string, env: NodeJS.ProcessEnv) {
  const t = await bogToken(env);
  const j = await must(
    await fetch(BOG.receipt(providerId), {
      headers: { Authorization: 'Bearer ' + t, 'Accept-Language': 'ka' },
    }),
    'BoG receipt'
  );
  const k = j.order_status?.key;
  return {
    status: (k === 'completed'
      ? 'paid'
      : k === 'rejected'
        ? 'failed'
        : ['refunded', 'refunded_partially'].includes(k)
          ? 'refunded'
          : 'awaiting_payment') as Order['status'],
    raw: k as string,
    amount: Number(j.purchase_units?.transfer_amount || 0),
    externalId: j.external_order_id as string,
  };
}

/* ---------------- TBC Checkout ---------------- */
const TBC = { base: 'https://api.tbcbank.ge/v1/tpay' };

async function tbcToken(env: NodeJS.ProcessEnv) {
  return cachedToken('tbc', async () => {
    const j = await must(
      await fetch(`${TBC.base}/access-token`, {
        method: 'POST',
        headers: {
          apikey: env.TBC_API_KEY || '',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: env.TBC_CLIENT_ID || '',
          client_secret: env.TBC_CLIENT_SECRET || '',
        }),
      }),
      'TBC auth'
    );
    return { token: j.access_token, ttl: Number(j.expires_in) || 300 };
  });
}

async function tbcCreate(order: Order, env: NodeJS.ProcessEnv, site: string) {
  const t = await tbcToken(env);
  const body = {
    amount: {
      currency: 'GEL',
      total: order.total,
      subTotal: order.subtotal,
      tax: 0,
      shipping: order.shipping,
    },
    returnurl: `${site}/?orderOk=${order.id}`,
    callbackUrl: `${site}/api/payment-callback?p=tbc`,
    merchantPaymentId: order.id,
    extra: order.id.slice(0, 25),
    expirationMinutes: 12,
    language: 'KA',
  };
  const j = await must(
    await fetch(`${TBC.base}/payments`, {
      method: 'POST',
      headers: {
        apikey: env.TBC_API_KEY || '',
        Authorization: 'Bearer ' + t,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
    'TBC create'
  );
  const link = (j.links || []).find((l: any) => l.rel === 'approval_url');
  return { providerId: j.payId as string, redirect: link?.uri as string };
}

async function tbcStatus(providerId: string, env: NodeJS.ProcessEnv) {
  const t = await tbcToken(env);
  const j = await must(
    await fetch(`${TBC.base}/payments/${encodeURIComponent(providerId)}`, {
      headers: {
        apikey: env.TBC_API_KEY || '',
        Authorization: 'Bearer ' + t,
      },
    }),
    'TBC status'
  );
  const s = String(j.status || '');
  return {
    status: (s === 'Succeeded'
      ? 'paid'
      : ['Failed', 'Expired', 'CancelPaymentProcessing'].includes(s)
        ? s === 'Expired'
          ? 'expired'
          : 'failed'
        : ['Returned', 'PartialReturned'].includes(s)
          ? 'refunded'
          : 'awaiting_payment') as Order['status'],
    raw: s,
    amount: Number(j.amount || 0),
    externalId: j.merchantPaymentId as string,
  };
}

export function getPaymentProvider(env = process.env): 'bog' | 'tbc' | null {
  const p = (env.PAYMENT_PROVIDER || '').toLowerCase();
  if (p === 'bog' && env.BOG_CLIENT_ID && env.BOG_CLIENT_SECRET) return 'bog';
  if (
    p === 'tbc' &&
    env.TBC_API_KEY &&
    env.TBC_CLIENT_ID &&
    env.TBC_CLIENT_SECRET
  ) {
    return 'tbc';
  }
  return null;
}

export async function createPayment(
  order: Order,
  env = process.env,
  site: string
) {
  const p = getPaymentProvider(env);
  if (!p) throw new Error('payment provider not configured');
  const r =
    p === 'bog'
      ? await bogCreate(order, env, site)
      : await tbcCreate(order, env, site);
  if (!r.providerId || !r.redirect) {
    throw new Error(p + ' create: no id/redirect');
  }
  return { ...r, provider: p };
}

export async function paymentStatus(
  providerName: 'bog' | 'tbc',
  providerId: string,
  env = process.env
) {
  return providerName === 'tbc'
    ? tbcStatus(providerId, env)
    : bogStatus(providerId, env);
}
