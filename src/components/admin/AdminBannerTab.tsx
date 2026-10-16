/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { BG_MODES, handleImageError } from '../../constants';

export const AdminBannerTab: React.FC = () => {
  const {
    bannerForm,
    setBannerForm,
    handleSaveStoreConfig
  } = useAdmin();

  const { setBgMode } = useStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <form onSubmit={handleSaveStoreConfig} className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">
            Banner & Delivery Charge Editor
          </h2>
          <p className="text-xs text-slate-500">
            Customize hero banners, top announcements, background aura, and Bangladesh courier rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={bannerForm.storeName}
              onChange={(e) => setBannerForm({ ...bannerForm, storeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Banner Promo Badge</label>
            <input
              type="text"
              value={bannerForm.bannerBadge}
              onChange={(e) => setBannerForm({ ...bannerForm, bannerBadge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Top Announcement Bar Text</label>
          <input
            type="text"
            value={bannerForm.announcementText}
            onChange={(e) => setBannerForm({ ...bannerForm, announcementText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Title</label>
          <input
            type="text"
            value={bannerForm.bannerTitle}
            onChange={(e) => setBannerForm({ ...bannerForm, bannerTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle</label>
          <textarea
            rows={2}
            value={bannerForm.bannerSubtitle}
            onChange={(e) => setBannerForm({ ...bannerForm, bannerSubtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Banner Flacon Image URL</label>
            <input
              type="url"
              value={bannerForm.bannerImage}
              onChange={(e) => setBannerForm({ ...bannerForm, bannerImage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Featured Bottle Caption & Price</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={bannerForm.featuredBottleName}
                onChange={(e) => setBannerForm({ ...bannerForm, featuredBottleName: e.target.value })}
                placeholder="Bottle Name"
                className="w-2/3 px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              />
              <input
                type="text"
                value={bannerForm.featuredBottlePrice}
                onChange={(e) => setBannerForm({ ...bannerForm, featuredBottlePrice: e.target.value })}
                placeholder="৳3,850"
                className="w-1/3 px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-rose-200">
          <h4 className="font-bold text-xs uppercase tracking-wider text-rose-600 mb-3">
            Default Animated Background & Courier Charges
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
            {BG_MODES.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setBannerForm({ ...bannerForm, bgAnimationMode: m.id });
                  setBgMode(m.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  bannerForm.bgAnimationMode === m.id
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-600 shadow-md'
                    : 'bg-white/90 text-slate-700 border-rose-200 hover:bg-rose-50'
                }`}
              >
                <div className="text-xs font-extrabold">{m.name}</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    bannerForm.bgAnimationMode === m.id ? 'text-rose-100' : 'text-slate-500'
                  }`}
                >
                  {m.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Inside Dhaka (৳)</label>
              <input
                type="number"
                value={bannerForm.insideDhakaFee}
                onChange={(e) => setBannerForm({ ...bannerForm, insideDhakaFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Dhaka Suburbs (৳)</label>
              <input
                type="number"
                value={bannerForm.suburbsDhakaFee}
                onChange={(e) => setBannerForm({ ...bannerForm, suburbsDhakaFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Outside Dhaka (৳)</label>
              <input
                type="number"
                value={bannerForm.outsideDhakaFee}
                onChange={(e) => setBannerForm({ ...bannerForm, outsideDhakaFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Free Ship Over (৳)</label>
              <input
                type="number"
                value={bannerForm.freeShippingThreshold}
                onChange={(e) => setBannerForm({ ...bannerForm, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">bKash Merchant No.</label>
              <input
                type="text"
                value={bannerForm.bkashMerchant}
                onChange={(e) => setBannerForm({ ...bannerForm, bkashMerchant: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nagad Merchant No.</label>
              <input
                type="text"
                value={bannerForm.nagadMerchant}
                onChange={(e) => setBannerForm({ ...bannerForm, nagadMerchant: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Rocket Merchant No.</label>
              <input
                type="text"
                value={bannerForm.rocketMerchant}
                onChange={(e) => setBannerForm({ ...bannerForm, rocketMerchant: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Admin Security PIN</label>
              <input
                type="text"
                value={bannerForm.adminPin}
                onChange={(e) => setBannerForm({ ...bannerForm, adminPin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-rose-300/60 hover:opacity-95 transition-all"
        >
          Save & Publish Store Settings Live
        </button>
      </form>

      <div className="lg:col-span-5 space-y-4">
        <div className="glass-card rounded-3xl p-6 border border-rose-200">
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 block mb-3">
            Instant Live Hero Preview
          </span>
          <div className="rounded-2xl p-5 bg-gradient-to-br from-rose-50 via-pink-50 to-white border border-rose-200 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {bannerForm.bannerBadge}
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-slate-900 leading-tight">
              {bannerForm.bannerTitle}
            </h3>
            <p className="text-xs text-slate-600">
              {bannerForm.bannerSubtitle}
            </p>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-rose-200 relative">
              <img
                src={bannerForm.bannerImage}
                alt="Banner Preview"
                onError={handleImageError}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 glass-card p-3 rounded-xl flex justify-between items-center">
                <span className="font-serif-luxury font-bold text-sm text-slate-900">
                  {bannerForm.featuredBottleName}
                </span>
                <span className="font-extrabold text-xs text-rose-600">
                  {bannerForm.featuredBottlePrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
