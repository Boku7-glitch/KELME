'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Users,
  Database,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  Minus,
} from 'lucide-react';
import {
  useStore,
  totalStockOf,
  formatMoney,
} from '../../context/StoreContext';
import {
  CATEGORIES,
  ORDER_STATUS_KA,
  SHOP_CONFIG,
} from '../../data/storeConfig';
import { Order, OrderStatus, TeamLead } from '../../types/store';

export default function KelmeAdminPage() {
  const {
    products,
    isFirebaseConnected,
    updateProductStock,
    updateProductPrice,
    seedFirestoreCatalog,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'inventory' | 'leads' | 'firebase'
  >('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<TeamLead[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const fetchOrdersAndLeads = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/order');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndLeads();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch('/api/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        showToast(`შეკვეთა ${orderId} განახლდა: ${ORDER_STATUS_KA[status]}`);
      }
    } catch {
      showToast('სტატუსის განახლება ვერ მოხერხდა');
    }
  };

  const filteredInventory = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = catFilter === 'all' || p.cat === catFilter;
      const matchesQ =
        !searchQuery.trim() ||
        `${p.model} ${p.color} ${p.id}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCat && matchesQ;
    });
  }, [products, catFilter, searchQuery]);

  const totalPairsInStock = useMemo(
    () => products.reduce((sum, p) => sum + totalStockOf(p), 0),
    [products]
  );

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#111214] flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-[#111214] text-white sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-[0.14em] text-white">
              KELME
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D7141E] text-white text-[11px] font-bold uppercase">
              Store Admin
            </span>
            <span className="hidden md:inline text-xs text-white/60">
              მარაგის, შეკვეთების და B2B მოთხოვნების მართვა
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={SHOP_CONFIG.academySisterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-sky-300 text-xs font-bold"
            >
              <span>ტფილისის აკადემია</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-[#111214] font-bold text-xs hover:bg-gray-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>მაღაზიაში დაბრუნება</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#1B1D20] border-t border-white/10">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-8 flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-[#D7141E] text-white bg-white/5'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#D7141E]" />
              <span>შეკვეთები ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'inventory'
                  ? 'border-[#D7141E] text-white bg-white/5'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>
                მარაგი & ფასები ({products.length} მოდელი · {totalPairsInStock}{' '}
                წყვილი)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'leads'
                  ? 'border-[#D7141E] text-white bg-white/5'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>გუნდური ფორმები B2B ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('firebase')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'firebase'
                  ? 'border-[#D7141E] text-white bg-white/5'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Firebase & Excel სინქრონიზაცია</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6">
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-black text-2xl">შემოსული შეკვეთები</h1>
                <p className="text-xs text-[#6B6F76]">
                  ონლაინ დაჯავშნილი ზომები და მიწოდების მოთხოვნები
                </p>
              </div>
              <button
                type="button"
                onClick={fetchOrdersAndLeads}
                className="h-9 px-4 rounded-xl bg-white border border-[#E6E6E3] text-xs font-bold inline-flex items-center gap-1.5 hover:border-[#111214]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>განახლება</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E6E6E3] text-sm text-[#6B6F76]">
                იტვირთება შეკვეთები…
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E6E6E3] text-sm text-[#6B6F76]">
                შეკვეთები ჯერ არ არის
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-2xl border border-[#E6E6E3] p-5 sm:p-6 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E6E6E3]">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-base">
                            {o.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4F4F1]">
                            {ORDER_STATUS_KA[o.status] || o.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#6B6F76] mt-1">
                          {new Date(o.createdAt).toLocaleString('ka-GE')} ·{' '}
                          <strong>{o.customer.name}</strong> ·{' '}
                          <a
                            href={`tel:${o.customer.phone}`}
                            className="underline font-mono text-[#111214]"
                          >
                            {o.customer.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(
                              o.id,
                              e.target.value as OrderStatus
                            )
                          }
                          aria-label="შეკვეთის სტატუსი"
                          className="h-9 rounded-xl border border-[#E6E6E3] px-3 text-xs font-bold bg-[#F4F4F1]"
                        >
                          {Object.entries(ORDER_STATUS_KA).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <div className="text-right">
                          <div className="text-xs text-[#6B6F76]">ჯამი</div>
                          <div className="font-black text-lg text-[#D7141E]">
                            {formatMoney(o.total)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                      <div className="space-y-2">
                        <div className="font-bold text-[#6B6F76] uppercase">
                          შეკვეთილი მოდელები:
                        </div>
                        {o.lines.map((l, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-[#F4F4F1] px-3 py-2 rounded-lg"
                          >
                            <span>
                              <strong>{l.model}</strong> ({l.color}) · ზომა{' '}
                              <strong>{l.size}</strong> × {l.q}
                            </span>
                            <span className="font-bold">
                              {formatMoney(l.total)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5 text-[#3B3E44]">
                        <div>
                          <strong>მიღება:</strong>{' '}
                          {o.ship === 'pickup'
                            ? 'აღება ისთ ფოინთიდან (Sport Avenue)'
                            : `მიწოდება: ${o.city || ''}, ${o.address || ''}`}
                        </div>
                        <div>
                          <strong>გადახდა:</strong>{' '}
                          {o.pay === 'card'
                            ? 'ონლაინ ბარათით'
                            : 'მაღაზიაში / მიღებისას'}
                        </div>
                        {o.note && (
                          <div>
                            <strong>კომენტარი:</strong> {o.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E6E6E3] flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#6B6F76] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ძებნა კოდით, მოდელით ან ფერით..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E6E6E3] text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  aria-label="კატეგორია"
                  className="h-10 rounded-xl border border-[#E6E6E3] px-3 text-xs font-bold bg-white"
                >
                  <option value="all">ყველა კატეგორია</option>
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.title}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={seedFirestoreCatalog}
                  className="h-10 px-4 rounded-xl bg-[#111214] text-white text-xs font-bold cursor-pointer"
                >
                  Firebase-ში სინქრონიზაცია
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInventory.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#E6E6E3] p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={p.img}
                      alt={p.model}
                      className="w-16 h-16 rounded-xl bg-[#F4F4F1] p-1.5 object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#6B6F76]">
                          {p.id}
                        </span>
                        <span className="text-xs font-bold text-[#12784A]">
                          სულ: {totalStockOf(p)} წყვილი
                        </span>
                      </div>
                      <h3 className="font-black text-base truncate">
                        {p.model}
                      </h3>
                      <div className="text-xs text-[#6B6F76]">{p.color}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-base text-[#D7141E]">
                        {formatMoney(p.sale)}
                      </div>
                      {p.disc > 0 && (
                        <del className="text-xs text-[#6B6F76]">
                          {formatMoney(p.price)}
                        </del>
                      )}
                    </div>
                  </div>

                  {/* Sizes Stock Editor */}
                  <div className="pt-2 border-t border-[#E6E6E3]">
                    <div className="text-[11px] font-bold text-[#6B6F76] mb-1.5">
                      ზომების მარაგი (დააკლიკეთ + / − შესაცვლელად):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(p.sizes).map(([sz, qty]) => (
                        <div
                          key={sz}
                          className="inline-flex items-center gap-1 bg-[#F4F4F1] rounded-lg px-2 py-1 text-xs"
                        >
                          <span className="font-bold">{sz}:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateProductStock(p.id, sz, Math.max(0, qty - 1))
                            }
                            className="w-4 h-4 rounded bg-white grid place-items-center hover:bg-red-50"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono font-black min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateProductStock(p.id, sz, qty + 1)
                            }
                            className="w-4 h-4 rounded bg-white grid place-items-center hover:bg-emerald-50"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: B2B LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h1 className="font-black text-2xl">
              გუნდური ფორმების მოთხოვნები (B2B)
            </h1>
            {leads.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl border border-[#E6E6E3] p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-base font-black">{l.org}</strong>
                  <span className="text-xs text-[#6B6F76]">
                    {new Date(l.createdAt).toLocaleString('ka-GE')}
                  </span>
                </div>
                <div className="text-xs text-[#3B3E44]">
                  საკონტაქტო პირი: <strong>{l.name}</strong> · ტელ:{' '}
                  <a href={`tel:${l.phone}`} className="underline font-mono">
                    {l.phone}
                  </a>{' '}
                  · რაოდენობა: <strong>{l.qty || '—'}</strong>
                </div>
                {l.note && (
                  <p className="text-xs bg-[#F4F4F1] p-3 rounded-xl">
                    {l.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FIREBASE & EXCEL */}
        {activeTab === 'firebase' && (
          <div className="bg-white rounded-2xl border border-[#E6E6E3] p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              {isFirebaseConnected ? (
                <CheckCircle2 className="w-7 h-7 text-[#12784A]" />
              ) : (
                <AlertCircle className="w-7 h-7 text-amber-500" />
              )}
              <div>
                <h2 className="font-black text-xl">
                  Firebase Firestore სტატუსი:{' '}
                  {isFirebaseConnected
                    ? 'დაკავშირებულია ✓'
                    : 'ლოკალური რეჟიმი (.env.local შესავსებია)'}
                </h2>
                <p className="text-xs text-[#6B6F76]">
                  პროექტი იყენებს იგივე Fullstack + Firebase არქიტექტურას, რაც{' '}
                  <strong>tbilisi-football-academy</strong>-ს აქვს.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F4F1] text-xs space-y-2 font-mono">
              <div># .env.local ფაილში ჩაწერეთ Firebase-ის გასაღებები:</div>
              <div>NEXT_PUBLIC_FIREBASE_API_KEY=...</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=...</div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={seedFirestoreCatalog}
                className="h-11 px-6 rounded-full bg-[#D7141E] text-white font-bold text-xs cursor-pointer"
              >
                30-ვე მოდელის ატვირთვა Firestore-ში
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
