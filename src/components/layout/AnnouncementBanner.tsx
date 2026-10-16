/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBanner: React.FC = () => {
  const { storeConfig } = useStore();

  return (
    <div className="relative z-30 bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 text-center font-medium tracking-wide shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="truncate max-w-[90vw]">{storeConfig.announcementText}</span>
        <span className="hidden md:inline-block text-rose-200">|</span>
        <span className="hidden md:inline-flex items-center gap-1 text-rose-100 text-xs">
          <Truck className="w-3.5 h-3.5 shrink-0" /> Steadfast & Pathao Express Across 64 Districts
        </span>
      </div>
    </div>
  );
};
