/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Edit3, Plus } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { formatBDT, handleImageError } from '../../constants';

export const AdminOverviewTab: React.FC = () => {
  const {
    adminMetrics,
    setAdminTab,
    openAddProductModal,
    openEditProductModal
  } = useAdmin();

  const { storeConfig, products, orders } = useStore();

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-rose-600 tracking-wider">
            Total Revenue (BDT)
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {formatBDT(adminMetrics.totalRevenue)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Excludes cancelled orders</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">
            Estimated Gross Profit
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {formatBDT(adminMetrics.netProfit)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Revenue minus formulation cost</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-pink-600 tracking-wider">
            Total Customer Orders
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {adminMetrics.totalOrders}
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            {adminMetrics.pendingOrdersCount} Pending Verification
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">
            Active Catalog Items
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {products.length}
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-1">
            {adminMetrics.lowStockProducts.length} Fragrances Low in Stock
          </p>
        </div>
      </div>

      {/* Quick Mobile Banking Gateways Widget */}
      <div className="glass-card p-5 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-rose-50/70 via-pink-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif-luxury text-lg font-bold text-slate-900">
                Active Mobile Banking Gateways
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Live on Checkout
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-lg bg-pink-100 text-pink-800 font-bold font-mono">
                bKash: {storeConfig.bkashMerchant}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-800 font-bold font-mono">
                Nagad: {storeConfig.nagadMerchant}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-bold font-mono">
                Rocket: {storeConfig.rocketMerchant}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdminTab('payments')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Change / Set Numbers</span>
        </button>
      </div>

      {/* Stock Watch & Recent Orders Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
              Stock & Cost Margin Watch
            </h3>
            <button
              onClick={openAddProductModal}
              className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-rose-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Flacon
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {products.map((p) => {
              const unitProfit = Number(p.price) - Number(p.costPrice || Math.round(p.price * 0.5));
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/85 border border-rose-100"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                      <span className="text-[11px] text-slate-500">
                        Cost: {formatBDT(p.costPrice || 1500)} • Sell: {formatBDT(p.price)} •{' '}
                        <strong className="text-emerald-600">Margin: {formatBDT(unitProfit)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        p.stock <= 15
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {p.stock} units
                    </span>
                    <button
                      onClick={() => openEditProductModal(p)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
              Recent Orders Queue
            </h3>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              View All ({orders.length}) →
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              No customer orders yet. Place a test order from the storefront!
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {orders.slice(0, 6).map((o) => (
                <div
                  key={o.orderNumber}
                  className="p-3.5 rounded-2xl bg-white/85 border border-rose-100 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-600">{o.orderNumber}</span>
                      <span className="text-xs font-bold text-slate-800">{o.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {o.phone} • {o.district} • <strong>{o.paymentMethod}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatBDT(o.totalAmount)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
