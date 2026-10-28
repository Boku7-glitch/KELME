'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Product } from '../types/store';
import {
  useStore,
  totalStockOf,
  formatMoney,
} from '../context/StoreContext';
import { CATEGORIES, getSwatchBackground } from '../data/storeConfig';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { byId, modelsMap, navigateToProduct, setQuickViewProductId } =
    useStore();

  const [previewId, setPreviewId] = useState<string>(product.id);
  const activeProduct = byId[previewId] || product;

  const siblings = modelsMap[product.model.toLowerCase()] || [product.id];
  const stock = totalStockOf(activeProduct);
  const isLowStock = stock > 0 && stock <= 3;

  return (
    <div className="group flex flex-col cursor-pointer">
      {/* Product Image Box */}
      <div
        onClick={() => navigateToProduct(activeProduct.id)}
        className="relative aspect-square rounded-2xl bg-[#F4F4F1] overflow-hidden flex items-center justify-center p-5 transition-colors"
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10 pointer-events-none">
          {activeProduct.disc > 0 ? (
            <span className="px-2.5 py-1 rounded-md bg-[#D7141E] text-white font-black text-xs tracking-tight shadow-2xs">
              −{activeProduct.disc}%
            </span>
          ) : (
            <span />
          )}

          {isLowStock && (
            <span className="px-2.5 py-1 rounded-md bg-white/95 border border-[#E6E6E3] text-[#111214] font-semibold text-[11.5px] shadow-2xs">
              ბოლო {stock} წყვილი
            </span>
          )}
        </div>

        {/* Product Image (Modern Web Guidance: optimize-image-priority) */}
        <img
          src={activeProduct.img}
          alt={`${activeProduct.model} ${activeProduct.color}`}
          width={600}
          height={600}
          {...(priority
            ? { fetchPriority: 'high' as const }
            : { loading: 'lazy' as const })}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-350 group-hover:scale-106"
        />

        {/* Quick View Hover Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProductId(activeProduct.id);
          }}
          className="hidden sm:flex absolute left-3 right-3 bottom-3 h-11 rounded-full bg-[#111214]/95 hover:bg-black text-white font-bold text-xs items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-md z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>სწრაფი ნახვა</span>
        </button>
      </div>

      {/* Product Meta */}
      <div
        onClick={() => navigateToProduct(activeProduct.id)}
        className="pt-3 px-0.5 flex-1 flex flex-col"
      >
        <div className="text-[12px] text-[#6B6F76] font-medium">
          {CATEGORIES[activeProduct.cat]?.title || activeProduct.cat}
        </div>
        <h3 className="font-bold text-[15.5px] text-[#111214] mt-0.5 leading-snug group-hover:text-[#D7141E] transition-colors">
          {activeProduct.model}
        </h3>
        <div className="text-[12.5px] text-[#6B6F76] mb-1.5">
          {activeProduct.color}
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto">
          {activeProduct.disc > 0 ? (
            <>
              <span className="font-black text-[17.5px] text-[#D7141E]">
                {formatMoney(activeProduct.sale)}
              </span>
              <del className="text-[13.5px] text-[#6B6F76]">
                {formatMoney(activeProduct.price)}
              </del>
            </>
          ) : (
            <span className="font-black text-[17.5px] text-[#111214]">
              {formatMoney(activeProduct.sale)}
            </span>
          )}
        </div>

        {/* Sibling Color Variant Swatches */}
        {siblings.length > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 mt-2.5"
          >
            {siblings.map((sibId) => {
              const sib = byId[sibId];
              if (!sib) return null;
              const isSelected = sibId === activeProduct.id;
              return (
                <button
                  key={sibId}
                  type="button"
                  onMouseEnter={() => setPreviewId(sibId)}
                  onClick={() => setPreviewId(sibId)}
                  title={sib.color}
                  aria-label={`ფერი: ${sib.color}`}
                  className={`w-6 h-6 rounded-md overflow-hidden border transition-all ${
                    isSelected
                      ? 'border-[#111214] ring-1 ring-[#111214] scale-105'
                      : 'border-[#E6E6E3] opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={sib.img}
                    alt={sib.color}
                    loading="lazy"
                    className="w-full h-full object-contain bg-[#F4F4F1] mix-blend-multiply"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
