'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SHOP_CONFIG } from '../data/storeConfig';
import { FilterCategoryKey } from '../types/store';

export default function Navbar() {
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    activeView,
    activeCategory,
    navigateHome,
    navigateToCategory,
    navigateToTeam,
    navigateToStore,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [annIdx, setAnnIdx] = useState(0);

  const announcements = SHOP_CONFIG.announcements;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAnnIdx((i) => (i + 1) % announcements.length);
    }, 4800);
    return () => clearInterval(t);
  }, [announcements.length]);

  const navItems: {
    label: string;
    cat?: FilterCategoryKey;
    action?: () => void;
    isSale?: boolean;
  }[] = [
    { label: 'ფეხბურთი', cat: 'football' },
    { label: 'სპორტი', cat: 'sport' },
    { label: 'ყოველდღიური', cat: 'casual' },
    { label: 'ბავშვები', cat: 'kids' },
    { label: 'გუნდური ფორმები', action: navigateToTeam },
    { label: 'მაღაზია', action: navigateToStore },
    { label: 'SALE −70%', cat: 'sale', isSale: true },
  ];

  return (
    <>
      {/* Top Announcement & Sister-Project Ecosystem Bar */}
      <div className="bg-[#111214] text-white text-xs border-b border-white/10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4">
          {/* Sister Project Link: Tfilisi Football Academy */}
          <a
            href={SHOP_CONFIG.academySisterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-300 hover:text-white transition-colors shrink-0"
            title="გადასვლა საფეხბურთო აკადემია ტფილისის საიტზე"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>პარტნიორი: საფეხბურთო აკადემია ტფილისი</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          {/* Rotating Promo Announcement */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() =>
                setAnnIdx(
                  (i) => (i - 1 + announcements.length) % announcements.length
                )
              }
              aria-label="წინა შეთავაზება"
              className="text-white/60 hover:text-white p-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="truncate font-bold tracking-wide uppercase text-[11.5px] text-center">
              {announcements[annIdx]}
            </div>
            <button
              type="button"
              onClick={() => setAnnIdx((i) => (i + 1) % announcements.length)}
              aria-label="შემდეგი შეთავაზება"
              className="text-white/60 hover:text-white p-1"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Location & Admin Quick Link */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-white/75 shrink-0">
            <span>ისთ ფოინთი · Sport Avenue</span>
            <span className="text-white/25">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>მარაგი & ადმინი</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 bg-white/96 backdrop-blur-md transition-all ${
          scrolled ? 'border-b border-[#E6E6E3] shadow-2xs' : 'border-b border-[#E6E6E3]'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-17 flex items-center justify-between gap-6">
          {/* Left: Mobile Burger + KELME Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full hover:bg-[#F4F4F1] grid place-items-center"
              aria-label={mobileMenuOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={navigateHome}
              className="flex items-baseline gap-2 text-left group"
              aria-label="KELME საქართველო მთავარი"
            >
              <span className="font-black text-2xl sm:text-[26px] tracking-[0.14em] text-[#111214] group-hover:text-[#D7141E] transition-colors">
                KELME
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#6B6F76] tracking-normal">
                საქართველო
              </span>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                (item.cat &&
                  (activeView === 'collection' || activeView === 'home') &&
                  activeCategory === item.cat) ||
                (item.label === 'გუნდური ფორმები' && activeView === 'team') ||
                (item.label === 'მაღაზია' && activeView === 'store');

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.cat) {
                      navigateToCategory(item.cat);
                    } else if (item.action) {
                      item.action();
                    }
                  }}
                  className={`px-3.5 py-2 rounded-lg text-[14.5px] font-bold transition-colors cursor-pointer ${
                    item.isSale
                      ? 'text-[#D7141E] hover:bg-red-50 font-black'
                      : isActive
                        ? 'bg-[#111214] text-white'
                        : 'text-[#111214] hover:bg-[#F4F4F1]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Search, Admin, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden xl:inline-block text-[11px] font-bold text-[#6B6F76] mr-1">
              GE · ₾
            </span>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="ძებნა"
              title="ძებნა (მოდელი, ფერი ან კოდი)"
              className="w-10 h-10 rounded-full hover:bg-[#F4F4F1] grid place-items-center transition-colors"
            >
              <Search className="w-5 h-5 text-[#111214]" />
            </button>

            <Link
              href="/admin"
              title="მარაგის და შეკვეთების მართვა (Admin)"
              className="lg:hidden w-10 h-10 rounded-full hover:bg-[#F4F4F1] grid place-items-center transition-colors text-[#111214]"
              aria-label="ადმინ პანელი"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="კალათა"
              title="კალათა"
              className="relative w-10 h-10 rounded-full hover:bg-[#F4F4F1] grid place-items-center transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-[#111214]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#D7141E] text-white text-[10.5px] font-black grid place-items-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E6E6E3] bg-white px-4 py-4 space-y-1.5 shadow-xl">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.cat) navigateToCategory(item.cat);
                  else if (item.action) item.action();
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-base flex items-center justify-between ${
                  item.isSale
                    ? 'text-[#D7141E] bg-red-50/70 font-black'
                    : 'text-[#111214] hover:bg-[#F4F4F1]'
                }`}
              >
                <span>{item.label}</span>
                <span>→</span>
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-[#E6E6E3] flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#F4F4F1] text-[#111214] text-xs font-bold flex items-center justify-between"
              >
                <span>⚙️ მარაგის და შეკვეთების მართვა (Admin)</span>
                <span>→</span>
              </Link>
              <a
                href={SHOP_CONFIG.academySisterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-bold flex items-center justify-between"
              >
                <span>⚽ საფეხბურთო აკადემია ტფილისი</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
