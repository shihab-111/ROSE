/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { handleImageError, formatBDT } from '../../constants';

export const ScentQuizModal: React.FC = () => {
  const {
    isQuizOpen,
    setIsQuizOpen,
    quizStep,
    setQuizStep,
    quizAnswers,
    setQuizAnswers,
    recommendedQuizProduct,
    addToCart,
    setIsCartOpen
  } = useStore();

  if (!isQuizOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-card bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative">
        <button
          onClick={() => setIsQuizOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {quizStep === 0 && (
          <div className="space-y-5 text-center">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              Olfactory Profiling
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-slate-900">
              What is your signature scent mood?
            </h3>
            <div className="grid grid-cols-1 gap-3 text-left">
              {[
                { id: 'floral', title: '🌸 Romantic Damask Rose & Peony', desc: 'Soft, feminine, radiant & graceful' },
                { id: 'oud', title: '🔥 Royal Sylheti Oud & Saffron', desc: 'Rich, smoky, opulent & 24h longevity' },
                { id: 'sweet', title: '🥂 Pink Champagne & Whipped Vanilla', desc: 'Playful gourmand, sweet & magnetic' },
                { id: 'woody', title: '🌲 Sandalwood, Vetiver & Crystal Amber', desc: 'Modern unisex signature, bold & clean' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQuizAnswers({ ...quizAnswers, vibe: opt.id });
                    setQuizStep(1);
                  }}
                  className="p-4 rounded-2xl border border-rose-200 hover:border-rose-500 hover:bg-rose-50/70 transition-all text-left"
                >
                  <div className="font-bold text-sm text-slate-900">{opt.title}</div>
                  <div className="text-xs text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {quizStep === 1 && recommendedQuizProduct && (
          <div className="space-y-5 text-center">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              Your Bespoke Signature Match
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-slate-900">
              {recommendedQuizProduct.name}
            </h3>
            <img
              src={recommendedQuizProduct.image}
              alt={recommendedQuizProduct.name}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
              className="w-40 h-44 object-cover rounded-2xl mx-auto border border-rose-200 shadow-md"
            />
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {recommendedQuizProduct.description}
            </p>
            <div className="text-xl font-extrabold text-rose-600">
              {formatBDT(recommendedQuizProduct.price)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setQuizStep(0)}
                className="w-1/3 py-3 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={() => {
                  addToCart(recommendedQuizProduct, 1);
                  setIsQuizOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-200 hover:opacity-95 transition-all"
              >
                Add Match to Bag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
