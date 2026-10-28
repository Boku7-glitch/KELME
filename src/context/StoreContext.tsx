'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  Product,
  CartItem,
  FilterCategoryKey,
  Order,
  TeamLead,
} from '../types/store';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { firebaseStoreService } from '../lib/firebase/service';

export type ActiveView =
  | 'home'
  | 'collection'
  | 'product'
  | 'checkout'
  | 'order-ok'
  | 'team'
  | 'store'
  | 'info';

export type InfoKey = 'sizes' | 'order' | 'returns' | 'privacy' | 'terms';

interface StoreContextType {
  products: Product[];
  byId: Record<string, Product>;
  modelsMap: Record<string, string[]>;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartFullTotal: number;
  cartSavings: number;
  addToCart: (id: string, size: string, openDrawer?: boolean) => boolean;
  updateCartQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  // Overlays & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProductId: string | null;
  setQuickViewProductId: (id: string | null) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;

  // View & Routing state
  activeView: ActiveView;
  activeCategory: FilterCategoryKey;
  selectedSizeFilter: string;
  setSelectedSizeFilter: (sz: string) => void;
  selectedSort: 'rec' | 'disc' | 'asc' | 'desc';
  setSelectedSort: (s: 'rec' | 'disc' | 'asc' | 'desc') => void;
  activeProductId: string | null;
  activeOrderId: string | null;
  lastOrderDetails: Order | null;
  setLastOrderDetails: (order: Order | null) => void;
  activeInfoKey: InfoKey;

  // Navigation helpers
  navigateHome: () => void;
  navigateToCategory: (cat: FilterCategoryKey, scrollToShop?: boolean) => void;
  navigateToProduct: (id: string) => void;
  navigateToCheckout: () => void;
  navigateToOrderOk: (orderId: string, orderObj?: Order) => void;
  navigateToTeam: () => void;
  navigateToStore: () => void;
  navigateToInfo: (key: InfoKey) => void;

