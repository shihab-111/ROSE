/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { formatBDT, handleImageError } from '../../constants';

export const AdminProductsTab: React.FC = () => {
  const {
    openAddProductModal,
    openEditProductModal,
    handleDeleteProduct
  } = useAdmin();

  const { products } = useStore();

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">
            Perfume Catalog & Cost Manager
          </h2>
          <p className="text-xs text-slate-500">
            Update formulation costs, selling prices, bottle photography URLs, olfactory notes, and stock levels.
          </p>
        </div>
        <button
          onClick={openAddProductModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-300/50 flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Fragrance
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-rose-200 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-3 px-3">Flacon & Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Unit Cost</th>
              <th className="py-3 px-3">Selling Price</th>
              <th className="py-3 px-3">Stock</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100 text-xs sm:text-sm">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-rose-50/50 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-xl object-cover border border-rose-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{prod.name}</div>
                      <div className="text-xs text-slate-500">{prod.subtitle}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-semibold">
                    {prod.category}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1">{prod.volume} • {prod.scentFamily}</span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-600">
                  {formatBDT(prod.costPrice || Math.round(prod.price * 0.5))}
                </td>
                <td className="py-3.5 px-3 font-extrabold text-rose-600">
                  {formatBDT(prod.price)}
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      prod.stock > 10
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {prod.stock} units
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => openEditProductModal(prod)}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs transition-all flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
