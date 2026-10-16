/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ShoppingBag, Truck, Lock, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cart,
    setIsCartOpen,
    setCheckoutStep,
    setIsQuizOpen,
    setQuizStep
  } = useStore();

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-rose-100 shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 pt-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setActiveView('storefront')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            activeView === 'storefront' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Atelier</span>
        </button>

        <button
          onClick={() => {
            setActiveView('storefront');
            const catalogEl = document.getElementById('catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-rose-600 transition-all"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => {
            setQuizStep(0);
            setIsQuizOpen(true);
          }}
          className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-rose-600 transition-all"
        >
          <div className="w-8 h-8 -mt-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-rose-700">Quiz</span>
        </button>

        <button
          onClick={() => setActiveView('track-order')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            activeView === 'track-order' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px]">Track</span>
        </button>

        <button
          onClick={() => {
            setCheckoutStep('cart');
            setIsCartOpen(true);
          }}
          className="relative flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-rose-600 transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="text-[10px]">Bag</span>
        </button>

        <button
          onClick={() => setActiveView('admin')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            activeView === 'admin' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      </div>
    </nav>
  );
};
