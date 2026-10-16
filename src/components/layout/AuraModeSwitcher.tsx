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
    <div className="fixed bottom-20 sm:bottom-5 left-3 sm:left-5 z-30 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full glass-card shadow-xl shadow-rose-200/50 border border-rose-200/80 max-w-[calc(100vw-1.5rem)] overflow-x-auto">
      <span className="pl-2 sm:pl-2.5 pr-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1 shrink-0">
        <Wand2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 animate-pulse" /> 
        <span className="hidden xs:inline">Aura:</span>
      </span>
      {BG_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => {
            setBgMode(m.id);
            showToast(`Aura switched to "${m.name}"`);
          }}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all shrink-0 ${
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
