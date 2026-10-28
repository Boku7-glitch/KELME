import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  writeBatch,
  orderBy,
  query,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Product, Order, OrderStatus, TeamLead } from '../../types/store';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';

const COLLECTIONS = {
  PRODUCTS: 'kelme_products',
  ORDERS: 'kelme_orders',
  LEADS: 'kelme_team_leads',
  SUBSCRIBERS: 'kelme_subscribers',
  META: 'kelme_meta',
};

export const firebaseStoreService = {
  isConfigured: isFirebaseConfigured,

  // 1. Products & Inventory
  async fetchProducts(): Promise<Product[] | null> {
    if (!isFirebaseConfigured() || !db) return null;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      if (snap.empty) return null;
      return snap.docs.map((d) => d.data() as Product);
    } catch (e) {
      console.error('Firebase fetchProducts error:', e);
      return null;
    }
  },

  async seedProducts(products: Product[] = INITIAL_PRODUCTS): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const batch = writeBatch(db);
      for (const p of products) {
        const ref = doc(db, COLLECTIONS.PRODUCTS, p.id);
        batch.set(ref, {
          ...p,
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
      return true;
    } catch (e) {
      console.error('Firebase seedProducts error:', e);
      return false;
    }
  },

  async updateProductInFirestore(product: Product): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      await setDoc(
        doc(db, COLLECTIONS.PRODUCTS, product.id),
        {
          ...product,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (e) {
      console.error('Firebase updateProduct error:', e);
      return false;
    }
  },

  // 2. Orders
  async saveOrderToFirestore(order: Order): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), {
        ...order,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      console.error('Firebase saveOrder error:', e);
      return false;
    }
  },

  async getOrderFromFirestore(orderId: string): Promise<Order | null> {
    if (!isFirebaseConfigured() || !db) return null;
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
      return snap.exists() ? (snap.data() as Order) : null;
    } catch (e) {
      console.error('Firebase getOrder error:', e);
      return null;
    }
  },

  async fetchAllOrders(): Promise<Order[] | null> {
    if (!isFirebaseConfigured() || !db) return null;
    try {
      const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as Order);
    } catch (e) {
      console.error('Firebase fetchAllOrders error:', e);
      return null;
    }
  },

  async updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
        status,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      console.error('Firebase updateOrderStatus error:', e);
      return false;
    }
  },

  // 3. Reservations
  async getReservationsFromFirestore(version: string): Promise<Record<string, number> | null> {
    if (!isFirebaseConfigured() || !db) return null;
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.META, `reserved_${version}`));
      return snap.exists() ? (snap.data().map as Record<string, number>) || {} : {};
    } catch {
      return null;
    }
  },

  async setReservationsInFirestore(version: string, map: Record<string, number>): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      await setDoc(doc(db, COLLECTIONS.META, `reserved_${version}`), {
        map,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch {
      return false;
    }
  },

  // 4. B2B Team Kit Leads & Newsletter
  async saveTeamLeadToFirestore(lead: TeamLead): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      await setDoc(doc(db, COLLECTIONS.LEADS, lead.id), lead);
      return true;
    } catch (e) {
      console.error('Firebase saveTeamLead error:', e);
      return false;
    }
  },

  async fetchTeamLeads(): Promise<TeamLead[] | null> {
    if (!isFirebaseConfigured() || !db) return null;
    try {
      const q = query(collection(db, COLLECTIONS.LEADS), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as TeamLead);
    } catch {
      return null;
    }
  },

  async saveSubscriberToFirestore(email: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const id = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await setDoc(doc(db, COLLECTIONS.SUBSCRIBERS, id), {
        email,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch {
      return false;
    }
  },
};
