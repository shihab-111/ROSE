/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ShoppingBag, Truck, Lock, Plus, Settings } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const Navbar: React.FC = () => {
  const {
    storeConfig,
    activeView,
    setActiveView,
    setIsCartOpen,
    setCheckoutStep,
    cart,
    setIsQuizOpen,
    setQuizStep,
    setShowIOSGuide
  } = useStore();

  const { isInstallable, isInstalled, isIOS, install: installPWA } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={() => setActiveView('storefront')}
          className="text-left group focus:outline-none shrink-0"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-300/50 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-serif-luxury text-xl sm:text-3xl font-bold tracking-wider bg-gradient-to-r from-rose-900 via-rose-700 to-pink-600 bg-clip-text text-transparent block leading-none">
                {storeConfig.storeName}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-rose-500 font-semibold uppercase block mt-0.5">
                {storeConfig.tagline}
              </span>
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1 bg-rose-50/80 p-1.5 rounded-full border border-rose-200/60">
          <button
            onClick={() => setActiveView('storefront')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeView === 'storefront'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-rose-600'
            }`}
          >
            Perfume Atelier
          </button>
          <button
            onClick={() => {
              setQuizStep(0);
              setIsQuizOpen(true);
            }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-rose-600 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Scent Finder Quiz
          </button>
          <button
            onClick={() => setActiveView('track-order')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeView === 'track-order'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-rose-600'
            }`}
          >
            Track BD Order
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white shadow-sm'
                : 'text-rose-700 hover:bg-rose-100/70'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Admin Portal
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* PWA Install Button */}
          {isInstallable && !isInstalled && (
            <button
              onClick={installPWA}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-sm transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          {/* iOS Safari Guide Button */}
          {isIOS && !isInstalled && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] sm:text-xs font-bold border border-rose-200 transition-all shrink-0"
            >
              <span>Install on iOS</span>
            </button>
          )}

          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'storefront' : 'admin')}
            className="lg:hidden p-2 rounded-xl bg-rose-100/80 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200"
            title="Admin Portal"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('track-order')}
            title="Track Order"
            className="p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-rose-100 shadow-sm transition-all"
          >
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => {
              setCheckoutStep('cart');
              setIsCartOpen(true);
            }}
            className="relative flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-300/50 hover:shadow-rose-400/60 hover:scale-[1.02] transition-all"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Bag</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white text-rose-700 text-xs font-bold leading-none">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
