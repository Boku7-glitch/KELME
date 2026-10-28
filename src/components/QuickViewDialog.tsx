'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react';
import {
  useStore,
  totalStockOf,
  formatMoney,
} from '../context/StoreContext';
import { CATEGORIES, SHOP_CONFIG } from '../data/storeConfig';

export default function QuickViewDialog() {
  const {
    byId,
    modelsMap,
    quickViewProductId,
    setQuickViewProductId,
    selectedSizeFilter,
    addToCart,
    navigateToProduct,
    setIsSizeGuideOpen,
    showToast,
  } = useStore();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState<string>('');

  const product = quickViewProductId ? byId[quickViewProductId] : null;

  // Sync selected size when product changes
  useEffect(() => {
    if (!product) return;
    if (selectedSizeFilter && (product.sizes[selectedSizeFilter] || 0) > 0) {
      setSelectedSize(selectedSizeFilter);
    } else {
      setSelectedSize('');
    }
    setSizeError('');
  }, [product, selectedSizeFilter]);

  // Open / close native <dialog> via showModal() & attach light-dismiss fallback
  // (Modern Web Guidance: light-dismiss-a-dialog)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (quickViewProductId && product) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [quickViewProductId, product]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      setQuickViewProductId(null);
    };

    dialog.addEventListener('close', handleClose);

    // Fallback for browsers without native <dialog closedby="any"> support
    const handleBackdropClick = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) {
        dialog.close();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [setQuickViewProductId]);

  if (!product) {
    return (
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as any)}
        aria-label="პროდუქტის სწრაფი ნახვა"
        className="m-auto p-0 rounded-2xl border-0 max-w-4xl w-[94vw] bg-white shadow-2xl"
      />
    );
  }

  const siblings = modelsMap[product.model.toLowerCase()] || [product.id];
  const allSizes = Array.from(
    new Set(siblings.flatMap((id) => Object.keys(byId[id]?.sizes || {})))
  ).sort((a, b) => Number(a) - Number(b));

  const stock = totalStockOf(product);

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError('გთხოვთ აირჩიოთ ზომა');
      return;
    }
    addToCart(product.id, selectedSize, true);
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as any)}
      aria-labelledby="quickview-title"
      className="m-auto p-0 rounded-3xl border-0 max-w-[960px] w-[94vw] max-h-[92vh] overflow-y-auto bg-white text-[#111214] shadow-2xl backdrop:bg-black/55"
    >
      <div className="relative grid grid-cols-1 md:grid-cols-[1.08fr_1fr]">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="დახურვა"
          className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-white shadow-md grid place-items-center hover:bg-[#F4F4F1] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Gallery */}
        <div className="bg-[#F4F4F1] p-8 sm:p-10 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[440px]">
          {product.disc > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#D7141E] text-white font-black text-sm">
              −{product.disc}%
            </span>
          )}
          <img
            src={product.img}
            alt={`${product.model} ${product.color}`}
            fetchPriority="low"
            className="w-full max-w-[380px] object-contain mix-blend-multiply"
          />
        </div>

        {/* Right: Product Info & Size Selection */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#6B6F76]">
              {CATEGORIES[product.cat]?.title || product.cat}
            </div>
            <h2
              id="quickview-title"
              className="text-2xl sm:text-3xl font-black mt-1 leading-tight"
            >
              {product.model}
            </h2>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2.5 mt-3">
              {product.disc > 0 ? (
                <>
                  <span className="text-2xl font-black text-[#D7141E]">
                    {formatMoney(product.sale)}
                  </span>
                  <del className="text-base text-[#6B6F76]">
                    {formatMoney(product.price)}
                  </del>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-[#D7141E] font-bold text-xs">
                    დაზოგე {formatMoney(product.price - product.sale)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black text-[#111214]">
                  {formatMoney(product.sale)}
                </span>
              )}
            </div>

            {/* Color Variants */}
            <div className="mt-5">
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span>ფერი</span>
                <span className="font-normal text-[#6B6F76] text-xs">
                  {product.color}
                </span>
              </div>
              {siblings.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {siblings.map((sibId) => {
                    const sib = byId[sibId];
                    if (!sib) return null;
                    return (
                      <button
                        key={sibId}
                        type="button"
                        onClick={() => setQuickViewProductId(sibId)}
                        title={sib.color}
                        className={`w-15 h-15 rounded-xl bg-[#F4F4F1] p-1.5 border-2 transition-all ${
                          sibId === product.id
                            ? 'border-[#111214]'
                            : 'border-[#E6E6E3] hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={sib.img}
                          alt={sib.color}
                          fetchPriority="low"
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* EU Sizes */}
            <div className="mt-5">
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span>ზომა (EU)</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-normal text-[#6B6F76]">
                    {stock} წყვილი მარაგში
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      dialogRef.current?.close();
                      setIsSizeGuideOpen(true);
                    }}
                    className="underline font-semibold text-[#111214]"
                  >
                    ზომების ცხრილი
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {allSizes.map((sz) => {
                  const qty = product.sizes[sz] || 0;
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={qty <= 0}
                      onClick={() => {
                        setSelectedSize(sz);
                        setSizeError('');
                      }}
                      className={`relative h-11 rounded-lg border text-sm font-bold transition-all ${
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

              {sizeError && (
                <div className="text-xs font-bold text-[#D7141E] mt-2">
                  {sizeError}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full h-12 rounded-full bg-[#D7141E] hover:bg-[#B00F17] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                კალათაში დამატება{selectedSize ? ` · ზომა ${selectedSize}` : ''}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const id = product.id;
                  dialogRef.current?.close();
                  navigateToProduct(id);
                }}
                className="h-11 rounded-full border-2 border-[#111214] text-[#111214] hover:bg-[#111214] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>სრული გვერდი</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  showToast('გაიხსნება KELME საქართველოს Messenger ჩატი')
                }
                className="h-11 rounded-full border border-[#E6E6E3] hover:border-[#111214] text-[#111214] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>კითხვა ზომაზე?</span>
              </button>
            </div>

            <ul className="pt-4 mt-2 border-t border-[#E6E6E3] text-xs space-y-1.5 text-[#6B6F76]">
              <li className="flex justify-between">
                <span>კოდი</span>
                <strong className="text-[#111214] font-mono">
                  {product.id}
                </strong>
              </li>
              <li className="flex justify-between">
                <span>აღება</span>
                <strong className="text-[#111214]">
                  ისთ ფოინთი, Sport Avenue (უფასო)
                </strong>
              </li>
              <li className="flex justify-between">
                <span>გადახდა</span>
                <strong className="text-[#111214]">
                  მაღაზიაში ან ონლაინ ბარათით
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </dialog>
  );
}
