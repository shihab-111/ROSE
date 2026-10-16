/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import type { PerfumeProduct } from '../../types';
import { useStore } from '../../context/StoreContext';
import { handleImageError, formatBDT } from '../../constants';

interface ProductCardProps {
  product: PerfumeProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    getProductVolume,
    getDynamicPrice,
    setSelectedVolumes,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    addToCart
  } = useStore();

  const activeVol = getProductVolume(product);
  const activePrice = getDynamicPrice(product.price, activeVol, product.volume || "100ml");
  const activeOrigPrice = getDynamicPrice(product.originalPrice, activeVol, product.volume || "100ml");
  const discountPercent =
    activeOrigPrice > activePrice
      ? Math.round(((activeOrigPrice - activePrice) / activeOrigPrice) * 100)
      : 0;

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden shadow-lg shadow-rose-100/50 hover:shadow-2xl hover:shadow-rose-300/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-rose-50 to-pink-100/50">
        <img
          src={product.image}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />

        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-rose-800 text-[10px] font-bold tracking-wider uppercase border border-rose-200">
            {product.category}
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              wishlist.includes(product.id)
                ? 'bg-rose-600 text-white'
                : 'bg-white/90 text-slate-700 hover:text-rose-600'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setQuickViewProduct(product)}
            title="Inspect Olfactory Pyramid"
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-rose-600 text-slate-700 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md text-white text-[11px] font-semibold">
            {activeVol}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold ${
              product.stock > 5
                ? 'bg-emerald-900/70 text-emerald-100'
                : product.stock > 0
                ? 'bg-amber-900/75 text-amber-100'
                : 'bg-rose-900/80 text-rose-100'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
            <span>{product.subtitle}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating || 4.9}
            </span>
          </div>

          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-serif-luxury text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Bottle Decant & Size Buttons */}
          <div className="mt-2.5 flex items-center gap-1">
            {["10ml Decant", "30ml", "50ml", "100ml"].map((vol) => (
              <button
                key={vol}
                type="button"
                onClick={() =>
                  setSelectedVolumes((prev) => ({ ...prev, [product.id]: vol }))
                }
                className={`flex-1 py-1.5 min-h-[32px] rounded-lg text-[10px] font-bold border transition-all touch-manipulation active:scale-95 ${
                  activeVol === vol
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white/80 text-slate-600 border-rose-200/80 hover:bg-rose-50'
                }`}
              >
                {vol === "10ml Decant" ? "10ml" : vol}
              </button>
            ))}
          </div>

          {/* Olfactory Notes Preview */}
          <div className="mt-2.5 p-2.5 rounded-2xl bg-rose-50/80 border border-rose-100 space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 truncate">
              <span className="font-bold text-rose-600 uppercase text-[10px] w-10 shrink-0">Top:</span>
              <span className="truncate">
                {Array.isArray(product.topNotes) ? product.topNotes.join(', ') : product.topNotes}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 truncate">
              <span className="font-bold text-pink-600 uppercase text-[10px] w-10 shrink-0">Heart:</span>
              <span className="truncate">
                {Array.isArray(product.middleNotes) ? product.middleNotes.join(', ') : product.middleNotes}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 truncate">
              <span className="font-bold text-rose-800 uppercase text-[10px] w-10 shrink-0">Base:</span>
              <span className="truncate">
                {Array.isArray(product.baseNotes) ? product.baseNotes.join(', ') : product.baseNotes}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-rose-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-xl font-extrabold text-rose-600">
              {formatBDT(activePrice)}
            </div>
            {activeOrigPrice > activePrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatBDT(activeOrigPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1, activeVol)}
            disabled={product.stock <= 0}
            className={`px-4 py-2.5 min-h-[42px] rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
              product.stock > 0
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-200 hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};
