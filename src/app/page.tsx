'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  RefreshCw,
  ArrowRight,
  Check,
  ChevronRight,
  Ruler,
  MessageCircle,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Phone,
  Clock,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import QuickViewDialog from '../components/QuickViewDialog';
import CartDrawer from '../components/CartDrawer';
import SearchOverlay from '../components/SearchOverlay';
import SizeGuideDialog from '../components/SizeGuideDialog';
import {
  useStore,
  totalStockOf,
  formatMoney,
} from '../context/StoreContext';
import {
  CATEGORIES,
  SHOP_CONFIG,
  ORDER_STATUS_KA,
  SIZE_GUIDE_DATA,
} from '../data/storeConfig';
import {
  CategoryKey,
  FilterCategoryKey,
  ShippingMethod,
  PaymentMethod,
} from '../types/store';

export default function KelmeStorePage() {
  const {
    products,
    byId,
    modelsMap,
    cart,
    cartSubtotal,
    cartSavings,
    addToCart,
    clearCart,
    activeView,
    activeCategory,
    selectedSizeFilter,
    setSelectedSizeFilter,
    selectedSort,
    setSelectedSort,
    activeProductId,
    activeOrderId,
    lastOrderDetails,
    activeInfoKey,
    navigateHome,
    navigateToCategory,
    navigateToProduct,
    navigateToCheckout,
    navigateToOrderOk,
    navigateToTeam,
    navigateToStore,
    navigateToInfo,
    setIsSizeGuideOpen,
    showToast,
  } = useStore();

  // Product Detail state
  const [pdpSelectedSize, setPdpSelectedSize] = useState<string>('');
  const [pdpError, setPdpError] = useState<string>('');

  // Checkout state
  const [shipMethod, setShipMethod] = useState<ShippingMethod>('pickup');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('store');
  const [ckSubmitting, setCkSubmitting] = useState(false);
  const [ckError, setCkError] = useState('');

  // Order OK live status
  const [liveOrderStatus, setLiveOrderStatus] = useState<string>('new');

  // B2B Lead form state
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  // Sync aria-invalid with :user-invalid on blur & input (Modern Web Guidance: validate-input-after-interaction)
  const syncInputAria = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const el = e.currentTarget;
    if (!el || typeof el.checkValidity !== 'function') return;
    const isValid = el.checkValidity();
    if (e.type === 'blur' || el.hasAttribute('aria-invalid')) {
      el.setAttribute('aria-invalid', isValid ? 'false' : 'true');
      el.classList.toggle('user-invalid-fallback', !isValid);
      el.classList.toggle('user-valid-fallback', isValid);
    }
  };

  // Reset PDP selected size when activeProductId changes
  useEffect(() => {
    if (!activeProductId) return;
    const p = byId[activeProductId];
    if (
      p &&
      selectedSizeFilter &&
      (p.sizes[selectedSizeFilter] || 0) > 0
    ) {
      setPdpSelectedSize(selectedSizeFilter);
    } else {
      setPdpSelectedSize('');
    }
    setPdpError('');
  }, [activeProductId, byId, selectedSizeFilter]);

  // Fetch order status on Order OK screen
  useEffect(() => {
    if (activeView !== 'order-ok' || !activeOrderId) return;
    fetch(`/api/order-status?id=${encodeURIComponent(activeOrderId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.status) setLiveOrderStatus(d.status);
      })
      .catch(() => {});
  }, [activeView, activeOrderId]);

  // All available EU sizes across catalog
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      Object.entries(p.sizes).forEach(([sz, q]) => {
        if (q > 0) set.add(sz);
      });
    });
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [products]);

  // Filtered & sorted products for Shop / Collection
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (totalStockOf(p) <= 0) return false;
      if (activeCategory === 'all') return true;
      if (activeCategory === 'sale') return p.disc > 0;
      return p.cat === activeCategory;
    });

    if (selectedSizeFilter) {
      list = list.filter((p) => (p.sizes[selectedSizeFilter] || 0) > 0);
    }

    const sorted = [...list];
    if (selectedSort === 'disc') {
      sorted.sort((a, b) => b.disc - a.disc);
    } else if (selectedSort === 'asc') {
      sorted.sort((a, b) => a.sale - b.sale);
    } else if (selectedSort === 'desc') {
      sorted.sort((a, b) => b.sale - a.sale);
    } else {
      sorted.sort(
        (a, b) =>
          Number(b.disc > 0) - Number(a.disc > 0) ||
          totalStockOf(b) - totalStockOf(a)
      );
    }
    return sorted;
  }, [products, activeCategory, selectedSizeFilter, selectedSort]);

  const filterChips: { key: FilterCategoryKey; label: string }[] = [
    { key: 'all', label: 'ყველა' },
    { key: 'sale', label: 'SALE −70%' },
    { key: 'football', label: 'ფეხბურთი' },
    { key: 'sport', label: 'სპორტი' },
    { key: 'casual', label: 'ყოველდღიური' },
    { key: 'kids', label: 'ბავშვები' },
  ];

  // Checkout Submit Handler
  const handleCheckoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCkError('');
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(':invalid');
      firstInvalid?.focus();
      setCkError('გთხოვთ შეავსოთ სავალდებულო ველები სწორად');
      return;
    }

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const city = String(fd.get('city') || '').trim();
    const address = String(fd.get('address') || '').trim();
    const note = String(fd.get('note') || '').trim();
    const website = String(fd.get('website') || '');

    if (shipMethod !== 'pickup' && (!city || address.length < 4)) {
      setCkError('მიწოდებისთვის აუცილებელია ქალაქის და მისამართის მითითება');
      return;
    }

    setCkSubmitting(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website,
          items: cart.map((c) => ({ id: c.id, size: c.size, q: c.q })),
          customer: { name, phone, email },
          ship: shipMethod,
          city,
          address,
          pay: payMethod,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCkError(data.error || 'შეკვეთის გაფორმება ვერ მოხერხდა');
        setCkSubmitting(false);
        return;
      }

      if (data.redirect) {
        clearCart();
        window.location.href = data.redirect;
        return;
      }

      clearCart();
      navigateToOrderOk(data.orderId, data.order);
    } catch {
      setCkError('კავშირის შეცდომა. სცადეთ თავიდან.');
    } finally {
      setCkSubmitting(false);
    }
  };

  // B2B Lead Submit Handler
  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.querySelector<HTMLElement>(':invalid')?.focus();
      return;
    }
    const fd = new FormData(form);
    setLeadSubmitting(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          website: fd.get('website') || '',
          org: fd.get('org') || '',
          name: fd.get('name') || '',
          phone: fd.get('phone') || '',
          qty: fd.get('qty') || '',
          note: fd.get('note') || '',
        }),
      });
      if (res.ok) {
        form.reset();
        showToast('✅ მოთხოვნა მიღებულია! ჩვენი მენეჯერი მალე დაგიკავშირდებათ.');
      } else {
        const d = await res.json().catch(() => ({}));
        showToast(d.error || 'შეავსეთ სავალდებულო ველები');
      }
    } catch {
      showToast('შეცდომა გაგზავნისას');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const heroRetrobasket = byId['17500-73'] || products[0];
  const heroMadrid = byId['46976-1604'] || products[0];
  const heroHeritage = byId['55147-3'] || products[0];

  const deliveryFee =
    shipMethod === 'pickup'
      ? 0
      : SHOP_CONFIG.delivery.freeFrom &&
          cartSubtotal >= SHOP_CONFIG.delivery.freeFrom
        ? 0
        : shipMethod === 'tbilisi'
          ? SHOP_CONFIG.delivery.tbilisi
          : SHOP_CONFIG.delivery.regions;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <SearchOverlay />
      <QuickViewDialog />
      <SizeGuideDialog />

      <main className="flex-1">
        {/* =========================================================
            VIEW 1: HOME PAGE (HERO + CATEGORIES + SHOP + B2B + STORE)
            ========================================================= */}
        {activeView === 'home' && (
          <>
            {/* Split Athletic Hero Banner */}
            <section className="bg-[#F4F4F1] overflow-hidden border-b border-[#E6E6E3]">
              <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-center gap-8 min-h-[500px]">
                {/* Left Hero Copy */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#D7141E] text-white font-black text-xs tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm mb-4">
                    <span>SEASON SALE · KELME GEORGIA</span>
                  </div>
                  <h1 className="font-black text-4xl sm:text-6xl lg:text-[74px] leading-[0.96] tracking-tight text-[#111214]">
                    ფეხსაცმელი
                    <br />
                    <span className="text-[#D7141E]">−70%-მდე</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#3B3E44] max-w-lg mt-4 mb-7 leading-relaxed">
                    ფეხბურთის, ფუტსალის, სარბენი და ყოველდღიური KELME-ს
                    ორიგინალი ფეხსაცმელი. დაჯავშნე ონლაინ — მარაგი შეზღუდულია.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigateToCategory('sale', true)}
                      className="h-13 px-7 rounded-full bg-[#D7141E] hover:bg-[#B00F17] text-white font-bold text-sm inline-flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                    >
                      <span>ყიდვა ახლავე</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={navigateToTeam}
                      className="h-13 px-7 rounded-full border-2 border-[#111214] text-[#111214] hover:bg-[#111214] hover:text-white font-bold text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>გუნდური ფორმები (კლუბებს)</span>
                    </button>
                  </div>
                </div>

                {/* Right Hero Art with Cutout Shoe & Price Tag */}
                <div
                  onClick={() =>
                    heroRetrobasket && navigateToProduct(heroRetrobasket.id)
                  }
                  className="relative min-h-[320px] sm:min-h-[420px] flex items-center justify-center cursor-pointer group"
                >
                  <div className="w-[270px] sm:w-[390px] aspect-square rounded-full bg-[#D7141E] transition-transform duration-500 group-hover:scale-105" />
                  {/* LCP Candidate Image with fetchPriority="high" (Modern Web Guidance: optimize-image-priority) */}
                  <img
                    src="/cut/17500-73.webp"
                    alt="KELME Retrobasket"
                    fetchPriority="high"
                    width={560}
                    height={560}
                    className="absolute w-[88%] max-w-[520px] -rotate-12 drop-shadow-[0_28px_28px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:-rotate-8 group-hover:scale-105"
                  />
                  {heroRetrobasket && (
                    <div className="absolute left-2 sm:left-6 bottom-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E6E6E3]">
                      <div className="text-xs text-[#6B6F76] font-semibold">
                        {heroRetrobasket.model} · ყოველდღიური
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <strong className="font-black text-xl text-[#D7141E]">
                          {formatMoney(heroRetrobasket.sale)}
                        </strong>
                        <del className="text-xs text-[#6B6F76]">
                          {formatMoney(heroRetrobasket.price)}
                        </del>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Category Showcase Tiles */}
            <section className="py-14 max-w-[1380px] mx-auto px-4 sm:px-8">
              <div className="flex items-end justify-between mb-6 gap-4">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#6B6F76]">
                    კატალოგი
                  </div>
                  <h2 className="font-black text-2xl sm:text-3xl text-[#111214] mt-0.5">
                    აირჩიე კატეგორია
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToCategory('all')}
                  className="text-sm font-bold border-b-2 border-[#111214] pb-0.5 hover:text-[#D7141E] hover:border-[#D7141E] transition-colors"
                >
                  ყველა მოდელი ({products.length})
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.keys(CATEGORIES) as CategoryKey[]).map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const count = products.filter((p) => p.cat === catKey).length;
                  return (
                    <div
                      key={catKey}
                      onClick={() => navigateToCategory(catKey, true)}
                      style={{ backgroundColor: cat.color }}
                      className="group relative rounded-2xl aspect-[4/4.8] p-5 flex flex-col justify-end overflow-hidden cursor-pointer text-white shadow-sm"
                    >
                      <img
                        src={`/cut/${cat.heroProductId}.webp`}
                        alt={cat.title}
                        loading="lazy"
                        width={420}
                        height={420}
                        className="absolute inset-x-4 top-[12%] w-[86%] mx-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.28)] -rotate-6 transition-transform duration-400 group-hover:scale-108 group-hover:-rotate-10"
                      />
                      <div className="relative z-10 flex items-end justify-between gap-2">
                        <div>
                          <h3 className="font-black text-lg sm:text-xl leading-tight">
                            {cat.title}
                          </h3>
                          <span className="text-xs text-white/85 font-medium block mt-0.5">
                            {cat.desc} · {count} მოდელი
                          </span>
                        </div>
                        <span className="w-9 h-9 rounded-full bg-white text-[#111214] hidden sm:grid place-items-center font-black shrink-0 group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Main Interactive Shop Grid */}
            <section
              id="shop-catalog"
              className="py-6 max-w-[1380px] mx-auto px-4 sm:px-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <h2 className="font-black text-2xl sm:text-3xl text-[#111214]">
                  {activeCategory === 'all'
                    ? 'ყველა ფეხსაცმელი'
                    : activeCategory === 'sale'
                      ? 'ფასდაკლება (Outlet)'
                      : CATEGORIES[activeCategory]?.title}
                </h2>
                <div className="text-xs font-semibold text-[#6B6F76]">
                  ნაჩვენებია {filteredProducts.length} მოდელი
                  {selectedSizeFilter ? ` · ზომა EU ${selectedSizeFilter}` : ''}
                </div>
              </div>

              {/* Sticky Filter & Sort Toolbar */}
              <div className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-md py-3 border-b border-[#E6E6E3] mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {filterChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => {
                        setSelectedSizeFilter('');
                        navigateToCategory(chip.key, true);
                      }}
                      className={`h-9 px-4 rounded-full text-xs sm:text-sm font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        activeCategory === chip.key
                          ? 'bg-[#111214] text-white border-[#111214]'
                          : 'bg-white text-[#111214] border-[#E6E6E3] hover:border-[#111214]'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                  <select
                    value={selectedSizeFilter}
                    onChange={(e) => setSelectedSizeFilter(e.target.value)}
                    aria-label="ზომის ფილტრი"
                    className="h-9 rounded-full border border-[#E6E6E3] px-3.5 text-xs sm:text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="">ყველა ზომა</option>
                    {allSizes.map((sz) => (
                      <option key={sz} value={sz}>
                        ზომა {sz}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSort}
                    onChange={(e) =>
                      setSelectedSort(
                        e.target.value as 'rec' | 'disc' | 'asc' | 'desc'
                      )
                    }
                    aria-label="დალაგება"
                    className="h-9 rounded-full border border-[#E6E6E3] px-3.5 text-xs sm:text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="rec">რეკომენდებული</option>
                    <option value="disc">ყველაზე დიდი ფასდაკლება</option>
                    <option value="asc">ფასი: იაფიდან</option>
                    <option value="desc">ფასი: ძვირიდან</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-[#F4F4F1] rounded-2xl">
                  <p className="text-[#6B6F76] font-medium">
                    ამ ზომაზე ამ კატეგორიაში მარაგი არ არის
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSizeFilter('');
                      navigateToCategory('all', true);
                    }}
                    className="mt-3 underline font-bold text-sm"
                  >
                    ფილტრის გასუფთავება
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>

            {/* Dual B2B Team Kits & Tfilisi Academy Sister Banner */}
            <section className="py-14 max-w-[1380px] mx-auto px-4 sm:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
                {/* Club & Academy Team Kits Banner */}
                <div className="relative rounded-2xl bg-[#111214] text-white p-8 sm:p-10 min-h-[320px] flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10 max-w-md">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>კლუბებს · სკოლებს · ტფილისის აკადემიას</span>
                    </span>
                    <h3 className="font-black text-2xl sm:text-3xl leading-tight">
                      გუნდური ფორმები და ეკიპირება KELME-სგან
                    </h3>
                    <p className="text-sm text-white/80 mt-3 leading-relaxed">
                      სათამაშო ფორმა, ბუცი და სავარჯიშო ინვენტარი ერთ შეკვეთაში.
                      ნომრების და კლუბის ლოგოს ბეჭდვა — ჩვენთან. სპეციალური
                      საბითუმო ფასი 10+ კომპლექტზე.
                    </p>
                  </div>
                  <div className="relative z-10 flex flex-wrap gap-3 mt-6">
                    <button
                      type="button"
                      onClick={navigateToTeam}
                      className="h-11 px-6 rounded-full bg-white text-[#111214] font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      მოითხოვე შეთავაზება
                    </button>
                    <a
                      href={SHOP_CONFIG.academySisterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-5 rounded-full border border-white/30 text-white hover:bg-white/10 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>საფეხბურთო აკადემია ტფილისი</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <img
                    src="/cut/55904-1061.webp"
                    alt=""
                    loading="lazy"
                    className="hidden sm:block absolute -right-6 bottom-2 w-[240px] opacity-30 -rotate-12 pointer-events-none"
                  />
                </div>

                {/* Size Help / Messenger Banner */}
                <div className="relative rounded-2xl bg-[#D7141E] text-white p-8 sm:p-10 min-h-[320px] flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10 max-w-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-2">
                      სწრაფი კონსულტაცია
                    </span>
                    <h3 className="font-black text-2xl sm:text-3xl leading-tight">
                      არ იცი რომელი ზომაა?
                    </h3>
                    <p className="text-sm text-white/90 mt-3 leading-relaxed">
                      მოგვწერე მოდელი და შენი ჩვეული ზომა ან ტერფის სიგრძე —
                      ზუსტად შეგირჩევთ და გადაგიდებთ მაღაზიაში.
                    </p>
                  </div>
                  <div className="relative z-10 flex flex-wrap gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="h-11 px-6 rounded-full bg-white text-[#D7141E] font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ruler className="w-4 h-4" />
                      <span>ზომების ცხრილი</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        showToast('გაიხსნება KELME საქართველოს Messenger ჩატი')
                      }
                      className="h-11 px-5 rounded-full border border-white/40 text-white hover:bg-white/10 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Messenger</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Store Info Section */}
            <section className="pb-12 max-w-[1380px] mx-auto px-4 sm:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E6E6E3] p-7 sm:p-9 bg-white">
                  <h3 className="font-black text-2xl text-[#111214]">
                    KELME · ისთ ფოინთი
                  </h3>
                  <p className="text-sm text-[#6B6F76] mt-1">
                    Sport Avenue, სავაჭრო ცენტრი East Point
                  </p>
                  <dl className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 mt-6 text-sm">
                    <dt className="text-[#6B6F76]">მისამართი</dt>
                    <dd className="font-semibold text-[#111214]">
                      {SHOP_CONFIG.address}
                    </dd>
                    <dt className="text-[#6B6F76]">სამუშაო საათი</dt>
                    <dd className="font-semibold text-[#111214]">
                      {SHOP_CONFIG.hours}
                    </dd>
                    <dt className="text-[#6B6F76]">ტელეფონი</dt>
                    <dd className="font-semibold text-[#111214]">
                      <a href={`tel:${SHOP_CONFIG.phone}`} className="underline">
                        {SHOP_CONFIG.phone}
                      </a>
                    </dd>
                    <dt className="text-[#6B6F76]">მიმოწერა</dt>
                    <dd className="font-semibold text-[#111214]">
                      Messenger · Instagram Direct
                    </dd>
                  </dl>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#E9ECE6] to-[#F6F6F3] border border-[#E6E6E3] min-h-[260px] relative flex items-center justify-center overflow-hidden p-6">
                  <div className="bg-[#D7141E] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>KELME · East Point (Sport Avenue)</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =========================================================
            VIEW 2: COLLECTION PAGE
            ========================================================= */}
        {activeView === 'collection' && (
          <section className="py-10 max-w-[1380px] mx-auto px-4 sm:px-8">
            <div className="mb-6">
              <div className="text-xs text-[#6B6F76] mb-1">
                <button
                  type="button"
                  onClick={navigateHome}
                  className="hover:underline"
                >
                  მთავარი
                </button>{' '}
                / <span>კატალოგი</span>
              </div>
              <h1 className="font-black text-3xl sm:text-4xl text-[#111214]">
                {activeCategory === 'all'
                  ? 'ყველა პროდუქტი'
                  : activeCategory === 'sale'
                    ? 'Outlet · ფასდაკლება −70%-მდე'
                    : CATEGORIES[activeCategory]?.title}
              </h1>
            </div>

            <div className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-md py-3 border-b border-[#E6E6E3] mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {filterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => navigateToCategory(chip.key)}
                    className={`h-9 px-4 rounded-full text-xs sm:text-sm font-bold border transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === chip.key
                        ? 'bg-[#111214] text-white border-[#111214]'
                        : 'bg-white text-[#111214] border-[#E6E6E3] hover:border-[#111214]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs font-bold text-[#6B6F76]">
                  {filteredProducts.length} მოდელი
                </span>
                <select
                  value={selectedSizeFilter}
                  onChange={(e) => setSelectedSizeFilter(e.target.value)}
                  aria-label="ზომა"
                  className="h-9 rounded-full border border-[#E6E6E3] px-3.5 text-xs font-semibold bg-white"
                >
                  <option value="">ზომა: ყველა</option>
                  {allSizes.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedSort}
                  onChange={(e) =>
                    setSelectedSort(
                      e.target.value as 'rec' | 'disc' | 'asc' | 'desc'
                    )
                  }
                  aria-label="დალაგება"
                  className="h-9 rounded-full border border-[#E6E6E3] px-3.5 text-xs font-semibold bg-white"
                >
                  <option value="rec">რეკომენდებული</option>
                  <option value="disc">ფასდაკლება</option>
                  <option value="asc">ფასი ↑</option>
                  <option value="desc">ფასი ↓</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-[#6B6F76]">
                ამ ზომაზე მარაგი არ არის.{' '}
                <button
                  type="button"
                  onClick={() => setSelectedSizeFilter('')}
                  className="underline font-bold text-[#111214]"
                >
                  ფილტრის მოხსნა
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            VIEW 3: PRODUCT DETAIL PAGE (PDP)
            ========================================================= */}
        {activeView === 'product' && activeProductId && byId[activeProductId] && (
          (() => {
            const p = byId[activeProductId];
            const siblings = modelsMap[p.model.toLowerCase()] || [p.id];
            const sizes = Array.from(
              new Set(siblings.flatMap((id) => Object.keys(byId[id]?.sizes || {})))
            ).sort((a, b) => Number(a) - Number(b));
            const related = products
              .filter((x) => x.cat === p.cat && x.model !== p.model)
              .sort((a, b) => b.disc - a.disc)
              .slice(0, 4);

            return (
              <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12">
                  {/* Left 3-Panel Gallery */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 aspect-square rounded-2xl bg-[#F4F4F1] p-8 flex items-center justify-center relative">
                      {p.disc > 0 && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#D7141E] text-white font-black text-sm">
                          −{p.disc}%
                        </span>
                      )}
                      <img
                        src={p.img}
                        alt={p.model}
                        fetchPriority="high"
                        className="w-full max-w-[480px] object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl bg-[#F4F4F1] p-6 flex items-center justify-center">
                      <img
                        src={`/cut/${p.id}.webp`}
                        alt=""
                        loading="lazy"
                        className="w-[85%] object-contain -rotate-8"
                      />
                    </div>
                    <div
                      style={{
                        backgroundColor:
                          CATEGORIES[p.cat]?.color || '#111214',
                      }}
                      className="aspect-square rounded-2xl p-6 flex items-center justify-center"
                    >
                      <img
                        src={`/cut/${p.id}.webp`}
                        alt=""
                        loading="lazy"
                        className="w-[82%] object-contain rotate-6 drop-shadow-[0_18px_22px_rgba(0,0,0,0.28)]"
                      />
                    </div>
                  </div>

                  {/* Right Product Info */}
                  <div className="lg:sticky lg:top-24 self-start">
                    <div className="text-xs text-[#6B6F76] mb-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={navigateHome}
                        className="hover:text-[#111214]"
                      >
                        მთავარი
                      </button>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <button
                        type="button"
                        onClick={() => navigateToCategory(p.cat)}
                        className="hover:text-[#111214]"
                      >
                        {CATEGORIES[p.cat]?.title}
                      </button>
                    </div>

                    <h1 className="font-black text-3xl sm:text-4xl text-[#111214] uppercase">
                      {p.model}
                    </h1>
                    <div className="text-sm text-[#6B6F76] mt-1">
                      {p.color} · კოდი <span className="font-mono">{p.id}</span>
                    </div>

                    <div className="flex items-baseline gap-3 mt-4">
                      {p.disc > 0 ? (
                        <>
                          <span className="font-black text-3xl text-[#D7141E]">
                            {formatMoney(p.sale)}
                          </span>
                          <del className="text-lg text-[#6B6F76]">
                            {formatMoney(p.price)}
                          </del>
                          <span className="px-2.5 py-1 rounded bg-red-50 text-[#D7141E] font-bold text-xs">
                            დაზოგე {formatMoney(p.price - p.sale)}
                          </span>
                        </>
                      ) : (
                        <span className="font-black text-3xl text-[#111214]">
                          {formatMoney(p.sale)}
                        </span>
                      )}
                    </div>

                    {/* Sibling Color Variants */}
                    {siblings.length > 1 && (
                      <div className="mt-6">
                        <div className="text-sm font-bold mb-2">
                          ფერი:{' '}
                          <span className="font-normal text-[#6B6F76]">
                            {p.color}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {siblings.map((sibId) => {
                            const sib = byId[sibId];
                            if (!sib) return null;
                            return (
                              <button
                                key={sibId}
                                type="button"
                                onClick={() => navigateToProduct(sibId)}
                                className={`w-16 h-16 rounded-xl bg-[#F4F4F1] p-1.5 border-2 transition-all cursor-pointer ${
                                  sibId === p.id
                                    ? 'border-[#111214]'
                                    : 'border-[#E6E6E3] hover:border-gray-400'
                                }`}
                              >
                                <img
                                  src={sib.img}
                                  alt={sib.color}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* EU Size Picker */}
                    <div className="mt-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-bold">ზომა (EU):</span>
                        <button
                          type="button"
                          onClick={() => setIsSizeGuideOpen(true)}
                          className="text-xs font-bold underline"
                        >
                          ზომების ცხრილი
                        </button>
                      </div>

                      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                        {sizes.map((sz) => {
                          const qty = p.sizes[sz] || 0;
                          const isSelected = pdpSelectedSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              disabled={qty <= 0}
                              onClick={() => {
                                setPdpSelectedSize(sz);
                                setPdpError('');
                              }}
                              className={`relative h-11 rounded-lg border text-sm font-bold transition-all cursor-pointer ${
                                qty <= 0
                                  ? 'size-btn-disabled border-[#E6E6E3]'
                                  : isSelected
                                    ? 'bg-[#111214] text-white border-[#111214]'
                                    : 'bg-white text-[#111214] border-[#E6E6E3] hover:border-[#111214]'
                              }`}
                            >
                              {sz}
                              {qty === 1 && (
                                <small className="absolute right-1 top-0.5 text-[9px] font-bold text-[#D7141E]">
                                  ბოლო
                                </small>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-[#F4F4F1] rounded-xl px-3.5 py-2.5 text-xs text-[#3B3E44] mt-3">
                        ზომა სტანდარტულია — აირჩიე შენი ჩვეული EU ზომა. მარაგშია{' '}
                        <strong>{totalStockOf(p)} წყვილი</strong>.
                      </div>

                      {pdpError && (
                        <div className="text-xs font-bold text-[#D7141E] mt-2">
                          {pdpError}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart & Messenger */}
                    <div className="mt-6 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!pdpSelectedSize) {
                            setPdpError('აირჩიე ზომა კალათაში დასამატებლად');
                            return;
                          }
                          addToCart(p.id, pdpSelectedSize, true);
                        }}
                        className="w-full h-13 rounded-full bg-[#111214] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          კალათაში დამატება
                          {pdpSelectedSize ? ` · ზომა ${pdpSelectedSize}` : ''}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            'აქ გაიხსნება KELME საქართველოს Messenger ჩატი'
                          )
                        }
                        className="w-full h-12 rounded-full border-2 border-[#111214] text-[#111214] hover:bg-[#111214] hover:text-white font-bold text-sm transition-colors cursor-pointer"
                      >
                        კითხვა ზომაზე? მოგვწერე
                      </button>
                    </div>

                    {/* Accordion Details */}
                    <div className="mt-7 border-t border-[#E6E6E3] divide-y divide-[#E6E6E3] text-sm">
                      <details className="py-3.5 group" open>
                        <summary className="font-bold uppercase text-xs tracking-wider cursor-pointer list-none flex justify-between">
                          <span>აღწერა და მახასიათებლები</span>
                          <span>+</span>
                        </summary>
                        <p className="text-xs text-[#6B6F76] mt-2 leading-relaxed">
                          KELME {p.model} — {CATEGORIES[p.cat]?.desc}. ფერი:{' '}
                          {p.color}. ოფიციალური იმპორტი, მაღალი გამძლეობის ძირი
                          და კომფორტული ერგონომიკა.
                        </p>
                      </details>
                      <details className="py-3.5 group">
                        <summary className="font-bold uppercase text-xs tracking-wider cursor-pointer list-none flex justify-between">
                          <span>აღება და მიწოდება</span>
                          <span>+</span>
                        </summary>
                        <p className="text-xs text-[#6B6F76] mt-2 leading-relaxed">
                          აღება მაღაზიიდან (ისთ ფოინთი, Sport Avenue) უფასოა
                          იმავე დღეს. მიწოდება თბილისში — 7 ₾ (200 ₾-დან უფასო),
                          რეგიონებში — 12 ₾.
                        </p>
                      </details>
                      <details className="py-3.5 group">
                        <summary className="font-bold uppercase text-xs tracking-wider cursor-pointer list-none flex justify-between">
                          <span>გაცვლა და დაბრუნება</span>
                          <span>+</span>
                        </summary>
                        <p className="text-xs text-[#6B6F76] mt-2 leading-relaxed">
                          ზომის გაცვლა შესაძლებელია მაღაზიაში, თუ ფეხსაცმელი
                          უხმარია და ყუთი/ეტიკეტი შენახულია.
                        </p>
                      </details>
                    </div>
                  </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                  <section className="mt-16 pt-10 border-t border-[#E6E6E3]">
                    <h2 className="font-black text-2xl mb-6">
                      შეიძლება მოგეწონოს
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {related.map((rel) => (
                        <ProductCard key={rel.id} product={rel} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            );
          })()
        )}

        {/* =========================================================
            VIEW 4: CHECKOUT PAGE
            ========================================================= */}
        {activeView === 'checkout' && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10">
            {cart.length === 0 ? (
              <div className="max-w-md mx-auto py-16 text-center space-y-4">
                <h1 className="font-black text-2xl">კალათა ცარიელია</h1>
                <p className="text-sm text-[#6B6F76]">
                  დაამატე სასურველი ფეხსაცმელი კალათაში და დაბრუნდი.
                </p>
                <button
                  type="button"
                  onClick={() => navigateToCategory('all')}
                  className="h-11 px-6 rounded-full bg-[#111214] text-white font-bold text-sm"
                >
                  მაღაზიაში დაბრუნება
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
                {/* Checkout Form */}
                <div>
                  <h1 className="font-black text-2xl sm:text-3xl mb-6">
                    შეკვეთის გაფორმება
                  </h1>

                  <form
                    onSubmit={handleCheckoutSubmit}
                    noValidate
                    className="space-y-6"
                  >
                    {/* Honeypot */}
                    <input
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ position: 'absolute', left: '-9999px' }}
                      aria-hidden="true"
                    />

                    <div>
                      <h2 className="font-bold text-base uppercase tracking-wider mb-3">
                        1. საკონტაქტო მონაცემები
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="kelme-field">
                          <label
                            htmlFor="ck-name"
                            className="block text-xs font-bold text-[#111214] mb-1"
                          >
                            სახელი, გვარი *
                          </label>
                          <span
                            id="ck-name-hint"
                            className="block text-[11px] text-[#6B6F76] mb-1"
                          >
                            მიუთითეთ მიმღების სრული სახელი
                          </span>
                          <input
                            id="ck-name"
                            name="name"
                            type="text"
                            required
                            minLength={2}
                            autoComplete="name"
                            aria-describedby="ck-name-hint"
                            aria-errormessage="ck-name-err"
                            onBlur={syncInputAria}
                            onInput={syncInputAria}
                            placeholder="მაგ. გიორგი ბერიძე"
                            className="w-full h-11 rounded-xl border border-[#E6E6E3] px-3.5 text-sm outline-hidden focus:border-[#111214]"
                          />
                          <div id="ck-name-err" className="error-msg">
                            <span aria-hidden="true">❌</span> გთხოვთ შეიყვანოთ
                            სახელი და გვარი.
                          </div>
                        </div>

                        <div className="kelme-field">
                          <label
                            htmlFor="ck-phone"
                            className="block text-xs font-bold text-[#111214] mb-1"
                          >
                            მობილურის ნომერი *
                          </label>
                          <span
                            id="ck-phone-hint"
                            className="block text-[11px] text-[#6B6F76] mb-1"
                          >
                            ფორმატი: 5XX XX XX XX
                          </span>
                          <input
                            id="ck-phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            required
                            autoComplete="tel"
                            pattern="^(\+?995)?\s?5\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$"
                            aria-describedby="ck-phone-hint"
                            aria-errormessage="ck-phone-err"
                            onBlur={syncInputAria}
                            onInput={syncInputAria}
                            placeholder="599 00 00 00"
                            className="w-full h-11 rounded-xl border border-[#E6E6E3] px-3.5 text-sm outline-hidden focus:border-[#111214]"
                          />
                          <div id="ck-phone-err" className="error-msg">
                            <span aria-hidden="true">❌</span> შეიყვანეთ ქართული
                            მობილურის ნომერი (5XX XX XX XX).
                          </div>
                        </div>

                        <div className="kelme-field sm:col-span-2">
                          <label
                            htmlFor="ck-email"
                            className="block text-xs font-bold text-[#111214] mb-1"
                          >
                            ელფოსტა (სურვილისამებრ)
                          </label>
                          <span
                            id="ck-email-hint"
                            className="block text-[11px] text-[#6B6F76] mb-1"
                          >
                            ფორმატი: name@example.com
                          </span>
                          <input
                            id="ck-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            aria-describedby="ck-email-hint"
                            aria-errormessage="ck-email-err"
                            onBlur={syncInputAria}
                            onInput={syncInputAria}
                            placeholder="you@example.com"
                            className="w-full h-11 rounded-xl border border-[#E6E6E3] px-3.5 text-sm outline-hidden focus:border-[#111214]"
                          />
                          <div id="ck-email-err" className="error-msg">
                            <span aria-hidden="true">❌</span> გთხოვთ შეიყვანოთ
                            სწორი ელფოსტის მისამართი.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h2 className="font-bold text-base uppercase tracking-wider mb-3">
                        2. მიღების მეთოდი
                      </h2>
                      <div className="space-y-2.5">
                        <label
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                            shipMethod === 'pickup'
                              ? 'border-[#111214] bg-[#F4F4F1]/60'
                              : 'border-[#E6E6E3]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="ship"
                            value="pickup"
                            checked={shipMethod === 'pickup'}
                            onChange={() => setShipMethod('pickup')}
                            className="mt-1 accent-[#111214]"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-sm">
                              აღება მაღაზიიდან (East Point)
                            </div>
                            <div className="text-xs text-[#6B6F76]">
                              Sport Avenue · ზომა დაგიჯავშნებათ იმავე დღეს
                            </div>
                          </div>
                          <span className="font-bold text-xs text-[#12784A]">
                            უფასო
                          </span>
                        </label>

                        <label
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                            shipMethod === 'tbilisi'
                              ? 'border-[#111214] bg-[#F4F4F1]/60'
                              : 'border-[#E6E6E3]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="ship"
                            value="tbilisi"
                            checked={shipMethod === 'tbilisi'}
                            onChange={() => setShipMethod('tbilisi')}
                            className="mt-1 accent-[#111214]"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-sm">
                              მიწოდება თბილისში
                            </div>
                            <div className="text-xs text-[#6B6F76]">
                              1–2 სამუშაო დღე (200 ₾-დან უფასო)
                            </div>
                          </div>
                          <span className="font-bold text-xs">
                            {cartSubtotal >= SHOP_CONFIG.delivery.freeFrom
                              ? 'უფასო'
                              : formatMoney(SHOP_CONFIG.delivery.tbilisi)}
                          </span>
                        </label>

                        <label
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                            shipMethod === 'regions'
                              ? 'border-[#111214] bg-[#F4F4F1]/60'
                              : 'border-[#E6E6E3]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="ship"
                            value="regions"
                            checked={shipMethod === 'regions'}
                            onChange={() => setShipMethod('regions')}
                            className="mt-1 accent-[#111214]"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-sm">
                              მიწოდება რეგიონებში
                            </div>
                            <div className="text-xs text-[#6B6F76]">
                              2–4 სამუშაო დღე (200 ₾-დან უფასო)
                            </div>
                          </div>
                          <span className="font-bold text-xs">
                            {cartSubtotal >= SHOP_CONFIG.delivery.freeFrom
                              ? 'უფასო'
                              : formatMoney(SHOP_CONFIG.delivery.regions)}
                          </span>
                        </label>
                      </div>

                      {shipMethod !== 'pickup' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 rounded-xl bg-[#F4F4F1]">
                          <div className="kelme-field">
                            <label
                              htmlFor="ck-city"
                              className="block text-xs font-bold mb-1"
                            >
                              ქალაქი *
                            </label>
                            <input
                              id="ck-city"
                              name="city"
                              type="text"
                              required
                              defaultValue={
                                shipMethod === 'tbilisi' ? 'თბილისი' : ''
                              }
                              placeholder="მაგ. თბილისი, ბათუმი..."
                              className="w-full h-10 rounded-lg border border-[#E6E6E3] bg-white px-3 text-sm"
                            />
                          </div>
                          <div className="kelme-field">
                            <label
                              htmlFor="ck-address"
                              className="block text-xs font-bold mb-1"
                            >
                              ზუსტი მისამართი *
                            </label>
                            <input
                              id="ck-address"
                              name="address"
                              type="text"
                              required
                              minLength={4}
                              placeholder="ქუჩა, ნომერი, სადარბაზო"
                              className="w-full h-10 rounded-lg border border-[#E6E6E3] bg-white px-3 text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h2 className="font-bold text-base uppercase tracking-wider mb-3">
                        3. გადახდის მეთოდი
                      </h2>
                      <div className="space-y-2.5">
                        <label
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                            payMethod === 'store'
                              ? 'border-[#111214] bg-[#F4F4F1]/60'
                              : 'border-[#E6E6E3]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="pay"
                            value="store"
                            checked={payMethod === 'store'}
                            onChange={() => setPayMethod('store')}
                            className="mt-1 accent-[#111214]"
                          />
                          <div>
                            <div className="font-bold text-sm">
                              გადახდა მაღაზიაში / მიღებისას
                            </div>
                            <div className="text-xs text-[#6B6F76]">
                              ნაღდი ანგარიშსწორებით ან საბანკო ტერმინალით
                            </div>
                          </div>
                        </label>

                        {SHOP_CONFIG.payment && (
                          <label
                            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                              payMethod === 'card'
                                ? 'border-[#111214] bg-[#F4F4F1]/60'
                                : 'border-[#E6E6E3]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pay"
                              value="card"
                              checked={payMethod === 'card'}
                              onChange={() => setPayMethod('card')}
                              className="mt-1 accent-[#111214]"
                            />
                            <div>
                              <div className="font-bold text-sm">
                                ბარათით ონლაინ (Visa / Mastercard / Apple Pay)
                              </div>
                              <div className="text-xs text-[#6B6F76]">
                                ბანკის დაცული გადახდის გვერდი
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="kelme-field">
                      <label
                        htmlFor="ck-note"
                        className="block text-xs font-bold mb-1"
                      >
                        კომენტარი (სურვილისამებრ)
                      </label>
                      <textarea
                        id="ck-note"
                        name="note"
                        rows={3}
                        placeholder="მაგ. რომელ საათზე მოხვალთ მაღაზიაში..."
                        className="w-full rounded-xl border border-[#E6E6E3] p-3.5 text-sm outline-hidden focus:border-[#111214]"
                      />
                    </div>

                    {ckError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-[#D7141E]">
                        {ckError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={ckSubmitting}
                      className="w-full h-13 rounded-full bg-[#D7141E] hover:bg-[#B00F17] disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                    >
                      {ckSubmitting
                        ? 'შეკვეთა მუშავდება…'
                        : `შეკვეთის დადასტურება · ${formatMoney(cartSubtotal + deliveryFee)}`}
                    </button>
                  </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="bg-[#F4F4F1] rounded-3xl p-6 sm:p-8 self-start border border-[#E6E6E3]">
                  <h3 className="font-black text-lg mb-4">
                    შეკვეთის შეჯამება
                  </h3>
                  <div className="space-y-3 divide-y divide-[#E6E6E3]">
                    {cart.map((c) => {
                      const p = byId[c.id];
                      if (!p) return null;
                      return (
                        <div
                          key={`${c.id}-${c.size}`}
                          className="pt-3 first:pt-0 grid grid-cols-[64px_1fr_auto] gap-3 items-center"
                        >
                          <div className="relative w-16 h-16 rounded-xl bg-white p-1.5 border border-[#E6E6E3]">
                            <img
                              src={p.img}
                              alt={p.model}
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#111214] text-white text-[10px] font-bold grid place-items-center">
                              {c.q}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-sm">{p.model}</div>
                            <div className="text-xs text-[#6B6F76]">
                              {p.color} · ზომა {c.size}
                            </div>
                          </div>
                          <div className="font-bold text-sm">
                            {formatMoney(p.sale * c.q)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E6E6E3] space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6B6F76]">პროდუქცია</span>
                      <span className="font-semibold">
                        {formatMoney(cartSubtotal)}
                      </span>
                    </div>
                    {cartSavings > 0 && (
                      <div className="flex justify-between text-[#12784A] font-bold">
                        <span>დაზოგე</span>
                        <span>−{formatMoney(cartSavings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#6B6F76]">მიწოდება</span>
                      <span className="font-semibold">
                        {deliveryFee ? formatMoney(deliveryFee) : 'უფასო'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-2 border-t border-[#E6E6E3]">
                      <span>სულ გადასახდელი</span>
                      <span>{formatMoney(cartSubtotal + deliveryFee)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            VIEW 5: ORDER CONFIRMATION (OK PAGE)
            ========================================================= */}
        {activeView === 'order-ok' && (
          <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#12784A] text-white grid place-items-center mx-auto mb-5 shadow-lg">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h1 className="font-black text-3xl text-[#111214]">
              მადლობა! შეკვეთა მიღებულია
            </h1>
            <p className="text-sm text-[#6B6F76] mt-2 leading-relaxed">
              შენი ზომა დაჯავშნილია. მენეჯერი დაგიკავშირდებათ დეტალების
              დასადასტურებლად.
            </p>

            <div className="bg-[#F4F4F1] rounded-2xl p-6 text-left mt-6 space-y-2.5 text-sm border border-[#E6E6E3]">
              <div className="flex justify-between">
                <span className="text-[#6B6F76]">შეკვეთის კოდი:</span>
                <strong className="font-mono text-[#111214]">
                  {activeOrderId}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6F76]">სტატუსი:</span>
                <strong className="text-[#12784A]">
                  {ORDER_STATUS_KA[liveOrderStatus] || liveOrderStatus}
                </strong>
              </div>
              {lastOrderDetails && (
                <div className="flex justify-between">
                  <span className="text-[#6B6F76]">ჯამური თანხა:</span>
                  <strong>{formatMoney(lastOrderDetails.total)}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6B6F76]">მისამართი:</span>
                <strong>ისთ ფოინთი, Sport Avenue</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={navigateHome}
              className="mt-7 h-12 px-8 rounded-full bg-[#111214] text-white font-bold text-sm"
            >
              მთავარ გვერდზე დაბრუნება
            </button>
          </div>
        )}

        {/* =========================================================
            VIEW 6: B2B TEAM KITS PAGE
            ========================================================= */}
        {activeView === 'team' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#D7141E] mb-1">
              B2B · კლუბებს და აკადემიებს
            </div>
            <h1 className="font-black text-3xl sm:text-4xl text-[#111214]">
              გუნდური ფორმები და ეკიპირება
            </h1>
            <p className="text-sm sm:text-base text-[#3B3E44] mt-3 leading-relaxed">
              KELME უზრუნველყოფს საფეხბურთო კლუბებს, სკოლებსა და{' '}
              <strong>საფეხბურთო აკადემია ტფილისს</strong> სრული სპორტული
              ეკიპირებით: სათამაშო და სავარჯიშო ფორმები, Turf/Indoor ბუცები და
              აქსესუარები. დაგვიტოვეთ საკონტაქტო მონაცემები და 1 სამუშაო დღეში
              მოგიმზადებთ ინდივიდუალურ შეთავაზებას.
            </p>

            <form
              onSubmit={handleLeadSubmit}
              noValidate
              className="mt-8 bg-[#F4F4F1] p-6 sm:p-8 rounded-3xl border border-[#E6E6E3] space-y-4"
            >
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px' }}
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="kelme-field">
                  <label className="block text-xs font-bold mb-1">
                    კლუბი / აკადემია / ორგანიზაცია *
                  </label>
                  <input
                    name="org"
                    required
                    onBlur={syncInputAria}
                    onInput={syncInputAria}
                    placeholder="მაგ. საფეხბურთო აკადემია ტფილისი"
                    className="w-full h-11 rounded-xl border border-[#E6E6E3] bg-white px-3.5 text-sm"
                  />
                  <div className="error-msg">❌ მიუთითეთ ორგანიზაცია</div>
                </div>
                <div className="kelme-field">
                  <label className="block text-xs font-bold mb-1">
                    საკონტაქტო პირი *
                  </label>
                  <input
                    name="name"
                    required
                    onBlur={syncInputAria}
                    onInput={syncInputAria}
                    placeholder="სახელი, გვარი"
                    className="w-full h-11 rounded-xl border border-[#E6E6E3] bg-white px-3.5 text-sm"
                  />
                  <div className="error-msg">❌ მიუთითეთ სახელი</div>
                </div>
                <div className="kelme-field">
                  <label className="block text-xs font-bold mb-1">
                    ტელეფონის ნომერი *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    onBlur={syncInputAria}
                    onInput={syncInputAria}
                    placeholder="5XX XX XX XX"
                    className="w-full h-11 rounded-xl border border-[#E6E6E3] bg-white px-3.5 text-sm"
                  />
                  <div className="error-msg">❌ მიუთითეთ ტელეფონი</div>
                </div>
                <div className="kelme-field">
                  <label className="block text-xs font-bold mb-1">
                    რაოდენობა (კომპლექტი)
                  </label>
                  <input
                    name="qty"
                    inputMode="numeric"
                    placeholder="მაგ. 25 კომპლექტი"
                    className="w-full h-11 rounded-xl border border-[#E6E6E3] bg-white px-3.5 text-sm"
                  />
                </div>
              </div>

              <div className="kelme-field">
                <label className="block text-xs font-bold mb-1">
                  რა გჭირდებათ? (ფორმა, ბუცი, ზომები, ბეჭდვა)
                </label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="აღწერეთ სასურველი ეკიპირება და ვადები..."
                  className="w-full rounded-xl border border-[#E6E6E3] bg-white p-3.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={leadSubmitting}
                className="h-12 px-8 rounded-full bg-[#111214] hover:bg-black text-white font-bold text-sm cursor-pointer"
              >
                {leadSubmitting ? 'იგზავნება…' : 'მოთხოვნის გაგზავნა'}
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
            VIEW 7: STORE & INFO PAGES
            ========================================================= */}
        {(activeView === 'store' || activeView === 'info') && (
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-6">
            {activeView === 'store' ? (
              <>
                <h1 className="font-black text-3xl">
                  მაღაზია და საკონტაქტო ინფორმაცია
                </h1>
                <div className="rounded-2xl bg-[#F4F4F1] p-6 sm:p-8 space-y-4 border border-[#E6E6E3]">
                  <h2 className="font-black text-xl">
                    KELME საქართველო · ისთ ფოინთი
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D7141E]" />
                      <span>{SHOP_CONFIG.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D7141E]" />
                      <span>{SHOP_CONFIG.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D7141E]" />
                      <span>{SHOP_CONFIG.phone}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="font-black text-3xl">
                  {activeInfoKey === 'order' && 'როგორ შევუკვეთო'}
                  {activeInfoKey === 'returns' && 'გაცვლა და დაბრუნება'}
                  {activeInfoKey === 'privacy' && 'კონფიდენციალურობის პოლიტიკა'}
                  {activeInfoKey === 'terms' && 'წესები და პირობები'}
                  {activeInfoKey === 'sizes' && 'ზომების ცხრილი'}
                </h1>
                <div className="rounded-2xl bg-[#F4F4F1] p-6 sm:p-8 text-sm leading-relaxed space-y-3 border border-[#E6E6E3]">
                  {activeInfoKey === 'order' && (
                    <ul className="list-disc pl-5 space-y-2">
                      <li>აირჩიე სასურველი მოდელი და EU ზომა, დაამატე კალათაში.</li>
                      <li>შეავსე სახელი, გვარი და მობილურის ნომერი.</li>
                      <li>
                        აირჩიე მაღაზიიდან უფასო აღება (ისთ ფოინთი, Sport Avenue)
                        ან საკურიერო მიწოდება.
                      </li>
                      <li>
                        შეკვეთის დადასტურებისთანავე ზომა იჯავშნება შენს სახელზე.
                      </li>
                    </ul>
                  )}
                  {activeInfoKey === 'returns' && (
                    <p>
                      ზომის გაცვლა ან დაბრუნება შესაძლებელია მაღაზიაში (ს/ც ისთ
                      ფოინთი, Sport Avenue), თუ ფეხსაცმელი უხმარია და შენახულია
                      ქარხნული შეფუთვა და ქვითარი.
                    </p>
                  )}
                  {activeInfoKey === 'privacy' && (
                    <p>
                      მომხმარებლის სახელი, ტელეფონის ნომერი და ელფოსტა
                      გამოიყენება მხოლოდ შეკვეთის დამუშავებისა და მიწოდებისთვის.
                      ონლაინ გადახდისას ბარათის მონაცემები მუშავდება უშუალოდ
                      ბანკის დაცულ გვერდზე.
                    </p>
                  )}
                  {activeInfoKey === 'terms' && (
                    <p>
                      საიტზე მოცემული ყველა ფასი მითითებულია ლარში (₾) დღგ-ს
                      ჩათვლით. შეკვეთის გაფორმებისას ზომა იჯავშნება ავტომატურად.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Bottom USP Strip */}
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-7 border-t border-b border-[#E6E6E3]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#111214] shrink-0" />
              <div>
                <strong className="block text-sm">ორიგინალი პროდუქცია</strong>
                <span className="text-xs text-[#6B6F76]">
                  KELME-ს ოფიციალური მარაგი
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="w-6 h-6 text-[#111214] shrink-0" />
              <div>
                <strong className="block text-sm">ზომის მარტივი გაცვლა</strong>
                <span className="text-xs text-[#6B6F76]">
                  ისთ ფოინთის მაღაზიაში
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-[#111214] shrink-0" />
              <div>
                <strong className="block text-sm">აიღე მაღაზიიდან უფასოდ</strong>
                <span className="text-xs text-[#6B6F76]">
                  დაჯავშნე ონლაინ 1 წუთში
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-[#111214] shrink-0" />
              <div>
                <strong className="block text-sm">მოქნილი გადახდა</strong>
                <span className="text-xs text-[#6B6F76]">
                  მაღაზიაში ან ონლაინ ბარათით
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
