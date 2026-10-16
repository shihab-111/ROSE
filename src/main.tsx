import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-white border border-rose-200 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
              🌸
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">
              Éclat de Rose
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We encountered a slight display glitch while optimizing for your mobile device network.
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-rose-50 text-[11px] text-rose-700 font-mono text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={async () => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                  if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(k => caches.delete(k)));
                  }
                  if ('serviceWorker' in navigator) {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    for (const r of regs) await r.unregister();
                  }
                } catch {}
                window.location.reload();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-200 hover:opacity-95 transition-all"
            >
              Reset & Reload Luxury Boutique
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Actively unregister any legacy service workers and clear stale caches on mobile devices
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister().catch(() => {});
      }
    }).catch(() => {});
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) caches.delete(key).catch(() => {});
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
