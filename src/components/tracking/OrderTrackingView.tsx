/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatBDT } from '../../constants';

export const OrderTrackingView: React.FC = () => {
  const {
    trackQuery,
    setTrackQuery,
    orders,
    setActiveView
  } = useStore();

  const filteredOrders = orders.filter(
    (o) =>
      trackQuery.trim() !== '' &&
      (o.phone?.includes(trackQuery.trim()) ||
        o.orderNumber?.toLowerCase().includes(trackQuery.trim().toLowerCase()))
  );

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-24 sm:pb-16">
      <div className="glass-card rounded-[2rem] p-6 sm:p-10 shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-widest">
            Real-Time Courier Tracking
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Track Your Luxury Perfume Order
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Enter your 11-digit Bangladeshi mobile number or Order ID (e.g. EDR-123456)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
          <input
            type="text"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            placeholder="Enter 017XXXXXXXX or EDR-..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            onClick={() => setActiveView('storefront')}
            className="px-5 py-3.5 rounded-2xl bg-rose-100 text-rose-700 font-bold text-xs hover:bg-rose-200 transition-all"
          >
            Back to Shop
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderNumber}
              className="p-6 rounded-2xl bg-white/90 border border-rose-200 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-rose-600">{order.orderNumber}</span>
                  <h4 className="font-bold text-slate-800">{order.customerName}</h4>
                  <span className="text-xs text-slate-500">{order.createdDateStr}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Confirmed'
                        ? 'bg-purple-100 text-purple-700'
                        : order.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    ● {order.status}
                  </span>
                  <div className="text-sm font-extrabold text-rose-600 mt-1">
                    Total: {formatBDT(order.totalAmount)} ({order.paymentMethod})
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                <span>
                  <strong>Courier:</strong> {order.courier}
                </span>
                <span>
                  <strong>Address:</strong> {order.address}, {order.district}
                </span>
              </div>
            </div>
          ))}

          {trackQuery.trim() !== '' && filteredOrders.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-6">
              No matching orders found for "{trackQuery}".
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
