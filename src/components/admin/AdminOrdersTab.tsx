/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Search, ShoppingCart, Printer, Copy } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { formatBDT } from '../../constants';
import type { OrderRecord } from '../../types';

export const AdminOrdersTab: React.FC = () => {
  const {
    handleCreateSampleOrder,
    adminOrderSearch,
    setAdminOrderSearch,
    adminOrderFilter,
    setAdminOrderFilter,
    setReceiptOrder,
    handleUpdateOrderStatus
  } = useAdmin();

  const { orders, showToast } = useStore();

  const filteredOrders = orders.filter((order) => {
    if (adminOrderFilter !== 'All' && order.status !== adminOrderFilter) return false;
    if (adminOrderSearch.trim()) {
      const q = adminOrderSearch.toLowerCase();
      const matchNo = order.orderNumber?.toLowerCase().includes(q);
      const matchName = order.customerName?.toLowerCase().includes(q);
      const matchPhone = order.phone?.includes(q);
      const matchTrx = order.trxId?.toLowerCase().includes(q);
      if (!matchNo && !matchName && !matchPhone && !matchTrx) return false;
    }
    return true;
  });

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">
            Customer Orders & Thermal Receipt POS
          </h2>
          <p className="text-xs text-slate-500">
            Verify bKash/Nagad transactions, dispatch couriers, and generate printable 80mm/58mm thermal receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateSampleOrder}
          className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
          title="Create sample order for thermal receipt testing"
        >
          <Plus className="w-4 h-4 text-rose-600" />
          <span>Create Sample Order</span>
        </button>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={adminOrderSearch}
            onChange={(e) => setAdminOrderSearch(e.target.value)}
            placeholder="Search Order ID, Customer, Phone, or TrxID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-rose-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setAdminOrderFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                adminOrderFilter === st
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">No Customer Orders Yet</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Click below to generate a realistic sample customer order and test the thermal POS receipt printing immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateSampleOrder}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all hover:opacity-95"
          >
            ⚡ Generate Sample Order for Thermal Print Testing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderNumber}
              className="p-5 rounded-2xl bg-white/90 border border-rose-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold">
                    {order.orderNumber}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {order.customerName}
                  </span>
                  <span className="text-xs font-semibold text-rose-600">
                    📞 {order.phone}
                  </span>
                  <span className="text-xs text-slate-400">
                    • {order.createdDateStr}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <strong>Delivery Address:</strong> {order.address}, {order.district} ({order.courier})
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-pink-50 border border-pink-200 text-rose-800 text-xs font-bold">
                    Payment: {order.paymentMethod}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                    TrxID: {order.trxId}
                  </span>
                  <span className="text-xs text-slate-600">
                    Items:{' '}
                    {(order.items || [])
                      .map((i) => `${i.name} (${i.volume}) x${i.quantity}`)
                      .join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center shrink-0">
                <div className="text-right mr-1">
                  <span className="text-[11px] text-slate-400 block">Grand Total</span>
                  <span className="text-lg font-extrabold text-rose-600">
                    {formatBDT(order.totalAmount)}
                  </span>
                </div>

                {/* Thermal Print Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setReceiptOrder(order)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                  title="Open Formatted Thermal POS Receipt"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-300" />
                  <span>Thermal Receipt</span>
                </button>

                {/* Quick 1-Click Print */}
                <button
                  type="button"
                  onClick={() => {
                    setReceiptOrder(order);
                    setTimeout(() => window.print(), 150);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all"
                  title="Instant 1-Click Print"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                </button>

                {/* Copy Courier Booking Note */}
                <button
                  type="button"
                  onClick={() => {
                    const courierText = `Order: ${order.orderNumber}
Customer: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address}, ${order.district}
Courier: ${order.courier}
Items: ${(order.items || []).map((i) => `${i.name} (${i.volume}) x${i.quantity}`).join(', ')}
COD Collection: ৳${order.paymentMethod === 'COD' ? order.totalAmount : 0}`;
                    navigator.clipboard?.writeText(courierText);
                    showToast(`Copied dispatch info for ${order.orderNumber}`);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                  title="Copy Courier Dispatch Note"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(order.orderNumber, e.target.value as OrderRecord['status'])
                  }
                  className="px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Confirmed">Confirmed & Packed</option>
                  <option value="Shipped">Handed to Courier</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
