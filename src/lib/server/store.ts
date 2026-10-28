import { Order, OrderStatus, TeamLead } from '../../types/store';
import { firebaseStoreService } from '../firebase/service';

// In-memory store fallback when Firebase is not configured yet
const g = globalThis as unknown as {
  __KELME_ORDERS__?: Map<string, Order>;
  __KELME_PAY_LINKS__?: Map<string, string>;
  __KELME_RESERVED__?: Map<string, Record<string, number>>;
  __KELME_LEADS__?: TeamLead[];
};

const memOrders = (g.__KELME_ORDERS__ ||= new Map<string, Order>());
const memPayLinks = (g.__KELME_PAY_LINKS__ ||= new Map<string, string>());
const memReserved = (g.__KELME_RESERVED__ ||= new Map<string, Record<string, number>>());
const memLeads = (g.__KELME_LEADS__ ||= [
  {
    id: 'LEAD-TFA-01',
    createdAt: '2026-10-27T14:20:00.000Z',
    org: 'საფეხბურთო აკადემია ტფილისი (Tfilisi Academy)',
    name: 'დავით დვალი',
    phone: '+995 599 12 34 56',
    qty: '45 კომპლექტი',
    note: 'აკადემიის U-10 და U-12 ასაკობრივი ჯგუფებისთვის სათამაშო და სავარჯიშო ფორმები + Turf ბუცები.',
    status: 'new',
  },
]);

// Seed a sample demo order in memory if empty so Admin Panel immediately shows realistic data
if (memOrders.size === 0) {
  const sampleOrder: Order = {
    id: 'KG261028-A1B2C3',
    createdAt: '2026-10-28T11:30:00.000Z',
    status: 'new',
    customer: {
      name: 'გიორგი ბერიძე',
      phone: '+995599112233',
      email: 'g.beridze@example.ge',
    },
    ship: 'pickup',
    pay: 'store',
    note: 'მოვალ საღამოს 19:00-ისთვის ისთ ფოინთში',
    lines: [
      {
        id: '55147-3',
        size: '42',
        q: 1,
        model: 'Heritage Turf',
        color: 'ლურჯი',
        price: 195,
        sale: 97.5,
        total: 97.5,
        img: '/img/55147-3.jpg',
      },
      {
        id: '55168-706',
        size: '31',
        q: 1,
        model: 'Coleiro Turf Elastic',
        color: 'მუქი ლურჯი/ნარინჯისფერი',
        price: 139,
        sale: 97,
        total: 97,
        img: '/img/55168-706.jpg',
      },
    ],
    subtotal: 194.5,
    discount: 139.5,
    shipping: 0,
    total: 194.5,
  };
  memOrders.set(sampleOrder.id, sampleOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const fbOrder = await firebaseStoreService.getOrderFromFirestore(id);
  if (fbOrder) {
    memOrders.set(id, fbOrder);
    return fbOrder;
  }
  return memOrders.get(id) || null;
}

export async function getAllOrders(): Promise<Order[]> {
  const fbOrders = await firebaseStoreService.fetchAllOrders();
  if (fbOrders && fbOrders.length > 0) {
    fbOrders.forEach((o) => memOrders.set(o.id, o));
    return fbOrders;
  }
  return Array.from(memOrders.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function saveOrder(o: Order): Promise<Order> {
  o.updatedAt = new Date().toISOString();
  memOrders.set(o.id, o);
  await firebaseStoreService.saveOrderToFirestore(o);
  return o;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const existing = await getOrder(id);
  if (!existing) return null;
  existing.status = status;
  existing.updatedAt = new Date().toISOString();
  memOrders.set(id, existing);
  await firebaseStoreService.updateOrderStatusInFirestore(id, status);
  return existing;
}

export async function linkPayment(providerId: string, orderId: string) {
  memPayLinks.set(providerId, orderId);
}

export async function orderByPayment(providerId: string): Promise<Order | null> {
  const orderId = memPayLinks.get(providerId);
  return orderId ? getOrder(orderId) : null;
}

export async function getReserved(
  version: string
): Promise<Record<string, number>> {
  const fbRes = await firebaseStoreService.getReservationsFromFirestore(version);
  if (fbRes) {
    memReserved.set(version, fbRes);
    return fbRes;
  }
  return memReserved.get(version) || {};
}

export async function setReserved(
  version: string,
  r: Record<string, number>
): Promise<void> {
  memReserved.set(version, r);
  await firebaseStoreService.setReservationsInFirestore(version, r);
}

export async function saveLead(lead: TeamLead): Promise<TeamLead> {
  memLeads.unshift(lead);
  await firebaseStoreService.saveTeamLeadToFirestore(lead);
  return lead;
}

export async function getAllLeads(): Promise<TeamLead[]> {
  const fbLeads = await firebaseStoreService.fetchTeamLeads();
  if (fbLeads && fbLeads.length > 0) return fbLeads;
  return memLeads;
}
