/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, Clock, Wind, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { handleImageError, formatBDT } from '../../constants';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    setIsCartOpen
  } = useStore();

  if (!quickViewProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card bg-white/95 rounded-[2.25rem] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center hover:bg-rose-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50 border border-rose-200">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                onError={handleImageError}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                {quickViewProduct.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                {quickViewProduct.volume}
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
              {quickViewProduct.name}
            </h2>
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest">
              {quickViewProduct.subtitle}
            </p>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-rose-600">
                {formatBDT(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-base text-slate-400 line-through">
                  {formatBDT(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {quickViewProduct.description}
            </p>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/70 border border-rose-200 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-rose-700 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Olfactory Scent Pyramid
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white text-rose-600 font-bold w-24 text-center border border-rose-100">
                  Top Notes
                </span>
                <span className="text-slate-700 font-medium">
                  {Array.isArray(quickViewProduct.topNotes)
                    ? quickViewProduct.topNotes.join(' • ')
                    : quickViewProduct.topNotes}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white text-pink-600 font-bold w-24 text-center border border-rose-100">
                  Heart Notes
                </span>
                <span className="text-slate-700 font-medium">
                  {Array.isArray(quickViewProduct.middleNotes)
                    ? quickViewProduct.middleNotes.join(' • ')
                    : quickViewProduct.middleNotes}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white text-rose-900 font-bold w-24 text-center border border-rose-100">
                  Base Notes
                </span>
                <span className="text-slate-700 font-medium">
                  {Array.isArray(quickViewProduct.baseNotes)
                    ? quickViewProduct.baseNotes.join(' • ')
                    : quickViewProduct.baseNotes}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> Longevity
                  </span>
                  <span className="text-rose-600">{quickViewProduct.longevity || 90}%</span>
                </div>
                <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    style={{ width: `${quickViewProduct.longevity || 90}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-rose-500" /> Sillage
                  </span>
                  <span className="text-rose-600">{quickViewProduct.sillage || 85}%</span>
                </div>
                <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    style={{ width: `${quickViewProduct.sillage || 85}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, 1);
                  setQuickViewProduct(null);
                  setIsCartOpen(true);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-300/60 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag — {formatBDT(quickViewProduct.price)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
