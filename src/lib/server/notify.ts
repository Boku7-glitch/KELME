import { Order } from '../../types/store';
import { ORDER_STATUS_KA } from '../../data/storeConfig';

const money = (n: number) => Math.round(n * 100) / 100 + ' ₾';

export function orderText(o: Order): string {
  const lines = o.lines
    .map(
      (l) =>
        `• ${l.model} (${l.color}) — ზომა ${l.size} × ${l.q} = ${money(l.total)}`
    )
    .join('\n');
  return [
    `🛒 შეკვეთა ${o.id}`,
    `სტატუსი: ${ORDER_STATUS_KA[o.status] || o.status}`,
    `${o.customer.name} · ${o.customer.phone}${o.customer.email ? ' · ' + o.customer.email : ''}`,
    lines,
    `ჯამი: ${money(o.total)}${o.discount ? ` (დაზოგა ${money(o.discount)})` : ''}`,
    o.ship === 'pickup'
      ? 'მიღება: აღება ისთ ფოინთიდან (Sport Avenue)'
      : `მიწოდება: ${o.city}, ${o.address} (${money(o.shipping)})`,
    `გადახდა: ${o.pay === 'card' ? 'ონლაინ ბარათით' : 'მაღაზიაში'}`,
    o.note ? `კომენტარი: ${o.note}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function telegram(text: string, env: NodeJS.ProcessEnv) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
    }
  );
}

async function sheets(payload: Record<string, unknown>, env: NodeJS.ProcessEnv) {
  if (!env.SHEETS_WEBHOOK_URL) return;
  await fetch(env.SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: env.SHEETS_SECRET || '', ...payload }),
    redirect: 'follow',
  });
}

async function safe(p: Promise<unknown>) {
  try {
    await p;
  } catch (e: any) {
    console.error('notify:', e?.message || e);
  }
}

export async function notifyOrder(o: Order, env = process.env) {
  await Promise.all([
    safe(
      sheets(
        {
          kind: 'order',
          order: { ...o, statusText: ORDER_STATUS_KA[o.status] || o.status },
        },
        env
      )
    ),
    safe(telegram(orderText(o), env)),
  ]);
}

export async function notifyLead(
  kind: 'lead' | 'newsletter',
  data: Record<string, any>,
  env = process.env
) {
  const text =
    kind === 'lead'
      ? `🏟 გუნდური შეკვეთის მოთხოვნა (B2B)\n${data.org} — ${data.name}, ${data.phone}\nრაოდენობა: ${data.qty || '—'}\n${data.note || ''}`
      : `✉️ ახალი გამომწერი: ${data.email}`;
  await Promise.all([
    safe(sheets({ kind, data, at: new Date().toISOString() }, env)),
    safe(telegram(text, env)),
  ]);
}
