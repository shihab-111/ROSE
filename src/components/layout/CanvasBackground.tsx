/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import type { BgMode } from '../../types';

interface CanvasBackgroundProps {
  mode: BgMode;
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use desynchronized & alpha for maximum GPU performance on mobile browsers
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    // Mobile detection: Mobile devices get DPR=1.0 for huge GPU fillrate savings and solid 60FPS
    const checkIsMobile = () => window.innerWidth < 768;
    let isMobile = checkIsMobile();
    const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);

    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;

    const setupCanvasSize = () => {
      canvas.width = Math.max(cssWidth, 320) * dpr;
      canvas.height = Math.max(cssHeight, 320) * dpr;
    };
    setupCanvasSize();

    // Prevent resize thrashing during mobile scrolling (Safari/Chrome toolbar collapse)
    let lastWidth = cssWidth;
    let lastHeight = cssHeight;
    let resizeTimeout: any = null;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        // Only re-dimension canvas if width changed (rotation) or height changed drastically (> 120px)
        if (newWidth !== lastWidth || Math.abs(newHeight - lastHeight) > 120) {
          lastWidth = newWidth;
          lastHeight = newHeight;
          cssWidth = newWidth;
          cssHeight = newHeight;
          isMobile = checkIsMobile();
          setupCanvasSize();
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Handle background tab visibility
    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Dynamic mouse & touch coordinates
    const mouse = {
      x: cssWidth * 0.5,
      y: cssHeight * 0.35,
      targetX: cssWidth * 0.5,
      targetY: cssHeight * 0.35,
    };

    // Desktop cursor ripples
    interface Ripple {
      x: number;
      y: number;
      r: number;
      maxR: number;
      alpha: number;
      hue: number;
    }
    const trailRipples: Ripple[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!isMobile && trailRipples.length < 15 && Math.random() > 0.5) {
        trailRipples.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          r: Math.random() * 3 + 2,
          maxR: Math.random() * 24 + 12,
          alpha: 0.45,
          hue: Math.random() > 0.4 ? 338 : 38
        });
      }
    };

    let lastUserTouch = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        lastUserTouch = Date.now();
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        lastUserTouch = Date.now();
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Petal / spark particles (lightweight on mobile)
    const particleCount = isMobile
      ? (mode === 'rose-petals' ? 12 : 8)
      : (mode === 'rose-petals' ? 32 : 20);

    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      size: mode === 'rose-petals' 
        ? (isMobile ? Math.random() * 5 + 3 : Math.random() * 7 + 4) 
        : (isMobile ? Math.random() * 3 + 2 : Math.random() * 4 + 2),
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015,
      alpha: Math.random() * 0.35 + 0.18,
      isPetal: mode === 'rose-petals' ? i % 2 === 0 : i % 4 === 0,
      colorType: i % 3
    }));

    let tick = 0;

    const render = () => {
      if (!isRunning) return;

      try {
        tick += isMobile ? 0.009 : 0.012;

        // On mobile, gently ambiently oscillate target only if no active touch recently
        if (isMobile && Date.now() - lastUserTouch > 2500) {
          mouse.targetX = cssWidth * 0.5 + Math.sin(tick * 0.8) * (cssWidth * 0.25);
          mouse.targetY = cssHeight * 0.35 + Math.cos(tick * 0.6) * (cssHeight * 0.15);
        }

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, cssWidth, cssHeight);

        // Subtle aura radial glow
        const glowRadius = Math.min(cssWidth, cssHeight) * (isMobile ? 0.55 : 0.42);
      const cursorGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        8,
        mouse.x,
        mouse.y,
        glowRadius
      );

      if (mode === 'rose-petals') {
        cursorGrad.addColorStop(0, 'rgba(251, 113, 133, 0.15)');
        cursorGrad.addColorStop(0.5, 'rgba(254, 205, 211, 0.08)');
        cursorGrad.addColorStop(1, 'rgba(255, 248, 250, 0)');
      } else if (mode === 'crystal-mesh') {
        cursorGrad.addColorStop(0, 'rgba(216, 180, 254, 0.14)');
        cursorGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.06)');
        cursorGrad.addColorStop(1, 'rgba(255, 248, 250, 0)');
      } else {
        cursorGrad.addColorStop(0, 'rgba(244, 114, 182, 0.14)');
        cursorGrad.addColorStop(0.5, 'rgba(251, 207, 232, 0.06)');
        cursorGrad.addColorStop(1, 'rgba(255, 248, 250, 0)');
      }

      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Liquid silk waves (optimized: 2 waves on mobile, 3 on desktop)
      const waveCount = isMobile ? 2 : (mode === 'crystal-mesh' ? 3 : 2);
      const wavePalettes = [
        { stroke: 'rgba(244, 114, 182, 0.14)', fill: 'rgba(251, 207, 232, 0.10)' },
        { stroke: 'rgba(251, 146, 60, 0.09)', fill: 'rgba(254, 240, 138, 0.07)' },
        { stroke: 'rgba(236, 72, 153, 0.10)', fill: 'rgba(249, 168, 212, 0.08)' },
      ];

      const xStep = isMobile ? 56 : 30;

      for (let w = 0; w < waveCount; w++) {
        const palette = wavePalettes[w % wavePalettes.length];
        ctx.beginPath();
        const baseY = cssHeight * (0.34 + w * 0.22);
        ctx.moveTo(0, cssHeight);

        for (let x = 0; x <= cssWidth; x += xStep) {
          const distFromMouse = Math.abs(x - mouse.x);
          const mousePull = Math.max(0, 1 - distFromMouse / 360) * ((mouse.y - cssHeight * 0.5) * 0.06);
          const y =
            baseY +
            Math.sin(x * 0.0028 + tick * (0.9 + w * 0.25) + w) * (isMobile ? 24 : (34 + w * 8)) +
            Math.cos(x * 0.005 - tick * 0.6 + w * 2) * (isMobile ? 12 : 18) +
            mousePull;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(cssWidth, cssHeight);
        ctx.closePath();
        ctx.fillStyle = palette.fill;
        ctx.fill();

        ctx.lineWidth = 1.0;
        ctx.strokeStyle = palette.stroke;
        ctx.stroke();
      }

      // Scent particles & floating rose petals
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick + p.angle) * 0.2;
        p.angle += p.spin;

        if (p.y < -20) {
          p.y = cssHeight + 15;
          p.x = Math.random() * cssWidth;
        }
        if (p.x < -20) p.x = cssWidth + 15;
        if (p.x > cssWidth + 20) p.x = -15;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.isPetal) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 1.1, -p.size * 0.8, p.size * 1.2, p.size * 0.7, 0, p.size);
          ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.7, -p.size * 1.1, -p.size * 0.8, 0, -p.size);
          ctx.closePath();
          ctx.fillStyle =
            p.colorType === 0
              ? `rgba(244, 114, 182, ${p.alpha * 0.8})`
              : `rgba(253, 164, 175, ${p.alpha * 0.85})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle =
            p.colorType === 1
              ? `rgba(253, 224, 71, ${p.alpha * 0.55})`
              : `rgba(244, 114, 182, ${p.alpha * 0.55})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Desktop scent ripples
      if (!isMobile && trailRipples.length > 0) {
        for (let i = trailRipples.length - 1; i >= 0; i--) {
          const rip = trailRipples[i];
          rip.r += (rip.maxR - rip.r) * 0.08;
          rip.alpha *= 0.92;
          rip.y -= 0.35;

          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${rip.hue}, 88%, 72%, ${rip.alpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();

          if (rip.alpha < 0.03) trailRipples.splice(i, 1);
        }
      }

      ctx.restore();
    } catch (err) {
      console.warn("Canvas render tick catch:", err);
    }
    animationFrameId = requestAnimationFrame(render);
  };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFF8FA] will-change-transform transform-gpu">
      {/* Background Mode Tint */}
      <div
        className="absolute inset-0 opacity-90 transition-all duration-1000"
        style={{
          background:
            mode === 'crystal-mesh'
              ? 'radial-gradient(circle at 15% 15%, #FCE7F3 0%, transparent 45%), radial-gradient(circle at 85% 20%, #F3E8FF 0%, transparent 45%), radial-gradient(circle at 50% 80%, #FFE4E6 0%, #FFF8FA 70%)'
              : mode === 'rose-petals'
              ? 'radial-gradient(circle at 20% 20%, #FFE4E6 0%, transparent 50%), radial-gradient(circle at 80% 30%, #FEF3C7 0%, transparent 45%), radial-gradient(circle at 40% 85%, #FCE7F3 0%, #FFF8FA 70%)'
              : 'radial-gradient(circle at 12% 18%, #FCE7F3 0%, transparent 48%), radial-gradient(circle at 88% 22%, #FFEDD5 0%, transparent 42%), radial-gradient(circle at 52% 85%, #FBCFE8 0%, #FFF8FA 72%)'
        }}
      />

      {/* GPU Accelerated Liquid Blobs (optimized for 60fps mobile execution) */}
      <div className="absolute -top-24 -left-20 w-80 sm:w-[36rem] h-80 sm:h-[36rem] rounded-full bg-gradient-to-br from-pink-300/35 via-rose-200/25 to-amber-100/20 blur-2xl sm:blur-3xl animate-liquid-blob-1 transform-gpu" />
      <div className="absolute top-1/4 -right-20 w-80 sm:w-[38rem] h-80 sm:h-[38rem] rounded-full bg-gradient-to-bl from-rose-300/30 via-fuchsia-200/25 to-pink-100/25 blur-2xl sm:blur-3xl animate-liquid-blob-2 transform-gpu" />
      <div className="absolute -bottom-28 left-1/4 w-72 sm:w-[36rem] h-72 sm:h-[36rem] rounded-full bg-gradient-to-tr from-pink-200/30 via-rose-100/25 to-amber-200/15 blur-2xl sm:blur-3xl animate-liquid-blob-3 transform-gpu" />

      {/* Subtle Light Prisms (Desktop enhanced, mobile battery friendly) */}
      <div className="absolute inset-0 overflow-hidden opacity-30 sm:opacity-40">
        <div className="absolute -top-1/2 left-1/4 w-28 sm:w-44 h-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-[32deg] blur-xl sm:blur-2xl animate-prism-beam-1 transform-gpu" />
        <div className="absolute -top-1/2 left-2/3 w-36 sm:w-64 h-[200%] bg-gradient-to-r from-transparent via-rose-100/40 to-transparent rotate-[32deg] blur-xl sm:blur-3xl animate-prism-beam-2 transform-gpu" />
      </div>

      {/* Silk Texture Grid */}
      <div
        className="absolute inset-0 opacity-[0.10] sm:opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(244, 114, 182, 0.4) 0.75px, transparent 0.75px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Interactive HTML5 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
