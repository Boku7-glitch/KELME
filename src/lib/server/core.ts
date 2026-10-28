import { readFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import path from 'node:path';
import { Product, Order, OrderLine, ShippingMethod, PaymentMethod } from '../../types/store';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';
import { ORDER_STATUS_KA } from '../../data/storeConfig';

export class UserError extends Error {
  user: string;
  status: number;
  constructor(msg: string, status = 400) {
    super(msg);
    this.user = msg;
    this.status = status;
  }
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function loadProducts(): {
  list: Product[];
  byId: Record<string, Product>;
  version: string;
} {
  const candidates = [
    path.join(process.cwd(), 'public', 'products.json'),
    path.join(process.env.LAMBDA_TASK_ROOT || '', 'public', 'products.json'),
  ];
  for (const f of candidates) {
    try {
      const raw = readFileSync(f, 'utf8');
      const list = JSON.parse(raw) as Product[];
      const normalized = list.map((p) => ({
        ...p,
        img: p.img.startsWith('/') ? p.img : `/${p.img}`,
      }));
      return {
        list: normalized,
        byId: Object.fromEntries(normalized.map((p) => [p.id, p])),
        version: createHash('sha1').update(raw).digest('hex').slice(0, 12),
      };
    } catch {}
  }
  const raw = JSON.stringify(INITIAL_PRODUCTS);
  return {
    list: INITIAL_PRODUCTS,
    byId: Object.fromEntries(INITIAL_PRODUCTS.map((p) => [p.id, p])),
    version: createHash('sha1').update(raw).digest('hex').slice(0, 12),
  };
}

export function deliveryConfig(env = process.env) {
  return {
    enabled: env.DELIVERY_ENABLED !== '0',
    tbilisi: Number(env.DELIVERY_TBILISI || 7),
    regions: Number(env.DELIVERY_REGIONS || 12),
    freeFrom: Number(env.DELIVERY_FREE_FROM || 200),
  };
}

const str = (v: unknown, max: number) =>
  String(v ?? '')
    .trim()
    .slice(0, max);

export function normalizePhone(p: unknown): string | null {
  const d = String(p || '')
    .replace(/[^\d+]/g, '')
    .replace(/^\+?995/, '');
  return /^5\d{8}$/.test(d) ? '+995' + d : null;
}

export function newOrderId(now = new Date()): string {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, '');
  return 'KG' + ymd + '-' + randomBytes(3).toString('hex').toUpperCase();
}

export function addReservations(
  reserved: Record<string, number>,
  order: Order,
  sign: 1 | -1 = 1
): Record<string, number> {
  const r = { ...reserved };
  for (const l of order.lines) {
    const k = `${l.id}|${l.size}`;
    r[k] = Math.max(0, (r[k] || 0) + sign * l.q);
    if (!r[k]) delete r[k];
  }
  return r;
}

export function buildOrder(
  body: any,
  reserved: Record<string, number> = {},
  customProducts?: Product[],
  env = process.env
): Order {
  const loaded = loadProducts();
  const byId = customProducts
    ? Object.fromEntries(customProducts.map((p) => [p.id, p]))
    : loaded.byId;

  if (!body || !Array.isArray(body.items) || !body.items.length) {
    throw new UserError('კალათა ცარიელია');
  }
  if (body.items.length > 30) {
    throw new UserError('ძალიან ბევრი პროდუქტი ერთ შეკვეთაში');
  }

  const name = str(body.customer?.name, 80);
  const phone = normalizePhone(body.customer?.phone);
  const email = str(body.customer?.email, 120);
  if (name.length < 2) throw new UserError('შეიყვანე სახელი და გვარი');
  if (!phone)
    throw new UserError('შეიყვანე სწორი მობილურის ნომერი (5XX XX XX XX)');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new UserError('ელფოსტის ფორმატი არასწორია');
  }

  const merged = new Map<string, number>();
  for (const it of body.items) {
    const id = str(it.id, 40);
    const size = str(it.size, 8);
    const q = Math.floor(Number(it.q));
    if (!byId[id])
      throw new UserError('პროდუქტი აღარ არის მარაგში — განაახლე გვერდი');
    if (!(q >= 1 && q <= 20)) throw new UserError('არასწორი რაოდენობა');
    const k = `${id}|${size}`;
    merged.set(k, (merged.get(k) || 0) + q);
  }

  const lines: OrderLine[] = [];
  for (const [k, q] of merged) {
    const [id, size] = k.split('|');
    const p = byId[id];
    const inStock = Number(p.sizes?.[size] || 0) - Number(reserved[k] || 0);
    if (!(p.sizes && size in p.sizes)) {
      throw new UserError(`${p.model}: ზომა ${size} არ არსებობს`);
    }
    if (q > inStock) {
      throw new UserError(
        inStock > 0
          ? `${p.model} (${size}): მარაგში მხოლოდ ${inStock} წყვილია`
          : `${p.model} (${size}) უკვე გაიყიდა — აირჩიე სხვა ზომა`,
        409
      );
    }
    lines.push({
      id,
      size,
      q,
      model: p.model,
      color: p.color,
      price: p.price,
      sale: p.sale,
      total: round2(p.sale * q),
      img: p.img,
    });
  }

  const d = deliveryConfig(env);
  const ship: ShippingMethod = ['pickup', 'tbilisi', 'regions'].includes(
    body.ship
  )
    ? body.ship
    : 'pickup';
  if (ship !== 'pickup' && !d.enabled) {
    throw new UserError('მიწოდება ჯერ არ მუშაობს — აირჩიე აღება მაღაზიიდან');
  }
  const city = str(body.city, 60);
  const address = str(body.address, 200);
  if (ship !== 'pickup' && (!city || address.length < 4)) {
    throw new UserError('შეიყვანე ქალაქი და მიწოდების ზუსტი მისამართი');
  }

  const subtotal = round2(lines.reduce((a, l) => a + l.total, 0));
  const fullPrice = round2(lines.reduce((a, l) => a + l.price * l.q, 0));
  const shipping =
    ship === 'pickup'
      ? 0
      : d.freeFrom && subtotal >= d.freeFrom
        ? 0
        : ship === 'tbilisi'
          ? d.tbilisi
          : d.regions;
  const pay: PaymentMethod = body.pay === 'card' ? 'card' : 'store';

  return {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    status: pay === 'card' ? 'awaiting_payment' : 'new',
    customer: { name, phone, ...(email ? { email } : {}) },
    ship,
    ...(city ? { city } : {}),
    ...(address ? { address } : {}),
    pay,
    note: str(body.note, 500),
    lines,
    subtotal,
    discount: round2(fullPrice - subtotal),
    shipping,
    total: round2(subtotal + shipping),
    stockVersion: loaded.version,
  };
}

export { ORDER_STATUS_KA };
