/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Copy, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { DEFAULT_STORE_CONFIG } from '../../constants';

export const AdminPaymentsTab: React.FC = () => {
  const {
    bannerForm,
    setBannerForm,
    handleSaveStoreConfig
  } = useAdmin();

  const { showToast } = useStore();

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-200/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
                Mobile Banking Numbers (bKash • Nagad • Rocket)
              </h2>
              <p className="text-xs text-slate-500">
                Configure your merchant or personal account numbers. Customers will copy these numbers with 1-tap during checkout to send payment and submit their TrxID.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) =>
            handleSaveStoreConfig(e, "bKash, Nagad & Rocket mobile banking numbers updated and active live!")
          }
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. bKash Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-pink-50/90 to-rose-50/70 border-2 border-pink-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#E2136E] text-white text-[11px] font-black tracking-wider uppercase shadow-sm">
                    bKash Payment
                  </span>
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                    Most Popular
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    bKash Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.bkashMerchant}
                    onChange={(e) => setBannerForm({ ...bannerForm, bkashMerchant: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E2136E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={bannerForm.bkashType || "Personal (Send Money)"}
                    onChange={(e) => setBannerForm({ ...bannerForm, bkashType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-800"
                  >
                    <option value="Personal (Send Money)">Personal (Send Money)</option>
                    <option value="Merchant (Make Payment)">Merchant (Make Payment)</option>
                    <option value="Agent (Cash Out)">Agent (Cash Out)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Customer Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={bannerForm.bkashInstructions || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, bkashInstructions: e.target.value })}
                    placeholder="Instructions for customer during checkout..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-pink-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Test Copy:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(bannerForm.bkashMerchant);
                    showToast(`Copied bKash Number: ${bannerForm.bkashMerchant}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-pink-300 text-xs font-bold text-[#E2136E] hover:bg-pink-100 transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy bKash
                </button>
              </div>
            </div>

            {/* 2. Nagad Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-orange-50/90 to-amber-50/70 border-2 border-orange-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#F7941D] text-white text-[11px] font-black tracking-wider uppercase shadow-sm">
                    Nagad Payment
                  </span>
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                    Instant
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nagad Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.nagadMerchant}
                    onChange={(e) => setBannerForm({ ...bannerForm, nagadMerchant: e.target.value })}
                    placeholder="018XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={bannerForm.nagadType || "Personal (Send Money)"}
                    onChange={(e) => setBannerForm({ ...bannerForm, nagadType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-orange-200 text-xs font-semibold text-slate-800"
                  >
                    <option value="Personal (Send Money)">Personal (Send Money)</option>
                    <option value="Merchant (Make Payment)">Merchant (Make Payment)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Customer Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={bannerForm.nagadInstructions || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, nagadInstructions: e.target.value })}
                    placeholder="Instructions for customer during checkout..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-orange-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-orange-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Test Copy:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(bannerForm.nagadMerchant);
                    showToast(`Copied Nagad Number: ${bannerForm.nagadMerchant}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-orange-300 text-xs font-bold text-[#F7941D] hover:bg-orange-100 transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Nagad
                </button>
              </div>
            </div>

            {/* 3. Rocket Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/90 to-indigo-50/70 border-2 border-purple-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#8C3494] text-white text-[11px] font-black tracking-wider uppercase shadow-sm">
                    DBBL Rocket
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    Banking
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Rocket Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.rocketMerchant}
                    onChange={(e) => setBannerForm({ ...bannerForm, rocketMerchant: e.target.value })}
                    placeholder="019XXXXXXXX-X"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-purple-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8C3494]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={bannerForm.rocketType || "Personal (Send Money)"}
                    onChange={(e) => setBannerForm({ ...bannerForm, rocketType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-semibold text-slate-800"
                  >
                    <option value="Personal (Send Money)">Personal (Send Money)</option>
                    <option value="Merchant (Make Payment)">Merchant (Make Payment)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Customer Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={bannerForm.rocketInstructions || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, rocketInstructions: e.target.value })}
                    placeholder="Instructions for customer during checkout..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-purple-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Test Copy:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(bannerForm.rocketMerchant);
                    showToast(`Copied Rocket Number: ${bannerForm.rocketMerchant}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-xs font-bold text-[#8C3494] hover:bg-purple-100 transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Rocket
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rose-200/80">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setBannerForm({
                    ...bannerForm,
                    bkashMerchant: DEFAULT_STORE_CONFIG.bkashMerchant,
                    nagadMerchant: DEFAULT_STORE_CONFIG.nagadMerchant,
                    rocketMerchant: DEFAULT_STORE_CONFIG.rocketMerchant,
                    bkashType: DEFAULT_STORE_CONFIG.bkashType,
                    nagadType: DEFAULT_STORE_CONFIG.nagadType,
                    rocketType: DEFAULT_STORE_CONFIG.rocketType
                  });
                  showToast("Restored demo standard mobile banking numbers");
                }}
                className="text-xs font-bold text-slate-500 hover:text-rose-700 underline"
              >
                Reset to Default Numbers
              </button>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                Immediate real-time sync to all customer checkout screens.
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-rose-300/60 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Save & Update Payment Numbers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
