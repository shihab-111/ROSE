/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const AdminGitHubTab: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="border-b border-rose-200 pb-4">
        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-widest">
          Production Export Ready
        </span>
        <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
          Push Éclat de Rose to GitHub & Deploy Live
        </h2>
        <p className="text-xs text-slate-500">
          The application contains self-healing local persistence so it operates anywhere right away.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 text-rose-100 font-mono text-xs space-y-3 overflow-x-auto">
          <div className="text-rose-400 font-bold uppercase tracking-wider">
            GitHub Command Sequence
          </div>
          <pre className="text-[11px] leading-relaxed text-slate-200">{`git init
git add .
git commit -m "feat: launch Eclat de Rose luxury perfume boutique"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eclat-de-rose-bd.git
git push -u origin main`}</pre>
        </div>

        <div className="p-5 rounded-2xl bg-white/90 border border-rose-200 space-y-4">
          <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Vercel / Cloud Run One-Click Deploy
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            To deploy with zero setup, simply connect your GitHub repository to Vercel or Cloud Run. The Vite build will bundle the entire responsive single-page luxury application.
          </p>
        </div>
      </div>
    </div>
  );
};