  // Admin & Firebase Sync
  isFirebaseConnected: boolean;
  updateProductStock: (productId: string, size: string, qty: number) => Promise<void>;
  updateProductPrice: (productId: string, price: number, sale: number) => Promise<void>;
  seedFirestoreCatalog: () => Promise<boolean>;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const totalStockOf = (p: Product): number =>
  Object.values(p.sizes || {}).reduce((sum, q) => sum + Number(q || 0), 0);

export const formatMoney = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return (Number.isInteger(v) ? v.toString() : v.toFixed(2)) + ' ₾';
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Navigation state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeCategory, setActiveCategory] = useState<FilterCategoryKey>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<'rec' | 'disc' | 'asc' | 'desc'>('rec');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [lastOrderDetails, setLastOrderDetails] = useState<Order | null>(null);
  const [activeInfoKey, setActiveInfoKey] = useState<InfoKey>('sizes');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const isFirebaseConnected = firebaseStoreService.isConfigured();

  // Hydrate Cart & Products from localStorage + Firebase Firestore
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kelme_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
      const savedProducts = localStorage.getItem('kelme_products_override');
      if (savedProducts) {
        const parsedP = JSON.parse(savedProducts);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          setProducts(parsedP);
        }
      }
    } catch {}
    setIsHydrated(true);

    // Check URL query for order redirect (e.g. ?orderOk=KG...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const okId = params.get('orderOk');
      if (okId) {
        setActiveOrderId(okId);
        setActiveView('order-ok');
      }
    }

    // If Firebase is configured, fetch live catalog from Firestore
    if (firebaseStoreService.isConfigured()) {
      firebaseStoreService.fetchProducts().then((fbList) => {
        if (fbList && fbList.length > 0) {
          setProducts(fbList);
        }
      });
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('kelme_cart', JSON.stringify(cart));
    } catch {}
  }, [cart, isHydrated]);

  const byId = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );

  const modelsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const p of products) {
      const key = p.model.toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(p.id);
    }
    return map;
  }, [products]);

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.q, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const p = byId[item.id];
        return acc + (p ? p.sale * item.q : 0);
      }, 0),
    [cart, byId]
  );

  const cartFullTotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const p = byId[item.id];
        return acc + (p ? p.price * item.q : 0);
      }, 0),
    [cart, byId]
  );

  const cartSavings = useMemo(
    () => Math.max(0, Math.round((cartFullTotal - cartSubtotal) * 100) / 100),
    [cartFullTotal, cartSubtotal]
  );

  const addToCart = useCallback(
    (id: string, size: string, openDrawer = true): boolean => {
      const p = byId[id];
      if (!p) return false;
      const maxStock = p.sizes[size] || 0;
      if (maxStock <= 0) {
        showToast('ეს ზომა მარაგში აღარ არის');
        return false;
      }

      let added = false;
      setCart((prev) => {
        const idx = prev.findIndex((c) => c.id === id && c.size === size);
        if (idx > -1) {
          if (prev[idx].q >= maxStock) {
            showToast(`ამ ზომაზე (${size}) მარაგში მხოლოდ ${maxStock} წყვილია`);
            return prev;
          }
          added = true;
          const copy = [...prev];
          copy[idx] = { ...copy[idx], q: copy[idx].q + 1 };
          return copy;
        }
        added = true;
        return [...prev, { id, size, q: 1 }];
      });

      if (openDrawer) {
        setQuickViewProductId(null);
        setIsCartOpen(true);
      } else if (added) {
        showToast(`${p.model} (ზომა ${size}) დაემატა კალათაში`);
      }
      return true;
    },
    [byId, showToast]
  );

  const updateCartQuantity = useCallback(
    (index: number, delta: number) => {
      setCart((prev) => {
        const item = prev[index];
        if (!item) return prev;
        const p = byId[item.id];
        const maxStock = p?.sizes[item.size] || 1;
        const nextQ = item.q + delta;
        if (nextQ <= 0) {
          return prev.filter((_, i) => i !== index);
        }
        if (nextQ > maxStock) {
          showToast(`ამ ზომაზე მეტი მარაგი არ არის (მაქს. ${maxStock})`);
          return prev;
        }
        const copy = [...prev];
        copy[index] = { ...item, q: nextQ };
        return copy;
      });
    },
    [byId, showToast]
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const closeAllOverlays = useCallback(() => {
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setQuickViewProductId(null);
  }, []);

  const navigateHome = useCallback(() => {
    closeAllOverlays();
    setActiveView('home');
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeAllOverlays]);

  const navigateToCategory = useCallback(
    (cat: FilterCategoryKey, scrollToShop = false) => {
      closeAllOverlays();
      setActiveCategory(cat);
      if (scrollToShop && activeView === 'home') {
        const el = document.getElementById('shop-catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      setActiveView('collection');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [closeAllOverlays, activeView]
  );

  const navigateToProduct = useCallback(
    (id: string) => {
      closeAllOverlays();
      setActiveProductId(id);
      setActiveView('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [closeAllOverlays]
  );

  const navigateToCheckout = useCallback(() => {
    closeAllOverlays();
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeAllOverlays]);

  const navigateToOrderOk = useCallback(
    (orderId: string, orderObj?: Order) => {
      closeAllOverlays();
      setActiveOrderId(orderId);
      if (orderObj) setLastOrderDetails(orderObj);
      setActiveView('order-ok');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [closeAllOverlays]
  );

  const navigateToTeam = useCallback(() => {
    closeAllOverlays();
    setActiveView('team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeAllOverlays]);

  const navigateToStore = useCallback(() => {
    closeAllOverlays();
    setActiveView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeAllOverlays]);

  const navigateToInfo = useCallback(
    (key: InfoKey) => {
      closeAllOverlays();
      setActiveInfoKey(key);
      setActiveView('info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [closeAllOverlays]
  );

  // Admin inventory updates
  const updateProductStock = useCallback(
    async (productId: string, size: string, qty: number) => {
      let updatedProduct: Product | null = null;
      setProducts((prev) => {
        const next = prev.map((p) => {
          if (p.id !== productId) return p;
          const nextSizes = { ...p.sizes };
          if (qty <= 0) {
            delete nextSizes[size];
          } else {
            nextSizes[size] = qty;
          }
          updatedProduct = { ...p, sizes: nextSizes };
          return updatedProduct;
        });
        try {
          localStorage.setItem('kelme_products_override', JSON.stringify(next));
        } catch {}
        return next;
      });
      if (updatedProduct && firebaseStoreService.isConfigured()) {
        await firebaseStoreService.updateProductInFirestore(updatedProduct);
      }
    },
    []
  );

  const updateProductPrice = useCallback(
    async (productId: string, price: number, sale: number) => {
      let updatedProduct: Product | null = null;
      const disc = sale < price ? Math.round((1 - sale / price) * 100) : 0;
      setProducts((prev) => {
        const next = prev.map((p) => {
          if (p.id !== productId) return p;
          updatedProduct = { ...p, price, sale, disc };
          return updatedProduct;
        });
        try {
          localStorage.setItem('kelme_products_override', JSON.stringify(next));
        } catch {}
        return next;
      });
      if (updatedProduct && firebaseStoreService.isConfigured()) {
        await firebaseStoreService.updateProductInFirestore(updatedProduct);
      }
    },
    []
  );

  const seedFirestoreCatalog = useCallback(async () => {
    const ok = await firebaseStoreService.seedProducts(products);
    if (ok) {
      showToast('✅ პროდუქციის მარაგი წარმატებით აიტვირთა Firebase Firestore-ში!');
    } else {
      showToast('⚠️ Firebase ჯერ არ არის კონფიგურირებული (.env.local). მონაცემები ინახება ლოკალურად.');
    }
    return ok;
  }, [products, showToast]);

  return (
    <StoreContext.Provider
      value={{
        products,
        byId,
        modelsMap,
        cart,
        cartCount,
        cartSubtotal,
        cartFullTotal,
        cartSavings,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProductId,
        setQuickViewProductId,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        activeView,
        activeCategory,
        selectedSizeFilter,
        setSelectedSizeFilter,
        selectedSort,
        setSelectedSort,
        activeProductId,
        activeOrderId,
        lastOrderDetails,
        setLastOrderDetails,
        activeInfoKey,
        navigateHome,
        navigateToCategory,
        navigateToProduct,
        navigateToCheckout,
        navigateToOrderOk,
        navigateToTeam,
        navigateToStore,
        navigateToInfo,
        isFirebaseConnected,
        updateProductStock,
        updateProductPrice,
        seedFirestoreCatalog,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
