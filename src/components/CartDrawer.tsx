'use client';

import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore, formatMoney } from '../context/StoreContext';

export default function CartDrawer() {
  const {
    cart,
    byId,
    isCartOpen,
    setIsCartOpen,
    cartSubtotal,
    cartSavings,
    updateCartQuantity,
    removeFromCart,
    navigateToProduct,
    navigateToCheckout,
    navigateToCategory,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer Panel */}
      <aside
        aria-label="კალათა"
        className="relative z-10 w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E6E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#111214]" />
            <h3 className="font-black text-xl tracking-tight">კალათა</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="დახურვა"
            className="w-9 h-9 rounded-full hover:bg-[#F4F4F1] grid place-items-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-[#E6E6E3]">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F4F4F1] mx-auto grid place-items-center text-[#6B6F76]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-[#6B6F76] text-sm font-medium">
                შენი კალათა ცარიელია
              </p>
              <button
                type="button"
                onClick={() => navigateToCategory('all')}
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#111214] text-white text-sm font-bold"
              >
                ფეხსაცმლის ნახვა
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const p = byId[item.id];
              if (!p) return null;
              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="py-4 grid grid-cols-[84px_1fr_auto] gap-3.5 items-start"
                >
                  <button
                    type="button"
                    onClick={() => navigateToProduct(p.id)}
                    className="w-[84px] h-[84px] rounded-xl bg-[#F4F4F1] p-2 overflow-hidden"
                  >
                    <img
                      src={p.img}
                      alt={p.model}
                      fetchPriority="low"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>

                  <div>
                    <button
                      type="button"
                      onClick={() => navigateToProduct(p.id)}
                      className="font-bold text-sm text-[#111214] hover:text-[#D7141E] text-left"
                    >
                      {p.model}
                    </button>
                    <div className="text-xs text-[#6B6F76] mt-0.5">
                      {p.color} · ზომა {item.size}
                    </div>

                    <div className="inline-flex items-center border border-[#E6E6E3] rounded-full mt-2.5 h-8">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(idx, -1)}
                        aria-label="რაოდენობის შემცირება"
                        className="w-7 h-full font-bold text-sm hover:bg-[#F4F4F1] rounded-l-full"
                      >
                        −
                      </button>
                      <span className="min-w-[24px] text-center text-xs font-extrabold">
                        {item.q}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(idx, 1)}
                        aria-label="რაოდენობის გაზრდა"
                        className="w-7 h-full font-bold text-sm hover:bg-[#F4F4F1] rounded-r-full"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-[#111214]">
                      {formatMoney(p.sale * item.q)}
                    </div>
                    {p.disc > 0 && (
                      <del className="text-xs text-[#6B6F76] block">
                        {formatMoney(p.price * item.q)}
                      </del>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFromCart(idx)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#6B6F76] hover:text-[#D7141E] underline mt-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>წაშლა</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#E6E6E3] bg-[#F4F4F1]/40 space-y-3">
            {cartSavings > 0 && (
              <div className="flex justify-between text-xs font-bold text-[#12784A]">
                <span>ფასდაკლებით დაზოგე</span>
                <span>−{formatMoney(cartSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black text-[#111214]">
              <span>ჯამი</span>
              <span>{formatMoney(cartSubtotal)}</span>
            </div>
            <p className="text-xs text-[#6B6F76]">
              აღება ისთ ფოინთიდან (Sport Avenue) უფასოა. ასევე მოქმედებს
              მიწოდება თბილისსა და რეგიონებში.
            </p>
            <button
              type="button"
              onClick={navigateToCheckout}
              className="w-full h-12 rounded-full bg-[#D7141E] hover:bg-[#B00F17] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>შეკვეთის გაფორმება</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
