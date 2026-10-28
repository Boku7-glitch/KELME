'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SHOP_CONFIG } from '../data/storeConfig';

export default function Footer() {
  const {
    navigateToCategory,
    navigateToInfo,
    navigateToStore,
    navigateToTeam,
    setIsSizeGuideOpen,
    toastMessage,
    showToast,
  } = useStore();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [year, setYear] = useState(2026);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email: email.trim() }),
      });
      if (res.ok) {
        setEmail('');
        showToast('გმადლობთ! გამოწერა წარმატებით შეინახა');
      } else {
        showToast('შეიყვანეთ სწორი ელფოსტის მისამართი');
      }
    } catch {
      showToast('გამოწერა შეინახა ლოკალურად');
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <footer className="bg-[#111214] text-[#C9CBCF] pt-14 pb-8 mt-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 pb-10 border-b border-[#2A2C30]">
            {/* Brand & Newsletter */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-2xl tracking-[0.14em] text-white">
                  KELME
                </span>
                <span className="text-xs text-[#9A9DA3] font-semibold">
                  საქართველო
                </span>
              </div>
              <p className="text-sm text-[#9A9DA3] mt-3 max-w-sm leading-relaxed">
                KELME-ს ოფიციალური წარმომადგენლობა საქართველოში · Sport Avenue,
                ს/ც ისთ ფოინთი. მიიღე ინფორმაცია ახალ კოლექციებსა და
                ფასდაკლებებზე პირველმა.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 mt-4 max-w-sm"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="შენი ელფოსტა"
                  aria-label="ელფოსტა"
                  className="flex-1 h-11 rounded-full border border-[#33363B] bg-[#1B1D20] text-white px-4 text-sm outline-hidden focus:border-white"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-5 rounded-full bg-[#D7141E] hover:bg-[#B00F17] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  გამოწერა
                </button>
              </form>
            </div>

            {/* Shop Categories */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                მაღაზია
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToCategory('football')}
                    className="hover:text-white transition-colors"
                  >
                    ფეხბურთი · ფუტსალი
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToCategory('sport')}
                    className="hover:text-white transition-colors"
                  >
                    სპორტი & სირბილი
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToCategory('casual')}
                    className="hover:text-white transition-colors"
                  >
                    ყოველდღიური
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToCategory('kids')}
                    className="hover:text-white transition-colors"
                  >
                    ბავშვები (27–35)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToCategory('sale')}
                    className="text-[#FF5A60] font-bold hover:text-white transition-colors"
                  >
                    SALE / Outlet (−70%)
                  </button>
                </li>
              </ul>
            </div>

            {/* Help & Info */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                დახმარება
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToInfo('order')}
                    className="hover:text-white transition-colors"
                  >
                    როგორ შევუკვეთო
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToInfo('returns')}
                    className="hover:text-white transition-colors"
                  >
                    გაცვლა და დაბრუნება
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    ზომების ცხრილი (EU)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={navigateToTeam}
                    className="hover:text-white transition-colors"
                  >
                    გუნდური ფორმები (B2B)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={navigateToStore}
                    className="hover:text-white transition-colors"
                  >
                    მაღაზია და კონტაქტი
                  </button>
                </li>
              </ul>
            </div>

            {/* Ecosystem & Social */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                პარტნიორები & ქსელები
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={SHOP_CONFIG.academySisterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <span>საფეხბურთო აკადემია ტფილისი</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={SHOP_CONFIG.globalReferenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white"
                  >
                    <span>KELME კატალოგი (Global)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Facebook გვერდის ბმული: config → facebook')
                    }
                    className="hover:text-white transition-colors"
                  >
                    Facebook
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Instagram გვერდის ბმული: config → instagram')
                    }
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </button>
                </li>
                <li className="pt-1">
                  <Link
                    href="/admin"
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    მენეჯერის პანელი (/admin)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9DA3]">
            <span>
              © {year} KELME საქართველო · Sport Avenue (East
              Point)
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigateToInfo('privacy')}
                className="hover:text-white"
              >
                კონფიდენციალურობა
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigateToInfo('terms')}
                className="hover:text-white"
              >
                წესები და პირობები
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Messenger Contact Button */}
      <button
        type="button"
        onClick={() =>
          showToast('აქ გაიხსნება KELME საქართველოს Messenger ჩატი')
        }
        aria-label="მოგვწერე Messenger-ში"
        className="fixed right-5 bottom-5 z-30 h-12 px-4 rounded-full bg-gradient-to-tr from-[#0A7CFF] to-[#A033FF] text-white font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">მოგვწერე</span>
      </button>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 z-50 bg-[#111214] text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xl border border-white/15 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-[92vw] text-center">
          {toastMessage}
        </div>
      )}
    </>
  );
}
