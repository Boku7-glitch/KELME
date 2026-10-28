'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/storeConfig';
import ProductCard from './ProductCard';

export default function SearchOverlay() {
  const { products, isSearchOpen, setIsSearchOpen } = useStore();
  const [queryText, setQueryText] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      setQueryText('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = queryText.trim().toLowerCase();
  const results = q
    ? products
        .filter((p) =>
          `${p.model} ${p.color} ${p.id} ${CATEGORIES[p.cat]?.title || ''}`
            .toLowerCase()
            .includes(q)
        )
        .slice(0, 10)
    : products.filter((p) => p.disc >= 40).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      {/* Top Search Sheet */}
      <div className="relative z-10 bg-white shadow-2xl max-h-[88vh] overflow-y-auto border-b border-[#E6E6E3]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-4 border-b border-[#E6E6E3] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6B6F76] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="ძებნა: მოდელი, ფერი ან კოდი — მაგ. Elite, Heritage, თეთრი, 55147..."
            className="flex-1 h-11 text-base sm:text-lg font-medium outline-hidden bg-transparent"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="დახურვა"
            className="w-10 h-10 rounded-full hover:bg-[#F4F4F1] grid place-items-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-6">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#6B6F76] mb-4">
            {q ? `ნაპოვნია (${results.length})` : 'პოპულარული ფასდაკლებები'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F76] text-sm">
              „{queryText}“-ით პროდუქტი ვერ მოიძებნა
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
