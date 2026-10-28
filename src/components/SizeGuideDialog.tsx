'use client';

import React, { useEffect, useRef } from 'react';
import { X, Ruler } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SIZE_GUIDE_DATA } from '../data/storeConfig';

export default function SizeGuideDialog() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isSizeGuideOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isSizeGuideOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => setIsSizeGuideOpen(false);
    dialog.addEventListener('close', onClose);

    // Fallback for browsers without closedby support (Modern Web Guidance: light-dismiss-a-dialog)
    const onBackdropClick = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    };

    dialog.addEventListener('click', onBackdropClick);
    return () => {
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('click', onBackdropClick);
    };
  }, [setIsSizeGuideOpen]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as any)}
      aria-labelledby="size-guide-title"
      className="m-auto p-0 rounded-2xl border-0 max-w-lg w-[92vw] max-h-[88vh] overflow-y-auto bg-white text-[#111214] shadow-2xl"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6E3]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#D7141E]" />
            <h2 id="size-guide-title" className="font-black text-xl">
              KELME ზომების ცხრილი (EU / სმ)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="დახურვა"
            className="w-9 h-9 rounded-full hover:bg-[#F4F4F1] grid place-items-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#6B6F76] mt-3 leading-relaxed">
          KELME-ს ფეხსაცმელი სტანდარტული ევროპული (EU) ზომისაა. თუ ორ ზომას
          შორის ხართ, საფეხბურთო ბუცებზე რეკომენდებულია ზუსტი/მჭიდრო ზომა,
          ხოლო სარბენ და ყოველდღიურ მოდელებზე — ნახევარი ზომით თავისუფალი.
        </p>

        <div className="mt-4 border border-[#E6E6E3] rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#111214] text-white text-xs uppercase">
                <th className="py-2.5 px-4 font-bold">EU ზომა</th>
                <th className="py-2.5 px-4 font-bold">ტერფის სიგრძე (სმ)</th>
                <th className="py-2.5 px-4 font-bold">კატეგორია</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E3] text-xs sm:text-sm">
              {SIZE_GUIDE_DATA.map((row) => (
                <tr key={row.eu} className="hover:bg-[#F4F4F1]/60">
                  <td className="py-2 px-4 font-black">{row.eu}</td>
                  <td className="py-2 px-4 font-mono">{row.cm} სმ</td>
                  <td className="py-2 px-4 text-[#6B6F76] text-xs">
                    {Number(row.eu) <= 35 ? 'ბავშვები (Kids)' : 'უფროსები (Adult)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </dialog>
  );
}
