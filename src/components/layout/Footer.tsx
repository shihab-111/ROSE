/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Phone, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { storeConfig, setActiveView, setIsQuizOpen, setQuizStep } = useStore();

  return (
    <footer className="relative z-10 bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-rose-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-wider text-white">
                {storeConfig.storeName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              French Haute Parfumerie engineered for Dhaka's luxury connoisseurs. 100% authentic Extrait de Parfum flacons and pure alcohol-free artisanal attars.
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
              <Phone className="w-4 h-4" /> Hotline: +880 1711-889900
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Atelier Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('storefront')} className="hover:text-rose-400 transition-colors">
                  Extraits de Parfum Pour Femme
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('storefront')} className="hover:text-rose-400 transition-colors">
                  Smoked Woods & Amber Pour Homme
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('storefront')} className="hover:text-rose-400 transition-colors">
                  Pure Sylheti Dehn al Oud
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('storefront')} className="hover:text-rose-400 transition-colors">
                  Bridal Velvet Coffret Sets
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Customer Concierge
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setQuizStep(0);
                    setIsQuizOpen(true);
                  }}
                  className="hover:text-rose-400 transition-colors"
                >
                  Personalized Scent Finder Quiz
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('track-order')} className="hover:text-rose-400 transition-colors">
                  Track Courier Consignment
                </button>
              </li>
              <li>
                <span className="hover:text-rose-400 transition-colors cursor-pointer">
                  Cash on Delivery Inspection Policy
                </span>
              </li>
              <li>
                <span className="hover:text-rose-400 transition-colors cursor-pointer">
                  Dhaka Same-Day Express
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Atelier Flagship
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              House 24, Road 11, Block G, Banani Commercial Area, Dhaka 1213, Bangladesh.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('admin')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Lock className="w-3.5 h-3.5" /> Staff Management Portal
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {storeConfig.storeName}. Handcrafted in Grasse & Dhaka. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> bKash & Nagad Live Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
