/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Gift, Award } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="glass-card rounded-[2.25rem] p-8 sm:p-12 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-rose-100/80 border border-rose-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              Bespoke for Bangladesh
            </span>
            <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
              Why Fragrance Connoisseurs Choose Éclat de Rose
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Subtropical heat requires deeper perfume oil concentrations. Each flacon contains 25%-35% pure Extrait de Parfum essences for all-day trail in Dhaka.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/85 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2">
              <Flame className="w-7 h-7 text-rose-600" />
              <h4 className="font-bold text-slate-900 text-sm">24-Hour Tropical Projection</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reinforced with Cambodian Oud, Ambroxan, and Cashmere Musk to project through humidity.
              </p>
            </div>
            <div className="bg-white/85 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2">
              <Gift className="w-7 h-7 text-rose-600" />
              <h4 className="font-bold text-slate-900 text-sm">Complimentary Coffret & Samples</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every order arrives in a velvet keepsake box with 2 free 2ml discovery spray vials.
              </p>
            </div>
            <div className="bg-white/85 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2">
              <Award className="w-7 h-7 text-rose-600" />
              <h4 className="font-bold text-slate-900 text-sm">Doorstep Inspection & COD</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect your sealed box at your doorstep anywhere in Bangladesh before paying courier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
