/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    setSelectedCategory,
    setSelectedFamily,
    setSearchQuery,
    setPriceRange
  } = useStore();

  if (filteredProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-card rounded-3xl p-12 text-center my-8">
          <Sparkles className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-800 mb-2">
            No Fragrances Match Your Filter
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Try adjusting the budget slider or resetting category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedFamily('All');
              setSearchQuery('');
              setPriceRange(10000);
            }}
            className="px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
