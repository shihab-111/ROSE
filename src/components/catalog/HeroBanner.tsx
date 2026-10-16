/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, Droplets, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { handleImageError } from '../../constants';

export const HeroBanner: React.FC = () => {
  const { storeConfig, setIsQuizOpen, setQuizStep } = useStore();

  return (
    <section className="relative pt-6 pb-14 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-[2.25rem] p-6 sm:p-10 lg:p-14 shadow-2xl shadow-rose-200/40 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-300/40 via-pink-200/40 to-transparent blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-300/60 text-rose-700 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                {storeConfig.bannerBadge}
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight">
                {storeConfig.bannerTitle}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                {storeConfig.bannerSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <a
                  href="#catalog"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-rose-300/60 hover:shadow-rose-400/80 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {storeConfig.bannerCta}
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    setQuizStep(0);
                    setIsQuizOpen(true);
                  }}
                  className="px-6 py-4 rounded-full bg-white/90 hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Droplets className="w-4 h-4 text-rose-500" />
                  Find Your Signature Scent
                </button>
              </div>

              <div className="pt-6 border-t border-rose-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">100% Authentic</div>
                    <div className="text-[11px] text-slate-500">French & Grasse Oils</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">24-48h Delivery</div>
                    <div className="text-[11px] text-slate-500">Dhaka & All BD</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">bKash / COD</div>
                    <div className="text-[11px] text-slate-500">Pay on Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] p-3 bg-gradient-to-b from-white/90 via-rose-50/70 to-pink-100/80 border border-rose-200 shadow-2xl overflow-hidden group">
                <img
                  src={storeConfig.bannerImage}
                  alt={storeConfig.featuredBottleName}
                  onError={handleImageError}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover rounded-[1.5rem] animate-bottle transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">
                      Bestseller in Dhaka
                    </span>
                    <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                      {storeConfig.featuredBottleName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Extrait 100ml</span>
                    <span className="text-lg font-extrabold text-rose-600">
                      {storeConfig.featuredBottlePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
