/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 bg-white/95 border-rose-200 text-slate-800 animate-in fade-in slide-in-from-bottom-4">
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
      )}
      <span className="text-sm font-semibold">{toast.message}</span>
    </div>
  );
};
