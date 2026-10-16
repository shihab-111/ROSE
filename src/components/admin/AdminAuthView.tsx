/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';

export const AdminAuthView: React.FC = () => {
  const {
    adminPinInput,
    setAdminPinInput,
    adminPinError,
    handleAdminUnlock,
    setIsAdminUnlocked
  } = useAdmin();
  const { showToast } = useStore();

  return (
    <div className="max-w-md mx-auto glass-card rounded-[2rem] p-8 shadow-2xl border border-rose-200 text-center my-10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-300/50">
        <Lock className="w-8 h-8" />
      </div>
      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-widest">
        Executive Management Suite
      </span>
      <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-2">
        Admin Authentication
      </h2>
      <p className="text-xs text-slate-500 mt-1 mb-6">
        Enter your Admin Security PIN to manage live products, pricing, hero banner, and verify bKash/Nagad transactions.
      </p>

      <form onSubmit={handleAdminUnlock} className="space-y-4">
        <input
          type="password"
          value={adminPinInput}
          onChange={(e) => setAdminPinInput(e.target.value)}
          placeholder="Security PIN (Demo PIN: 2026)"
          className="w-full px-4 py-3.5 rounded-xl bg-white border border-rose-200 text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        {adminPinError && (
          <p className="text-xs text-rose-600 font-semibold">{adminPinError}</p>
        )}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-300/60 hover:opacity-95 transition-all"
        >
          Unlock Admin Suite
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-rose-200/70">
        <button
          onClick={() => {
            setAdminPinInput('2026');
            setIsAdminUnlocked(true);
            showToast("Admin Portal unlocked in Demo Mode!");
          }}
          className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold transition-all"
        >
          ⚡ Instant Demo Unlock (PIN: 2026)
        </button>
      </div>
    </div>
  );
};
