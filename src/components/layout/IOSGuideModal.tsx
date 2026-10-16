/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const IOSGuideModal: React.FC = () => {
  const { showIOSGuide, setShowIOSGuide } = useStore();

  if (!showIOSGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl border border-rose-200">
        <button
          onClick={() => setShowIOSGuide(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-2">
          Install Éclat de Rose on iOS
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Enjoy our luxury perfume catalog as an ultra-fast standalone app on your iPhone or iPad:
        </p>

        <ol className="space-y-3 text-xs text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span>
              Tap the <strong>Share</strong> button (the square icon with an arrow pointing up) at the bottom of Safari.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span>
              Scroll down and tap <strong>Add to Home Screen</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span>
              Tap <strong>Add</strong> in the top-right corner to launch directly from your home screen.
            </span>
          </li>
        </ol>

        <button
          onClick={() => setShowIOSGuide(false)}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-200"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};
