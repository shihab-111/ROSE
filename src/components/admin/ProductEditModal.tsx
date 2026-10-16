/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { LUXURY_BOTTLE_PRESETS, handleImageError } from '../../constants';
import type { PerfumeProduct } from '../../types';

export const ProductEditModal: React.FC = () => {
  const {
    isProductModalOpen,
    setIsProductModalOpen,
    editingProduct,
    productForm,
    setProductForm,
    handleSaveProduct
  } = useAdmin();

  if (!isProductModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card bg-white rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-200 my-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-5">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
              {editingProduct ? `Edit Perfume: ${editingProduct.name}` : 'Add New Fragrance Flacon'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure formulation pricing in BDT, production costs, bottle image URL, and olfactory pyramid.
            </p>
          </div>
          <button
            onClick={() => setIsProductModalOpen(false)}
            className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perfume Name *</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="e.g., Velvet Rose & Oud"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Concentration / Subtitle *</label>
              <input
                type="text"
                required
                value={productForm.subtitle}
                onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                placeholder="e.g., Extrait de Parfum"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value as PerfumeProduct['category'] })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              >
                <option value="For Her">For Her</option>
                <option value="For Him">For Him</option>
                <option value="Unisex">Unisex</option>
                <option value="Luxury Attar/Oud">Luxury Attar/Oud</option>
                <option value="Gift Sets">Gift Sets</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scent Family</label>
              <select
                value={productForm.scentFamily}
                onChange={(e) => setProductForm({ ...productForm, scentFamily: e.target.value as PerfumeProduct['scentFamily'] })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              >
                <option value="Floral">Floral</option>
                <option value="Oriental">Oriental</option>
                <option value="Woody">Woody</option>
                <option value="Fresh">Fresh</option>
                <option value="Gourmand">Gourmand</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bottle Volume</label>
              <input
                type="text"
                value={productForm.volume}
                onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                placeholder="100ml / 50ml / 30ml"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Product Cost (৳)</label>
              <input
                type="number"
                required
                value={productForm.costPrice}
                onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-rose-700 mb-1">Selling Price (৳) *</label>
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm font-extrabold text-rose-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Regular Price (৳)</label>
              <input
                type="number"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Units *</label>
              <input
                type="number"
                required
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-9">
                <label className="block text-xs font-bold text-slate-700 mb-1">Bottle Image URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                />
              </div>
              <div className="sm:col-span-3 flex justify-center">
                <img
                  src={productForm.image}
                  alt="Preview"
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 rounded-2xl object-cover border border-rose-300 shadow-sm"
                />
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-rose-600 mb-1.5">
                Or Quick-Select a Preset Luxury Flacon:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {LUXURY_BOTTLE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => setProductForm({ ...productForm, image: preset.url })}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-left shrink-0 transition-all ${
                      productForm.image === preset.url
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-rose-50/70 text-slate-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="text-[11px] font-bold">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-600 mb-1">Top Notes</label>
              <input
                type="text"
                value={productForm.topNotes}
                onChange={(e) => setProductForm({ ...productForm, topNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-pink-600 mb-1">Heart Notes</label>
              <input
                type="text"
                value={productForm.middleNotes}
                onChange={(e) => setProductForm({ ...productForm, middleNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-800 mb-1">Base Notes</label>
              <input
                type="text"
                value={productForm.baseNotes}
                onChange={(e) => setProductForm({ ...productForm, baseNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fragrance Story</label>
            <textarea
              rows={2}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-rose-100">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-300/60 hover:opacity-95 transition-all"
            >
              {editingProduct ? 'Save Product Changes' : 'Create Fragrance Flacon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
