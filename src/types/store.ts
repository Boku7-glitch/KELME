export type CategoryKey = 'football' | 'sport' | 'casual' | 'kids';
export type FilterCategoryKey = 'all' | 'sale' | CategoryKey;

export interface Product {
  id: string;
  model: string;
  color: string;
  cat: CategoryKey;
  price: number;
  sale: number;
  disc: number;
  sizes: Record<string, number>;
  img: string;
}

export interface CartItem {
  id: string;
  size: string;
  q: number;
}

export interface OrderLine {
  id: string;
  size: string;
  q: number;
  model: string;
  color: string;
  price: number;
  sale: number;
  total: number;
  img?: string;
}

export type OrderStatus =
  | 'new'
  | 'awaiting_payment'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'ready'
  | 'done'
  | 'cancelled'
  | 'refunded'
  | 'check_amount';

export type ShippingMethod = 'pickup' | 'tbilisi' | 'regions';
export type PaymentMethod = 'store' | 'card';

export interface Order {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  ship: ShippingMethod;
  city?: string;
  address?: string;
  pay: PaymentMethod;
  note?: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  stockVersion?: string;
  payment?: {
    provider: 'bog' | 'tbc';
    id: string;
    raw?: string;
  };
}

export interface TeamLead {
  id: string;
  createdAt: string;
  org: string;
  name: string;
  phone: string;
  qty?: string;
  note?: string;
  status?: 'new' | 'contacted' | 'closed';
}
