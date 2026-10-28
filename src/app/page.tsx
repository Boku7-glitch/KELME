'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  KelmeLang,
  ANNOUNCEMENT_MESSAGES_BY_LANG,
  KELME_LOGO_URL,
  KELME_NAV_ITEMS_BY_LANG,
  HERO_SLIDES,
  FEATURED_COLLECTION_1,
  KELME_PROMO_VIDEO_MP4,
  MEDIA_GRID_ITEMS,
  FEATURED_COLLECTION_2,
  COLLECTION_CARDS,
  JUDGEME_SUMMARY,
  BLOG_POSTS,
  FOOTER_INFO_LINKS_BY_LANG,
  COUNTRIES_LIST,
  LANGUAGES_OPTIONS,
  UI_STRINGS,
  KelmeProductItem,
} from '../data/kelmeOfficialData';

interface CartItem {
  product: KelmeProductItem;
  size: string;
  quantity: number;
}

function StarRating({ ratingStr }: { ratingStr: string }) {
  const num = parseFloat(ratingStr.replace(/[()]/g, '')) || 5.0;
  const fullStars = Math.floor(num);
  const hasHalf = num - fullStars >= 0.3;

  return (
    <div className="inline-flex items-center gap-1.5 mt-0.5">
      <div
        className="inline-flex items-center gap-0.5"
        role="img"
        aria-label={`${num} out of 5.0 stars`}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          if (i < fullStars) {
            return (
              <svg
                key={i}
                aria-hidden="true"
                focusable="false"
                width="12"
                height="11"
                viewBox="0 0 12 11"
              >
                <path
                  d="M6 0v8.635L2.292 11 3.48 6.87 0 4.202l4.443-.187L6 0Zm0 0v8.635L9.708 11 8.52 6.87 12 4.202l-4.443-.187L6 0Z"
                  fill="#231f20"
                />
              </svg>
            );
          }
          if (i === fullStars && hasHalf) {
            return (
              <svg
                key={i}
                aria-hidden="true"
                focusable="false"
                width="12"
                height="11"
                viewBox="0 0 12 11"
              >
                <path
                  d="M6 0v8.635L2.292 11 3.48 6.87 0 4.202l4.443-.187L6 0Z"
                  fill="#231f20"
                />
                <path
                  d="M6 0v8.635L9.708 11 8.52 6.87 12 4.202l-4.443-.187L6 0Z"
                  fill="#231f20"
                  fillOpacity="0.35"
                />
              </svg>
            );
          }
          return (
            <svg
              key={i}
              aria-hidden="true"
              focusable="false"
              width="12"
              height="11"
              viewBox="0 0 12 11"
            >
              <path
                d="M6 0v8.635L2.292 11 3.48 6.87 0 4.202l4.443-.187L6 0Zm0 0v8.635L9.708 11 8.52 6.87 12 4.202l-4.443-.187L6 0Z"
                fill="#231f20"
                fillOpacity="0.25"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-[12px] text-black/60 leading-none">{ratingStr}</span>
    </div>
  );
}

export default function KelmeOfficialPage() {
  // Language state ('en' default so it starts identical to kelme.com/en; switches everything to Georgian when 'ka')
  const [lang, setLang] = useState<KelmeLang>('en');

  // Announcement bar state
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  // Hero slideshow state
  const [heroIdx, setHeroIdx] = useState(0);

  // Header navigation hover states
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  // Scroll-reveal states (matching theme.js IntersectionObserver reveal-on-scroll)
  const [fc1Revealed, setFc1Revealed] = useState(false);
  const [mediaGridRevealed, setMediaGridRevealed] = useState(false);
  const [fc2Revealed, setFc2Revealed] = useState(false);

  // Localization state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES_LIST[0]);
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);
  const [langPopoverOpen, setLangPopoverOpen] = useState(false);
  const [footerCountryOpen, setFooterCountryOpen] = useState(false);
  const [footerLangOpen, setFooterLangOpen] = useState(false);

  // Drawers & modals state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickBuyProduct, setQuickBuyProduct] = useState<KelmeProductItem | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<string>('42');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Judge.me AI Summary toggle
  const [showAiSummary, setShowAiSummary] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Carousel & section refs
  const fc1Ref = useRef<HTMLDivElement>(null);
  const fc2Ref = useRef<HTMLDivElement>(null);
  const colListRef = useRef<HTMLDivElement>(null);
  const fc1SectionRef = useRef<HTMLElement>(null);
  const mediaGridSectionRef = useRef<HTMLElement>(null);
  const fc2SectionRef = useRef<HTMLElement>(null);

  const t = UI_STRINGS[lang];
  const navItems = KELME_NAV_ITEMS_BY_LANG[lang];
  const announcementMessages = ANNOUNCEMENT_MESSAGES_BY_LANG[lang];
  const footerInfoLinks = FOOTER_INFO_LINKS_BY_LANG[lang];
  const currentLangOption =
    LANGUAGES_OPTIONS.find((o) => o.code === lang) || LANGUAGES_OPTIONS[0];

  const getProductTitle = (product: KelmeProductItem) =>
    lang === 'ka' ? product.titleKa : product.title;

  const getCountryName = (country: (typeof COUNTRIES_LIST)[0]) =>
    lang === 'ka' ? country.nameKa : country.name;

  // Auto-rotate announcement bar every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcementMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcementMessages.length]);

  // Auto-rotate hero slideshow every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // IntersectionObserver for scroll-reveal (matching theme.js inView)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === fc1SectionRef.current) setFc1Revealed(true);
          if (entry.target === mediaGridSectionRef.current)
            setMediaGridRevealed(true);
          if (entry.target === fc2SectionRef.current) setFc2Revealed(true);
        });
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0.1 }
    );

    if (fc1SectionRef.current) observer.observe(fc1SectionRef.current);
    if (mediaGridSectionRef.current)
      observer.observe(mediaGridSectionRef.current);
    if (fc2SectionRef.current) observer.observe(fc2SectionRef.current);

    return () => observer.disconnect();
  }, []);

  const formatMoney = (eurAmount: number) => {
    const converted = (eurAmount * selectedCountry.rate).toFixed(2);
    const formatted =
      selectedCountry.symbol === '€' ? converted.replace('.', ',') : converted;
    return `${selectedCountry.symbol}${formatted}`;
  };

  const scrollContainer = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: 'prev' | 'next'
  ) => {
    if (!ref.current) return;
    const amount = ref.current.clientWidth * 0.75;
    ref.current.scrollBy({
      left: dir === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  const openQuickBuy = (product: KelmeProductItem) => {
    setQuickBuyProduct(product);
    setSelectedSize(product.sizes[2] || product.sizes[0] || '42');
  };

  const addToCart = (product: KelmeProductItem, size: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1,
        };
        return updated;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setQuickBuyProduct(null);
    setCartOpen(true);
  };

  const updateCartQty = (id: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === id && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (acc, item) => acc + item.product.salePrice * item.quantity,
    0
  );

  const allProducts = [...FEATURED_COLLECTION_1, ...FEATURED_COLLECTION_2].filter(
    (p, idx, arr) => arr.findIndex((x) => x.handle === p.handle) === idx
  );
  const filteredSearchProducts = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.titleKa.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black relative">
      {/* =====================================================================
          SECTION 1: STICKY WHITE HEADER (shopify-section--header)
         ===================================================================== */}
      <header
        className="sticky top-0 z-40 bg-white text-[#231f20] w-full transition-transform duration-300"
        onMouseLeave={() => {
          setActiveNav(null);
          setActiveSubDropdown(null);
        }}
      >
        <div className="w-full px-5 md:px-8 lg:px-12 py-4 md:py-[25px] grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Mobile Left Hamburger / Desktop Left Logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 -ml-1 text-black cursor-pointer"
              aria-label="Open navigation menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line y1="1" x2="33" y2="1" stroke="black" strokeWidth="2" />
                <line
                  y1="15.5714"
                  x2="33"
                  y2="15.5714"
                  stroke="black"
                  strokeWidth="2"
                />
                <line y1="31" x2="33" y2="31" stroke="black" strokeWidth="2" />
              </svg>
            </button>

            <a
              href="#"
              className="hidden lg:inline-block shrink-0"
              aria-label="Kelme España"
            >
              <img
                src={KELME_LOGO_URL}
                alt="Kelme España"
                width={140}
                height={17}
                className="w-[140px] h-auto block"
              />
            </a>
          </div>

          {/* Mobile Center Logo / Desktop Center Primary Navigation */}
          <div className="flex items-center justify-center">
            <a
              href="#"
              className="lg:hidden inline-block shrink-0"
              aria-label="Kelme España"
            >
              <img
                src={KELME_LOGO_URL}
                alt="Kelme España"
                width={105}
                height={13}
                className="w-[105px] sm:w-[130px] h-auto block"
              />
            </a>

            <nav
              className="hidden lg:flex items-center gap-8 xl:gap-10"
              aria-label="Primary navigation"
            >
              {navItems.map((item) => {
                const isOpen = activeNav === item.title;
                const useBottomBar = item.type !== 'dropdown';
                return (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => {
                      setActiveNav(item.title);
                      setActiveSubDropdown(null);
                    }}
                  >
                    <a
                      href={item.href}
                      className={`kelme-heading text-[15px] text-[#231f20] py-1.5 block whitespace-nowrap ${
                        useBottomBar
                          ? `kelme-nav-underline ${isOpen ? 'is-active' : ''}`
                          : 'hover:opacity-70 transition-opacity'
                      }`}
                    >
                      {item.title}
                    </a>

                    {/* Animated Dropdown menu for Kids & Official Products */}
                    {item.type === 'dropdown' && isOpen && item.groups && (
                      <div className="absolute left-0 top-full pt-3 z-50">
                        <ul className="kelme-dropdown-enter bg-white border-x border-b border-[#deddde] py-4 min-w-[235px] shadow-md">
                          {item.groups.map((grp, grpIdx) => {
                            const subOpen = activeSubDropdown === grp.title;
                            return (
                              <li
                                key={grp.title}
                                className="relative kelme-mega-col-enter"
                                style={{ animationDelay: `${grpIdx * 0.08}s` }}
                                onMouseEnter={() => setActiveSubDropdown(grp.title)}
                              >
                                <a
                                  href={grp.href}
                                  className="flex items-center justify-between gap-4 px-6 py-2 text-[15px] text-[#231f20] hover:text-[#231f20]/65 transition-colors"
                                >
                                  <span>{grp.title}</span>
                                  <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    fill="none"
                                    width="8"
                                    viewBox="0 0 16 18"
                                  >
                                    <path
                                      d="m5 17 8-8-8-8"
                                      stroke="currentColor"
                                      strokeLinecap="square"
                                    />
                                  </svg>
                                </a>

                                {subOpen && grp.links.length > 0 && (
                                  <ul className="kelme-mega-menu-enter absolute left-full -top-4 bg-white border border-[#deddde] py-4 min-w-[260px] shadow-md">
                                    {grp.links.map((subLink, sIdx) => (
                                      <li
                                        key={subLink.label}
                                        className="kelme-mega-col-enter"
                                        style={{
                                          animationDelay: `${sIdx * 0.04}s`,
                                        }}
                                      >
                                        <a
                                          href={subLink.href}
                                          onClick={() => setActiveNav(null)}
                                          className="block px-6 py-2 text-[15px] text-[#231f20] hover:text-[#231f20]/65 transition-colors"
                                        >
                                          {subLink.label}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Secondary Navigation (Country, Language, Account, Search, Cart) */}
          <div className="flex items-center justify-end gap-4 sm:gap-6">
            <div className="flex items-center gap-5">
              {/* Country Selector (Desktop) */}
              <div className="hidden xl:block relative">
                <button
                  type="button"
                  onClick={() => {
                    setCountryPopoverOpen((v) => !v);
                    setLangPopoverOpen(false);
                  }}
                  className="kelme-heading text-[12px] text-[#231f20] hover:opacity-70 flex items-center gap-2 cursor-pointer transition-opacity"
                >
                  <img
                    src={selectedCountry.flag}
                    alt={getCountryName(selectedCountry)}
                    width={20}
                    height={15}
                    className="w-5 h-[15px] object-cover rounded-[1px]"
                  />
                  <span>
                    {getCountryName(selectedCountry)} ({selectedCountry.currency})
                  </span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    width="10"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="m1 3 4 4 4-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>

                {countryPopoverOpen && (
                  <div className="kelme-mega-menu-enter absolute right-0 top-full mt-3 bg-white border border-[#d9d9d9] shadow-lg py-2 w-56 z-50">
                    {COUNTRIES_LIST.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setCountryPopoverOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[14px] text-black/65 hover:text-black transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <img
                          src={c.flag}
                          alt={getCountryName(c)}
                          width={20}
                          height={15}
                          className="w-5 h-[15px] object-cover"
                        />
                        <span>
                          {getCountryName(c)} ({c.currency})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector (English <-> ქართული) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setLangPopoverOpen((v) => !v);
                    setCountryPopoverOpen(false);
                  }}
                  className="kelme-heading text-[12px] text-[#231f20] hover:opacity-70 flex items-center gap-1.5 cursor-pointer transition-opacity"
                >
                  <span>{currentLangOption.label}</span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    width="10"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="m1 3 4 4 4-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>

                {langPopoverOpen && (
                  <div className="kelme-mega-menu-enter absolute right-0 top-full mt-3 bg-white border border-[#d9d9d9] shadow-lg py-2 w-36 z-50">
                    {LANGUAGES_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          setLang(opt.code);
                          setLangPopoverOpen(false);
                          setActiveNav(null);
                        }}
                        className={`w-full px-4 py-2 text-left text-[14px] transition-colors cursor-pointer flex items-center justify-between ${
                          lang === opt.code
                            ? 'text-black font-bold bg-black/[0.03]'
                            : 'text-black/65 hover:text-black'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {lang === opt.code && (
                          <span className="text-[11px]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Account Icon */}
            <button
              type="button"
              onClick={() => setAccountOpen(true)}
              className="hidden sm:inline-flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open account page"
            >
              <svg
                width="23"
                height="25"
                viewBox="0 0 38 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.089 20.747C27.6 18.909 30 15.238 30 11C30 4.925 25.075 0 19 0C12.925 0 8 4.925 8 11C8 15.238 10.4 18.909 13.911 20.747C5.89 23.09 0 30.809 0 40H38C38 30.809 32.11 23.09 24.089 20.747ZM10 11C10 6.037 14.037 2 19 2C23.963 2 28 6.037 28 11C28 15.963 23.963 20 19 20C14.037 20 10 15.963 10 11ZM19 22C27.735 22 34.953 29.013 35.896 38H2.104C3.047 29.013 10.265 22 19 22Z"
                  fill="black"
                />
              </svg>
            </button>

            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open search"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 28C17.506 28 20.703 26.702 23.159 24.573L36 37.414L37.414 36L24.573 23.159C26.702 20.703 28 17.506 28 14C28 6.268 21.732 0 14 0C6.268 0 0 6.268 0 14C0 21.732 6.268 28 14 28ZM14 2C20.617 2 26 7.383 26 14C26 20.617 20.617 26 14 26C7.383 26 2 20.617 2 14C2 7.383 7.383 2 14 2Z"
                  fill="black"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open cart"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 12H30V8C30 5.8 28.2 4 26 4H22C19.8 4 18 5.8 18 8V12H8V44H40V12ZM38 42H10V14H38V42ZM20 8C20 6.897 20.897 6 22 6H26C27.103 6 28 6.897 28 8V12H20V8Z"
                  fill="black"
                />
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ed1c24] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Full-Width Staggered Mega Menu for Man & Women */}
        {navItems.map((item) => {
          if (item.type !== 'mega' || activeNav !== item.title || !item.columns)
            return null;
          return (
            <div
              key={item.title}
              className="kelme-mega-menu-enter hidden lg:flex w-full bg-white text-[#231f20] border-t border-[#deddde]/60 shadow-md py-10 px-12 justify-center z-50 absolute left-0 top-full"
            >
              <ul className="flex flex-wrap gap-x-24 gap-y-10 max-w-[1360px]">
                {item.columns.map((col, colIdx) => (
                  <li
                    key={col.title}
                    className="kelme-mega-col-enter flex flex-col items-start gap-5 max-w-[260px]"
                    style={{ animationDelay: `${colIdx * 0.08}s` }}
                  >
                    <a
                      href={col.href}
                      onClick={() => setActiveNav(null)}
                      className="font-bold text-[17px] text-[#231f20] hover:opacity-70 transition-opacity"
                    >
                      {col.title}
                    </a>
                    {col.links.length > 0 && (
                      <ul className="flex flex-col gap-2.5">
                        {col.links.map((lnk) => (
                          <li key={lnk.label}>
                            <a
                              href={lnk.href}
                              onClick={() => setActiveNav(null)}
                              className="text-[16px] text-[#231f20]/65 hover:text-[#231f20] transition-colors duration-200"
                            >
                              {lnk.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </header>

      {/* =====================================================================
          SECTION 2: BLACK ANNOUNCEMENT BAR (shopify-section--announcement-bar)
         ===================================================================== */}
      <aside className="bg-black text-white w-full py-3 px-4 md:px-12 flex items-center justify-center gap-4 md:gap-10 overflow-hidden">
        <button
          type="button"
          onClick={() =>
            setAnnouncementIdx(
              (prev) =>
                (prev - 1 + announcementMessages.length) %
                announcementMessages.length
            )
          }
          className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Previous"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            fill="none"
            width="12"
            viewBox="0 0 16 18"
          >
            <path
              d="M11 1 3 9l8 8"
              stroke="currentColor"
              strokeLinecap="square"
            />
          </svg>
        </button>

        <div className="max-w-[35rem] flex-1 text-center overflow-hidden">
          <p
            key={`${lang}-${announcementIdx}`}
            className="kelme-heading kelme-announcement-animate text-[10px] lg:text-[13px] tracking-[-0.04em] text-white"
          >
            {announcementMessages[announcementIdx]}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setAnnouncementIdx(
              (prev) => (prev + 1) % announcementMessages.length
            )
          }
          className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Next"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            fill="none"
            width="12"
            viewBox="0 0 16 18"
          >
            <path
              d="m5 17 8-8-8-8"
              stroke="currentColor"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </aside>

      {/* =====================================================================
          MAIN CONTENT
         ===================================================================== */}
      <main id="main" className="flex-1">
        {/* ===================================================================
            SECTION 3: FULL-WIDTH HERO SLIDESHOW (shopify-section--slideshow)
           =================================================================== */}
        <section className="relative w-full bg-black overflow-hidden">
          <div className="relative w-full">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === heroIdx;
              if (!isSelected) return null;
              const slideTitle = lang === 'ka' ? slide.titleKa : slide.title;
              const slideSubtitle =
                lang === 'ka' ? slide.subtitleKa : slide.subtitle;
              const slideButtonText =
                lang === 'ka' ? slide.buttonTextKa : slide.buttonText;
              return (
                <div
                  key={`${slide.id}-${heroIdx}`}
                  className="relative w-full overflow-hidden"
                >
                  <picture className="block w-full overflow-hidden">
                    <source
                      media="(max-width: 699px)"
                      srcSet={slide.mobileImg}
                    />
                    <img
                      src={slide.desktopImg}
                      alt={slideTitle}
                      className="kelme-slide-active-img w-full h-[68vh] sm:h-[62vw] lg:h-[calc(100vw*1200/3200)] min-h-[440px] max-h-[760px] object-cover block"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: slide.gradient }}
                  />

                  {/* Staggered Slide Text (.prose) & Button (.button-group) */}
                  <div
                    className={`absolute inset-0 px-6 md:px-16 py-14 flex ${
                      slide.align === 'bottom-center'
                        ? 'items-end justify-center text-center pb-16 sm:pb-20'
                        : slide.align === 'center-end'
                          ? 'items-end sm:items-center justify-center sm:justify-end text-center sm:text-right pb-16 sm:pb-0'
                          : 'items-center justify-center text-center'
                    }`}
                  >
                    <div className="max-w-[780px] text-white flex flex-col gap-3 sm:gap-4">
                      <div className="kelme-slide-active-prose flex flex-col gap-3">
                        <h2 className="kelme-heading text-[30px] sm:text-[42px] lg:text-[46px] leading-[1.05] text-white drop-shadow-xs">
                          {slideTitle}
                        </h2>
                        {slideSubtitle && (
                          <p className="text-[16px] sm:text-[19px] text-white font-normal">
                            {slideSubtitle}
                          </p>
                        )}
                      </div>

                      <div
                        className={`kelme-slide-active-btn mt-2 flex ${
                          slide.align === 'center-end'
                            ? 'justify-center sm:justify-end'
                            : 'justify-center'
                        }`}
                      >
                        <a
                          href={slide.buttonHref}
                          className="kelme-pill-btn kelme-pill-btn-hero"
                          style={
                            {
                              '--btn-bg': slide.buttonBg,
                              '--btn-text': slide.buttonTextColor,
                              '--btn-outline': slide.buttonBg,
                            } as React.CSSProperties
                          }
                        >
                          {slideButtonText}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Circular Autoplay Progress Page Dots (page-dots--autoplay) */}
            <div className="absolute bottom-5 right-1/2 translate-x-1/2 md:right-12 md:translate-x-0 z-20 flex items-center gap-4">
              {HERO_SLIDES.map((s, idx) => {
                const active = idx === heroIdx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setHeroIdx(idx)}
                    aria-label={`Go to item ${idx + 1}`}
                    aria-current={active}
                    className="relative w-3 h-3 flex items-center justify-center text-white cursor-pointer"
                  >
                    {active ? (
                      <svg
                        key={`ring-${heroIdx}`}
                        className="kelme-circular-progress w-3.5 h-3.5 block"
                        viewBox="0 0 8 8"
                      >
                        <circle
                          cx="50%"
                          cy="50%"
                          fill="none"
                          strokeWidth="1.5"
                          r="3.25"
                          stroke="currentColor"
                          strokeOpacity="0.25"
                        />
                        <circle
                          className="progress-ring"
                          cx="50%"
                          cy="50%"
                          fill="none"
                          strokeWidth="1.5"
                          r="3.25"
                          stroke="currentColor"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/75 transition-colors block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 4: FEATURED COLLECTION 1 ("ALL OUR FUTSAL" - Back to Sport)
           =================================================================== */}
        <section
          id="featured-1"
          ref={fc1SectionRef}
          className="py-14 lg:py-24 w-full"
        >
          <div className="w-full px-5 md:px-8 lg:px-12 flex flex-col gap-8 lg:gap-12">
            <div>
              <h2 className="kelme-heading text-[24px] sm:text-[28px] lg:text-[31px] text-black">
                {t.allOurFutsal}
              </h2>
            </div>

            {/* Product List Carousel with Staggered Scroll-Reveal & Floating Arrows */}
            <div className="relative group/carousel">
              <div
                ref={fc1Ref}
                className="grid grid-flow-col auto-cols-[72%] sm:auto-cols-[38%] lg:auto-cols-[calc((100%-72px)/4)] gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
              >
                {FEATURED_COLLECTION_1.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`group/card flex flex-col gap-4 snap-start ${
                      fc1Revealed ? 'kelme-card-revealed' : 'kelme-card-hidden'
                    }`}
                    style={
                      fc1Revealed
                        ? { animationDelay: `${0.15 + idx * 0.05}s` }
                        : undefined
                    }
                  >
                    <div className="relative aspect-square w-full bg-white overflow-hidden">
                      {/* Red Sale Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-[#ed1c24] text-white kelme-heading text-[11px] px-1.5 py-0.5 block leading-tight">
                          {product.badge}
                        </span>
                      </div>

                      {/* Primary + Secondary Hover Image (0.1s ease-in-out) */}
                      <button
                        type="button"
                        onClick={() => openQuickBuy(product)}
                        className="block w-full h-full relative cursor-pointer"
                      >
                        <img
                          src={product.primaryImg}
                          alt={getProductTitle(product)}
                          loading="lazy"
                          className="w-full h-full object-contain transition-opacity duration-100 ease-in-out group-hover/card:opacity-0"
                        />
                        <img
                          src={product.secondaryImg}
                          alt={getProductTitle(product)}
                          loading="lazy"
                          className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-100 ease-in-out group-hover/card:opacity-100"
                        />
                      </button>

                      {/* Quick-Add Plus Button (rotates 90deg on hover) */}
                      <button
                        type="button"
                        onClick={() => openQuickBuy(product)}
                        aria-label={t.chooseOptionsAria}
                        className="kelme-quick-add-btn absolute bottom-2 left-1/2 z-10 cursor-pointer"
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          fill="none"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M6 0v12M0 6h12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Product Card Info */}
                    <div className="flex flex-col items-center text-center gap-1 px-1">
                      <button
                        type="button"
                        onClick={() => openQuickBuy(product)}
                        className="text-[15px] sm:text-[16px] leading-snug text-black hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        {getProductTitle(product)}
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[16px] mt-0.5">
                        <span className="text-[#ed1c24]">
                          {formatMoney(product.salePrice)}
                        </span>
                        <span className="text-black/60 line-through">
                          {formatMoney(product.regularPrice)}
                        </span>
                      </div>
                      <StarRating ratingStr={product.rating} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Carousel Arrows with Inline Icon Fly-Through */}
              <button
                type="button"
                onClick={() => scrollContainer(fc1Ref, 'prev')}
                aria-label="Previous"
                className="kelme-circle-btn kelme-circle-btn--prev hidden md:grid absolute left-6 top-[40%] -translate-y-1/2 z-20 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="16"
                  viewBox="0 0 16 18"
                >
                  <path
                    d="M11 1 3 9l8 8"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(fc1Ref, 'next')}
                aria-label="Next"
                className="kelme-circle-btn kelme-circle-btn--next hidden md:grid absolute right-6 top-[40%] -translate-y-1/2 z-20 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="16"
                  viewBox="0 0 16 18"
                >
                  <path
                    d="m5 17 8-8-8-8"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>

            {/* See More Button */}
            <div className="flex justify-center">
              <a href="#featured-2" className="kelme-pill-btn">
                {t.seeMore}
              </a>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: FULL-WIDTH AUTOPLAY VIDEO (blocks_ciEzQH)
           =================================================================== */}
        <section className="w-full overflow-hidden bg-[#f4f4f4]">
          <video
            className="w-full h-auto block"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={KELME_PROMO_VIDEO_MP4} type="video/mp4" />
          </video>
        </section>

        {/* ===================================================================
            SECTION 6: MEDIA GRID ("IGNITE - NUEVO LANZAMIENTO")
           =================================================================== */}
        <section
          id="media-grid"
          ref={mediaGridSectionRef}
          className="py-14 lg:py-24 w-full"
        >
          <div className="w-full px-5 md:px-8 lg:px-[30px] flex flex-col gap-8 lg:gap-12">
            <div>
              <h2 className="kelme-heading text-[24px] sm:text-[28px] lg:text-[31px] text-black">
                {t.igniteHeading}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-[30px]">
              {MEDIA_GRID_ITEMS.map((item, idx) => {
                const btnLabel =
                  lang === 'ka' ? item.buttonTextKa : item.buttonText;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`group relative block h-[420px] sm:h-[480px] lg:h-[580px] overflow-hidden bg-black transition-opacity duration-500 ${
                      mediaGridRevealed ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: `${idx * 0.08}s` }}
                  >
                    <img
                      src={item.img}
                      alt={btnLabel}
                      loading="lazy"
                      className="kelme-zoom-image w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/19 pointer-events-none" />
                    <div className="absolute inset-0 p-6 sm:p-8 flex items-end justify-center text-center">
                      <span
                        className="kelme-pill-btn kelme-pill-btn-hero"
                        style={
                          {
                            '--btn-bg': item.buttonBg,
                            '--btn-text': item.buttonTextColor,
                            '--btn-outline': item.buttonBg,
                          } as React.CSSProperties
                        }
                      >
                        {btnLabel}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 7: FEATURED COLLECTION 2 ("ALL OUR FUTSAL")
           =================================================================== */}
        <section
          id="featured-2"
          ref={fc2SectionRef}
          className="py-10 lg:py-20 w-full"
        >
          <div className="w-full px-5 md:px-8 lg:px-12 flex flex-col gap-8 lg:gap-12">
            <div>
              <h2 className="kelme-heading text-[24px] sm:text-[28px] lg:text-[31px] text-black">
                {t.allOurFutsal}
              </h2>
            </div>

            <div className="relative group/carousel">
              <div
                ref={fc2Ref}
                className="grid grid-flow-col auto-cols-[72%] sm:auto-cols-[38%] lg:auto-cols-[calc((100%-72px)/4)] gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
              >
                {FEATURED_COLLECTION_2.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`group/card flex flex-col gap-4 snap-start ${
                      fc2Revealed ? 'kelme-card-revealed' : 'kelme-card-hidden'
                    }`}
                    style={
                      fc2Revealed
                        ? { animationDelay: `${0.15 + idx * 0.05}s` }
                        : undefined
                    }
                  >
                    <div className="relative aspect-square w-full bg-white overflow-hidden">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-[#ed1c24] text-white kelme-heading text-[11px] px-1.5 py-0.5 block leading-tight">
                          {product.badge}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openQuickBuy(product)}
                        className="block w-full h-full relative cursor-pointer"
                      >
                        <img
                          src={product.primaryImg}
                          alt={getProductTitle(product)}
                          loading="lazy"
                          className="w-full h-full object-contain transition-opacity duration-100 ease-in-out group-hover/card:opacity-0"
                        />
                        <img
                          src={product.secondaryImg}
                          alt={getProductTitle(product)}
                          loading="lazy"
                          className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-100 ease-in-out group-hover/card:opacity-100"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => openQuickBuy(product)}
                        aria-label={t.chooseOptionsAria}
                        className="kelme-quick-add-btn absolute bottom-2 left-1/2 z-10 cursor-pointer"
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          fill="none"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M6 0v12M0 6h12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col items-center text-center gap-1 px-1">
                      <button
                        type="button"
                        onClick={() => openQuickBuy(product)}
                        className="text-[15px] sm:text-[16px] leading-snug text-black hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        {getProductTitle(product)}
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[16px] mt-0.5">
                        <span className="text-[#ed1c24]">
                          {formatMoney(product.salePrice)}
                        </span>
                        <span className="text-black/60 line-through">
                          {formatMoney(product.regularPrice)}
                        </span>
                      </div>
                      <StarRating ratingStr={product.rating} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollContainer(fc2Ref, 'prev')}
                aria-label="Previous"
                className="kelme-circle-btn kelme-circle-btn--prev hidden md:grid absolute left-6 top-[40%] -translate-y-1/2 z-20 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="16"
                  viewBox="0 0 16 18"
                >
                  <path
                    d="M11 1 3 9l8 8"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(fc2Ref, 'next')}
                aria-label="Next"
                className="kelme-circle-btn kelme-circle-btn--next hidden md:grid absolute right-6 top-[40%] -translate-y-1/2 z-20 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="16"
                  viewBox="0 0 16 18"
                >
                  <path
                    d="m5 17 8-8-8-8"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              <a href="#collections" className="kelme-pill-btn">
                {t.seeMore}
              </a>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 8: COLLECTION LIST CAROUSEL (Men's, Women's, Kids, etc.)
           =================================================================== */}
        <section id="collections" className="py-10 lg:py-16 w-full">
          <div className="w-full px-5 md:px-8 lg:px-12">
            <div className="relative group/carousel">
              <div
                ref={colListRef}
                className="grid grid-flow-col auto-cols-[84vw] sm:auto-cols-[62vw] lg:auto-cols-[calc((100%-60px)/3)] gap-6 lg:gap-[30px] overflow-x-auto snap-x snap-mandatory no-scrollbar"
              >
                {COLLECTION_CARDS.map((card) => {
                  const cardTitle = lang === 'ka' ? card.titleKa : card.title;
                  return (
                    <a
                      key={card.id}
                      href={card.href}
                      className="group relative aspect-square w-full overflow-hidden snap-center block bg-neutral-100"
                    >
                      <img
                        src={card.img}
                        alt={cardTitle}
                        loading="lazy"
                        className="kelme-zoom-image w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 p-6 sm:p-8 flex items-end justify-start">
                        <span className="kelme-pill-btn kelme-pill-btn-hero">
                          {cardTitle}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollContainer(colListRef, 'prev')}
                aria-label="Previous"
                className="kelme-circle-btn kelme-circle-btn--prev hidden md:grid absolute left-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="16"
                  viewBox="0 0 16 18"
                >
                  <path
                    d="M11 1 3 9l8 8"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(colListRef, 'next')}
                aria-label="Next"
                className="kelme-circle-btn kelme-circle-btn--next hidden md:grid absolute right-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="16"
                  viewBox="0 0 16 18"
                >
                  <path
                    d="m5 17 8-8-8-8"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 9: JUDGE.ME STORE SUMMARY & MEDALS (bordered-section)
           =================================================================== */}
        <section className="py-12 lg:py-16 border-t border-[#d9d9d9] w-full">
          <div className="max-w-[1100px] mx-auto px-5 md:px-8">
            <div className="bg-[#f9f9f9] rounded-xl p-6 sm:p-10 flex flex-col items-center text-center gap-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-[44px] font-bold leading-none text-black">
                    {JUDGEME_SUMMARY.averageRating}
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <svg
                        key={s}
                        width="18"
                        height="17"
                        viewBox="0 0 12 11"
                        fill="#000000"
                      >
                        <path d="M6 0v8.635L2.292 11 3.48 6.87 0 4.202l4.443-.187L6 0Zm0 0v8.635L9.708 11 8.52 6.87 12 4.202l-4.443-.187L6 0Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[14px] text-[#787878]">
                    {t.basedOnReviews('3,585')}
                  </p>
                </div>

                {/* Histogram */}
                <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
                  {JUDGEME_SUMMARY.histogram.map((row) => (
                    <div
                      key={row.rating}
                      className="flex items-center gap-3 text-[13px]"
                    >
                      <span className="w-8 text-right font-medium">
                        {row.rating} ★
                      </span>
                      <div className="flex-1 h-2.5 bg-black/10 overflow-hidden">
                        <div
                          className="h-full bg-black transition-all duration-700"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-left text-[#787878]">
                        {row.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {(lang === 'ka'
                  ? JUDGEME_SUMMARY.keywordsKa
                  : JUDGEME_SUMMARY.keywords
                ).map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 bg-white border border-black/10 rounded-full text-[13px] text-black flex items-center gap-1.5"
                  >
                    <span className="text-black font-bold">✓</span> {kw}
                  </span>
                ))}
              </div>

              {/* AI Summary Toggle Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAiSummary((v) => !v)}
                  className="px-5 py-2.5 rounded-lg bg-black text-white text-[14px] font-bold hover:opacity-85 transition-opacity cursor-pointer"
                >
                  {t.aiSummaryBtn}
                </button>
              </div>

              {showAiSummary && (
                <p className="kelme-mega-menu-enter max-w-2xl text-[15px] text-[#333333] leading-relaxed bg-white p-5 rounded-lg border border-black/10">
                  {lang === 'ka'
                    ? JUDGEME_SUMMARY.aiSummaryTextKa
                    : JUDGEME_SUMMARY.aiSummaryText}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 10: BLOG POSTS (bordered-section — 3-Column News Grid)
           =================================================================== */}
        <section
          id="blog"
          className="py-14 lg:py-24 border-t border-[#d9d9d9] w-full"
        >
          <div className="max-w-[1260px] mx-auto px-5 md:px-8 lg:px-12 flex flex-col gap-10 lg:gap-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {BLOG_POSTS.map((post) => {
                const postCategory =
                  lang === 'ka' ? post.categoryKa : post.category;
                const postTitle = lang === 'ka' ? post.titleKa : post.title;
                const postExcerpt =
                  lang === 'ka' ? post.excerptKa : post.excerpt;
                return (
                  <article
                    key={post.id}
                    className="group flex flex-col gap-5 items-start"
                  >
                    <a
                      href={post.href}
                      className="w-full aspect-square overflow-hidden block bg-neutral-100"
                    >
                      <img
                        src={post.img}
                        alt={postTitle}
                        loading="lazy"
                        className="kelme-zoom-image w-full h-full object-cover"
                      />
                    </a>
                    <div className="flex flex-col items-start gap-3">
                      <a
                        href={post.href}
                        className="kelme-heading text-[11px] text-black/65 hover:text-black transition-colors duration-200"
                      >
                        {postCategory}
                      </a>
                      <h3 className="kelme-heading text-[19px] lg:text-[22px] leading-tight text-black">
                        <a
                          href={post.href}
                          className="hover:opacity-75 transition-opacity"
                        >
                          {postTitle}
                        </a>
                      </h3>
                      <p className="text-[16px] text-black/80 leading-relaxed">
                        {postExcerpt}
                      </p>
                      <a
                        href={post.href}
                        className="kelme-link-underline text-[16px] text-black"
                      >
                        {t.readMore}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex justify-center">
              <a href="#blog" className="kelme-pill-btn">
                {t.seeMore}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          SECTION 11: FOOTER (shopify-section--footer)
         ===================================================================== */}
      <footer
        id="footer"
        className="bg-[#fafafa] text-[#231f20] pt-14 lg:pt-20 pb-12 w-full"
      >
        <div className="w-full px-5 md:px-8 lg:px-12 flex flex-col gap-12">
          {/* Top 3-Column Block List */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-12">
            {/* Block 1: Newsletter */}
            <div className="flex-1 max-w-md flex flex-col gap-4 sm:gap-5 w-full">
              <p className="kelme-heading text-[16px] text-[#231f20]">
                {t.newsletterTitle}
              </p>
              <p className="text-[16px] text-[#231f20]/70">
                {t.newsletterSubtitle}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                    setNewsletterEmail('');
                  }
                }}
                className="flex flex-col gap-5 w-full"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full border border-[#d9d9d9] bg-white px-3.5 py-2.5 text-[16px] text-black placeholder:text-black/50 focus:outline-none focus:border-black rounded-none transition-colors"
                />
                <div>
                  <button type="submit" className="kelme-pill-btn">
                    {t.subscribeBtn}
                  </button>
                </div>
                {newsletterSubscribed && (
                  <p className="kelme-mega-menu-enter text-[14px] text-[#307a07] font-medium">
                    {t.subscribeSuccess}
                  </p>
                )}
              </form>
            </div>

            {/* Block 2: More information */}
            <div className="flex flex-col gap-4 sm:gap-5 min-w-[180px]">
              <p className="kelme-heading text-[16px] text-[#231f20]">
                {t.moreInfoTitle}
              </p>
              <ul className="flex flex-col gap-2.5">
                {footerInfoLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[16px] text-[#231f20]/65 hover:text-[#231f20] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Block 3: ABOUT KELME */}
            <div className="flex-1 max-w-lg flex flex-col gap-4 sm:gap-5">
              <p className="kelme-heading text-[16px] text-[#231f20]">
                {t.aboutKelmeTitle}
              </p>
              <p className="text-[16px] text-[#231f20]/70 leading-relaxed">
                {t.aboutKelmeBody}
              </p>
              <div className="pt-2">
                <a
                  href="#featured-1"
                  className="inline-flex items-center gap-2 bg-[#5A31F4] text-white font-bold text-[14px] px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {t.followOnShop}
                </a>
              </div>
            </div>
          </div>

          {/* Footer Aside: Localization, Copyright, Payment Icons */}
          <div className="flex flex-col items-center justify-center text-center gap-6 pt-4">
            {/* Localization Selectors */}
            <div className="flex items-center justify-center gap-6">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setFooterCountryOpen((v) => !v);
                    setFooterLangOpen(false);
                  }}
                  className="kelme-heading text-[12px] text-[#231f20]/65 hover:text-[#231f20] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={selectedCountry.flag}
                    alt={getCountryName(selectedCountry)}
                    width={20}
                    height={15}
                    className="w-5 h-[15px] object-cover"
                  />
                  <span>
                    {getCountryName(selectedCountry)} ({selectedCountry.currency})
                  </span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    width="10"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="m1 3 4 4 4-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>

                {footerCountryOpen && (
                  <div className="kelme-mega-menu-enter absolute left-0 bottom-full mb-2 bg-white border border-[#d9d9d9] shadow-lg py-2 w-56 z-50">
                    {COUNTRIES_LIST.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setFooterCountryOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[14px] text-black/65 hover:text-black transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <img
                          src={c.flag}
                          alt={getCountryName(c)}
                          width={20}
                          height={15}
                          className="w-5 h-[15px] object-cover"
                        />
                        <span>
                          {getCountryName(c)} ({c.currency})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setFooterLangOpen((v) => !v);
                    setFooterCountryOpen(false);
                  }}
                  className="kelme-heading text-[12px] text-[#231f20]/65 hover:text-[#231f20] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentLangOption.label}</span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    width="10"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="m1 3 4 4 4-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>

                {footerLangOpen && (
                  <div className="kelme-mega-menu-enter absolute left-0 bottom-full mb-2 bg-white border border-[#d9d9d9] shadow-lg py-2 w-36 z-50">
                    {LANGUAGES_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          setLang(opt.code);
                          setFooterLangOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-[14px] transition-colors cursor-pointer flex items-center justify-between ${
                          lang === opt.code
                            ? 'text-black font-bold bg-black/[0.03]'
                            : 'text-black/65 hover:text-black'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {lang === opt.code && (
                          <span className="text-[11px]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Copyright */}
            <p className="kelme-heading text-[12px] text-[#231f20]/65">
              {t.copyrightText}
            </p>

            {/* Payment Method Icons Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-[30rem]">
              {/* American Express */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="3" fill="#0071CE" />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="7"
                  fontWeight="700"
                >
                  AMEX
                </text>
              </svg>
              {/* Apple Pay */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect
                  x=".5"
                  y=".5"
                  width="37"
                  height="23"
                  rx="2.5"
                  fill="#fff"
                  stroke="#e5e5e5"
                />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#000"
                  fontSize="7.5"
                  fontWeight="700"
                >
                  Pay
                </text>
              </svg>
              {/* Google Pay */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect
                  x=".5"
                  y=".5"
                  width="37"
                  height="23"
                  rx="2.5"
                  fill="#fff"
                  stroke="#e5e5e5"
                />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#4285F4"
                  fontSize="7.5"
                  fontWeight="700"
                >
                  G Pay
                </text>
              </svg>
              {/* Klarna */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="3" fill="#FFA8CD" />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#0B051D"
                  fontSize="7.5"
                  fontWeight="800"
                >
                  Klarna.
                </text>
              </svg>
              {/* Maestro */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect
                  x=".5"
                  y=".5"
                  width="37"
                  height="23"
                  rx="2.5"
                  fill="#fff"
                  stroke="#e5e5e5"
                />
                <circle cx="15" cy="12" r="6.5" fill="#EB001B" />
                <circle
                  cx="23"
                  cy="12"
                  r="6.5"
                  fill="#00A2E5"
                  fillOpacity="0.85"
                />
              </svg>
              {/* Mastercard */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="3" fill="#232323" />
                <circle cx="15" cy="12" r="6.5" fill="#EB001B" />
                <circle
                  cx="23"
                  cy="12"
                  r="6.5"
                  fill="#F79E1B"
                  fillOpacity="0.9"
                />
              </svg>
              {/* PayPal */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect
                  x=".5"
                  y=".5"
                  width="37"
                  height="23"
                  rx="2.5"
                  fill="#fff"
                  stroke="#e5e5e5"
                />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#003087"
                  fontSize="7.5"
                  fontWeight="800"
                >
                  PayPal
                </text>
              </svg>
              {/* Shop Pay */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="3" fill="#5A31F4" />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="7.5"
                  fontWeight="700"
                >
                  shop
                </text>
              </svg>
              {/* Visa */}
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="3" fill="#142FBD" />
                <text
                  x="19"
                  y="15"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="8.5"
                  fontWeight="800"
                  fontStyle="italic"
                >
                  VISA
                </text>
              </svg>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          ANIMATED INTERACTIVE OVERLAYS:
          1. Mobile Sidebar Navigation Drawer (.kelme-drawer-left)
          2. Cart Drawer (.kelme-drawer-right)
          3. Search Drawer (.kelme-mega-menu-enter)
          4. Quick Buy Product Modal (.kelme-modal-pop)
          5. Account Modal (.kelme-modal-pop)
         ===================================================================== */}

      {/* 1. MOBILE SIDEBAR MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="kelme-overlay-fade fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="kelme-drawer-left relative z-10 w-[85vw] max-w-[380px] bg-white h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[#d9d9d9] pb-4">
                <img
                  src={KELME_LOGO_URL}
                  alt="Kelme"
                  className="w-[110px] h-auto"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-black opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <ul className="flex flex-col divide-y divide-[#d9d9d9]/60">
                {navItems.map((item, idx) => {
                  const hasChildren =
                    (item.columns && item.columns.length > 0) ||
                    (item.groups && item.groups.length > 0);
                  const expanded = mobileExpandedItem === item.title;
                  return (
                    <li
                      key={item.title}
                      className="py-3.5 kelme-mega-col-enter"
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <a
                          href={item.href}
                          onClick={() => !hasChildren && setMobileMenuOpen(false)}
                          className="kelme-heading text-[18px] text-[#231f20]"
                        >
                          {item.title}
                        </a>
                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpandedItem(expanded ? null : item.title)
                            }
                            className="p-1 text-black cursor-pointer"
                          >
                            {expanded ? '−' : '+'}
                          </button>
                        )}
                      </div>

                      {expanded && item.columns && (
                        <div className="kelme-mega-menu-enter mt-3 pl-3 flex flex-col gap-4">
                          {item.columns.map((col) => (
                            <div key={col.title} className="flex flex-col gap-1.5">
                              <a
                                href={col.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="font-bold text-[15px] text-black"
                              >
                                {col.title}
                              </a>
                              {col.links.map((l) => (
                                <a
                                  key={l.label}
                                  href={l.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-[14px] text-black/65 pl-2"
                                >
                                  {l.label}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {expanded && item.groups && (
                        <div className="kelme-mega-menu-enter mt-3 pl-3 flex flex-col gap-4">
                          {item.groups.map((grp) => (
                            <div key={grp.title} className="flex flex-col gap-1.5">
                              <a
                                href={grp.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="font-bold text-[15px] text-black"
                              >
                                {grp.title}
                              </a>
                              {grp.links.map((l) => (
                                <a
                                  key={l.label}
                                  href={l.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-[14px] text-black/65 pl-2"
                                >
                                  {l.label}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-6 border-t border-[#d9d9d9] flex items-center justify-between text-[13px] kelme-heading">
              <span>
                {getCountryName(selectedCountry)} ({selectedCountry.currency})
              </span>
              <div className="flex items-center gap-2">
                {LANGUAGES_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLang(opt.code)}
                    className={`px-2 py-1 border text-[12px] cursor-pointer ${
                      lang === opt.code
                        ? 'border-black bg-black text-white'
                        : 'border-[#d9d9d9] text-black/70'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CART DRAWER (shopify-section--cart-drawer) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="kelme-overlay-fade fixed inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
          />
          <div className="kelme-drawer-right relative z-10 w-full max-w-[440px] bg-white h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#deddde] pb-5">
              <p className="kelme-heading text-[22px] text-[#231f20]">
                {t.cartTitle}
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-[#231f20] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                <p className="kelme-heading text-[20px] text-[#231f20]">
                  {t.cartEmpty}
                </p>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="kelme-pill-btn"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-4 items-center border-b border-[#deddde]/60 pb-5"
                    >
                      <img
                        src={item.product.primaryImg}
                        alt={getProductTitle(item.product)}
                        className="w-20 h-20 object-contain bg-neutral-50 shrink-0"
                      />
                      <div className="flex-1 flex flex-col gap-1">
                        <p className="text-[14px] font-bold text-[#231f20] leading-snug">
                          {getProductTitle(item.product)}
                        </p>
                        <p className="text-[13px] text-black/60">
                          {t.sizeLabel} {item.size}
                        </p>
                        <p className="text-[14px] text-[#ed1c24] font-bold">
                          {formatMoney(item.product.salePrice)}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="inline-flex items-center border border-[#d9d9d9]">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQty(item.product.id, item.size, -1)
                              }
                              className="px-2.5 py-0.5 text-sm cursor-pointer"
                            >
                              −
                            </button>
                            <span className="px-2.5 py-0.5 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQty(item.product.id, item.size, 1)
                              }
                              className="px-2.5 py-0.5 text-sm cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#deddde] pt-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[18px] font-bold">
                    <span className="kelme-heading">{t.totalLabel}</span>
                    <span>{formatMoney(totalCartAmount)}</span>
                  </div>
                  <p className="text-[13px] text-black/60">
                    {t.shippingNote}{' '}
                    {totalCartAmount >= 50 ? t.freeShippingQualify : ''}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      alert(t.orderPlacedAlert(formatMoney(totalCartAmount)));
                      setCart([]);
                      setCartOpen(false);
                    }}
                    className="kelme-pill-btn w-full"
                  >
                    {t.checkoutBtn}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. SEARCH DRAWER */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div
            className="kelme-overlay-fade fixed inset-0 bg-black/40"
            onClick={() => setSearchOpen(false)}
          />
          <div className="kelme-mega-menu-enter relative z-10 w-full bg-white p-6 sm:p-10 shadow-xl">
            <div className="max-w-[1150px] mx-auto flex flex-col gap-6">
              <div className="flex items-center gap-4 border-b border-[#d9d9d9] pb-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 38 38"
                  fill="none"
                  className="shrink-0"
                >
                  <path
                    d="M14 28C17.506 28 20.703 26.702 23.159 24.573L36 37.414L37.414 36L24.573 23.159C26.702 20.703 28 17.506 28 14C28 6.268 21.732 0 14 0C6.268 0 0 6.268 0 14C0 21.732 6.268 28 14 28ZM14 2C20.617 2 26 7.383 26 14C26 20.617 20.617 26 14 26C7.383 26 2 20.617 2 14C2 7.383 7.383 2 14 2Z"
                    fill="black"
                  />
                </svg>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 text-[18px] focus:outline-none text-black"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-black/60 hover:text-black transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {filteredSearchProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      openQuickBuy(p);
                    }}
                    className="kelme-mega-col-enter flex flex-col items-center text-center gap-2 group cursor-pointer"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <img
                      src={p.primaryImg}
                      alt={getProductTitle(p)}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-[14px] text-black line-clamp-1">
                      {getProductTitle(p)}
                    </span>
                    <span className="text-[14px] text-[#ed1c24] font-bold">
                      {formatMoney(p.salePrice)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. QUICK BUY MODAL (quick-buy-modal) */}
      {quickBuyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="kelme-overlay-fade fixed inset-0 bg-black/40"
            onClick={() => setQuickBuyProduct(null)}
          />
          <div className="kelme-modal-pop relative z-10 bg-white w-full max-w-[760px] p-6 sm:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <button
              type="button"
              onClick={() => setQuickBuyProduct(null)}
              className="absolute top-4 right-4 p-2 text-black/60 hover:text-black transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="relative aspect-square bg-white">
              <span className="absolute top-2 left-2 bg-[#ed1c24] text-white kelme-heading text-[11px] px-1.5 py-0.5">
                {quickBuyProduct.badge}
              </span>
              <img
                src={quickBuyProduct.primaryImg}
                alt={getProductTitle(quickBuyProduct)}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="kelme-heading text-[22px] leading-tight text-[#231f20]">
                {getProductTitle(quickBuyProduct)}
              </h3>

              <div className="flex items-center gap-3 text-[20px]">
                <span className="text-[#ed1c24] font-bold">
                  {formatMoney(quickBuyProduct.salePrice)}
                </span>
                <span className="text-black/50 line-through">
                  {formatMoney(quickBuyProduct.regularPrice)}
                </span>
              </div>

              <StarRating ratingStr={quickBuyProduct.rating} />

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[14px] font-bold text-[#231f20]">
                  {t.sizeEuLabel} {selectedSize}
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickBuyProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-[14px] border transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'border-black bg-black text-white font-bold'
                          : 'border-[#d9d9d9] bg-white text-black hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => addToCart(quickBuyProduct, selectedSize)}
                className="kelme-pill-btn mt-3 w-full"
              >
                {t.addToCartBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACCOUNT LOGIN MODAL */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="kelme-overlay-fade fixed inset-0 bg-black/40"
            onClick={() => setAccountOpen(false)}
          />
          <div className="kelme-modal-pop relative z-10 bg-white w-full max-w-[440px] p-8 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="kelme-heading text-[24px] text-[#231f20]">
                {t.loginTitle}
              </h3>
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className="p-1 text-black/60 hover:text-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[15px] text-black/70">{t.loginPrompt}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAccountOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                required
                placeholder={t.emailPlaceholder}
                className="w-full border border-[#d9d9d9] px-3.5 py-2.5 text-[16px] focus:outline-none focus:border-black"
              />
              <input
                type="password"
                required
                placeholder={t.passwordPlaceholder}
                className="w-full border border-[#d9d9d9] px-3.5 py-2.5 text-[16px] focus:outline-none focus:border-black"
              />
              <button type="submit" className="kelme-pill-btn w-full">
                {t.loginBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
