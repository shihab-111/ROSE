/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wand2 } from 'lucide-react';
import { BG_MODES } from '../../constants';
import { useStore } from '../../context/StoreContext';

export const AuraModeSwitcher: React.FC = () => {
  const { bgMode, setBgMode, showToast } = useStore();

  return (
    <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full glass-card shadow-xl shadow-rose-200/50 border border-rose-200/80">
      <span className="pl-2.5 pr-1 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1">
        <Wand2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Aura BG:
      </span>
      {BG_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => {
            setBgMode(m.id);
            showToast(`Aura switched to "${m.name}"`);
          }}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
            bgMode === m.id
              ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
          }`}
        >
          {m.shortLabel}
        </button>
      ))}
    </div>
  );
};
