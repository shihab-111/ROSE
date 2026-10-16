/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatBDT } from '../../constants';

export const FilterBar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedFamily,
    setSelectedFamily,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange
  } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            Curated Olfactory Library
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
            Explore by Fragrance Notes
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['All', 'Floral', 'Oriental', 'Woody', 'Fresh', 'Gourmand'].map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedFamily === fam
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-300/60'
                  : 'bg-white/80 text-slate-700 hover:bg-rose-100/60 border border-rose-200/70'
              }`}
            >
              {fam === 'All' ? '✨ All Scent Families' : `🌸 ${fam}`}
            </button>
          ))}
        </div>
      </div>

      <div id="catalog" className="glass-card rounded-3xl p-4 sm:p-6 shadow-lg shadow-rose-100/60 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'For Her', 'For Him', 'Unisex', 'Luxury Attar/Oud', 'Gift Sets'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                    : 'bg-rose-50/70 text-slate-700 hover:bg-rose-100/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="md:col-span-3 relative">
            <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rose, oud, vanilla..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/90 border border-rose-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Max Budget</span>
                <span className="text-rose-600 font-bold">{formatBDT(priceRange)}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="10000"
                step="250"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-1.5 bg-rose-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
