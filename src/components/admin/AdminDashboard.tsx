/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Settings, 
  BarChart3, 
  Package, 
  CreditCard, 
  Edit3, 
  ShoppingCart, 
  Layers 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { AdminAuthView } from './AdminAuthView';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminPaymentsTab } from './AdminPaymentsTab';
import { AdminBannerTab } from './AdminBannerTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminGitHubTab } from './AdminGitHubTab';
import { ProductEditModal } from './ProductEditModal';
import { ThermalReceiptModal } from './ThermalReceiptModal';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminUnlocked,
    setIsAdminUnlocked,
    adminTab,
    setAdminTab
  } = useAdmin();

  const { products, orders } = useStore();

  if (!isAdminUnlocked) {
    return <AdminAuthView />;
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Analytics & Revenue', icon: BarChart3 },
    { id: 'products' as const, label: `Perfumes (${products.length})`, icon: Package },
    { id: 'payments' as const, label: 'bKash / Nagad / Rocket', icon: CreditCard },
    { id: 'banner' as const, label: 'Banner & BD Fees', icon: Edit3 },
    { id: 'orders' as const, label: `Orders (${orders.length})`, icon: ShoppingCart },
    { id: 'github' as const, label: 'Deployment Guide', icon: Layers }
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        {/* Header Navigation Bar */}
        <div className="glass-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
                  Executive Admin Suite
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  ● Live Sync Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage hero banners, costs, margins, product catalog, and bKash / Nagad order delivery queues.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setAdminTab(t.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    adminTab === t.id
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-300/50'
                      : 'bg-white/90 text-slate-700 hover:bg-rose-50 border border-rose-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}

            <button
              onClick={() => setIsAdminUnlocked(false)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-bold transition-all"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Tab Panes */}
        {adminTab === 'dashboard' && <AdminOverviewTab />}
        {adminTab === 'products' && <AdminProductsTab />}
        {adminTab === 'payments' && <AdminPaymentsTab />}
        {adminTab === 'banner' && <AdminBannerTab />}
        {adminTab === 'orders' && <AdminOrdersTab />}
        {adminTab === 'github' && <AdminGitHubTab />}

        {/* Modals */}
        <ProductEditModal />
        <ThermalReceiptModal />
      </div>
    </section>
  );
};
