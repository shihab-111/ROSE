/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import { CanvasBackground } from './components/layout/CanvasBackground';
import { AnnouncementBanner } from './components/layout/AnnouncementBanner';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { Footer } from './components/layout/Footer';
import { AuraModeSwitcher } from './components/layout/AuraModeSwitcher';
import { Toast } from './components/layout/Toast';
import { IOSGuideModal } from './components/layout/IOSGuideModal';
import { HeroBanner } from './components/catalog/HeroBanner';
import { FilterBar } from './components/catalog/FilterBar';
import { ProductGrid } from './components/catalog/ProductGrid';
import { BrandStorySection } from './components/catalog/BrandStorySection';
import { QuickViewModal } from './components/catalog/QuickViewModal';
import { ScentQuizModal } from './components/quiz/ScentQuizModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const MainLayout: React.FC = () => {
  const { bgMode, activeView } = useStore();
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-800 selection:bg-rose-500 selection:text-white">
      {/* Dynamic Keyframe & Glass Utility Styles */}
      <style>{`
        @keyframes liquidMorph1 {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          33% {
            border-radius: 35% 65% 65% 35% / 45% 55% 45% 55%;
            transform: translate(65px, -35px) scale(1.1) rotate(8deg);
          }
          66% {
            border-radius: 50% 50% 35% 65% / 55% 35% 65% 45%;
            transform: translate(-35px, 45px) scale(0.94) rotate(-6deg);
          }
        }

        @keyframes liquidMorph2 {
          0%, 100% {
            border-radius: 40% 60% 60% 40% / 50% 60% 40% 50%;
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          50% {
            border-radius: 65% 35% 45% 55% / 40% 45% 55% 60%;
            transform: translate(-75px, 50px) scale(1.14) rotate(-10deg);
          }
        }

        @keyframes liquidMorph3 {
          0%, 100% {
            border-radius: 55% 45% 40% 60% / 45% 55% 45% 55%;
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            border-radius: 35% 65% 60% 40% / 60% 40% 60% 40%;
            transform: translate(55px, -60px) scale(1.12);
          }
        }

        @keyframes prismBeamSweep {
          0%, 100% { transform: translateX(-12%) rotate(32deg) scaleY(1); opacity: 0.45; }
          50% { transform: translateX(18%) rotate(32deg) scaleY(1.08); opacity: 0.85; }
        }

        @keyframes bottleLevitate {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1.2deg); }
        }

        .animate-liquid-blob-1 { animation: liquidMorph1 18s ease-in-out infinite; }
        .animate-liquid-blob-2 { animation: liquidMorph2 22s ease-in-out infinite; }
        .animate-liquid-blob-3 { animation: liquidMorph3 20s ease-in-out infinite; }
        .animate-prism-beam-1 { animation: prismBeamSweep 14s ease-in-out infinite; }
        .animate-prism-beam-2 { animation: prismBeamSweep 19s ease-in-out infinite reverse; }
        .animate-bottle { animation: bottleLevitate 6s ease-in-out infinite; }

        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(251, 207, 232, 0.8);
        }
        .glass-nav {
          background: rgba(255, 249, 251, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(244, 114, 182, 0.22);
        }
      `}</style>

      {/* 60FPS Fluid Scent Animated Background */}
      <CanvasBackground mode={bgMode} />

      {/* Floating Aura Mode Switcher */}
      <AuraModeSwitcher />

      {/* Toast Alert */}
      <Toast />

      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="relative z-40 bg-amber-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0" />
          <span>Offline Mode — You are browsing cached fragrances and your bag is safely saved.</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBanner />

      {/* Sticky Header Nav */}
      <Navbar />

      {/* Active View Container */}
      {activeView === 'storefront' && (
        <main className="relative z-10 pb-24">
          <HeroBanner />
          <FilterBar />
          <ProductGrid />
          <BrandStorySection />
        </main>
      )}

      {activeView === 'track-order' && <OrderTrackingView />}

      {activeView === 'admin' && <AdminDashboard />}

      {/* Global Modals & Drawers */}
      <QuickViewModal />
      <ScentQuizModal />
      <CartDrawer />
      <IOSGuideModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <MainLayout />
      </AdminProvider>
    </StoreProvider>
  );
}
