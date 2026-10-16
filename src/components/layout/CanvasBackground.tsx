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
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isPageVisible = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    let isMobile = cssWidth < 768;

    const handleResize = () => {
      if (!canvas) return;
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      isMobile = cssWidth < 768;
      canvas.width = Math.max(cssWidth, 320) * dpr;
      canvas.height = Math.max(cssHeight, 320) * dpr;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const mouse = {
      x: cssWidth * 0.5,
      y: cssHeight * 0.35,
      targetX: cssWidth * 0.5,
      targetY: cssHeight * 0.35,
    };

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
      if (!isMobile && trailRipples.length < 20 && Math.random() > 0.4) {
        trailRipples.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          r: Math.random() * 4 + 2,
          maxR: Math.random() * 28 + 14,
          alpha: 0.5,
          hue: Math.random() > 0.4 ? 338 : 38
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const particleCount = isMobile
      ? (mode === 'rose-petals' ? 16 : 12)
      : (mode === 'rose-petals' ? 36 : 24);

    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      size: mode === 'rose-petals' ? Math.random() * 8 + 4 : Math.random() * 4 + 2,
      speedY: -(Math.random() * 0.4 + 0.16),
      speedX: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015,
      alpha: Math.random() * 0.4 + 0.2,
      isPetal: mode === 'rose-petals' ? i % 2 === 0 : i % 4 === 0,
      colorType: i % 3
    }));

    let tick = 0;

    const render = () => {
      if (!isPageVisible) return;

      tick += 0.012;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Subtle aura glow
      const cursorGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.min(cssWidth, cssHeight) * 0.42
      );
      cursorGrad.addColorStop(0, 'rgba(244, 114, 182, 0.12)');
      cursorGrad.addColorStop(0.5, 'rgba(251, 207, 232, 0.06)');
      cursorGrad.addColorStop(1, 'rgba(255, 248, 250, 0)');
      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Liquid waves
      const waveCount = mode === 'crystal-mesh' ? 3 : 2;
      const wavePalettes = [
        { stroke: 'rgba(244, 114, 182, 0.16)', fill: 'rgba(251, 207, 232, 0.12)' },
        { stroke: 'rgba(251, 146, 60, 0.10)', fill: 'rgba(254, 240, 138, 0.08)' },
        { stroke: 'rgba(236, 72, 153, 0.12)', fill: 'rgba(249, 168, 212, 0.10)' },
      ];

      const xStep = isMobile ? 48 : 28;

      for (let w = 0; w < waveCount; w++) {
        const palette = wavePalettes[w % wavePalettes.length];
        ctx.beginPath();
        const baseY = cssHeight * (0.32 + w * 0.24);
        ctx.moveTo(0, cssHeight);

        for (let x = 0; x <= cssWidth; x += xStep) {
          const distFromMouse = Math.abs(x - mouse.x);
          const mousePull = Math.max(0, 1 - distFromMouse / 380) * ((mouse.y - cssHeight * 0.5) * 0.07);
          const y =
            baseY +
            Math.sin(x * 0.0025 + tick * (1.0 + w * 0.25) + w) * (36 + w * 10) +
            Math.cos(x * 0.005 - tick * 0.7 + w * 2) * 20 +
            mousePull;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(cssWidth, cssHeight);
        ctx.closePath();
        ctx.fillStyle = palette.fill;
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = palette.stroke;
        ctx.stroke();
      }

      // Scent particles & rose petals
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick + p.angle) * 0.2;
        p.angle += p.spin;

        if (p.y < -25) {
          p.y = cssHeight + 20;
          p.x = Math.random() * cssWidth;
        }
        if (p.x < -25) p.x = cssWidth + 20;
        if (p.x > cssWidth + 25) p.x = -20;

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
          ctx.arc(0, 0, p.size * 1.6, 0, Math.PI * 2);
          ctx.fillStyle =
            p.colorType === 1
              ? `rgba(253, 224, 71, ${p.alpha * 0.6})`
              : `rgba(244, 114, 182, ${p.alpha * 0.6})`;
          ctx.fill();
        }
        ctx.restore();
      });

      // Cursor scent ripples (desktops)
      for (let i = trailRipples.length - 1; i >= 0; i--) {
        const rip = trailRipples[i];
        rip.r += (rip.maxR - rip.r) * 0.08;
        rip.alpha *= 0.93;
        rip.y -= 0.4;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${rip.hue}, 88%, 72%, ${rip.alpha})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        if (rip.alpha < 0.03) trailRipples.splice(i, 1);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFF8FA] will-change-transform">
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
      <div className="absolute -top-28 -left-24 w-[32rem] sm:w-[36rem] h-[32rem] sm:h-[36rem] bg-gradient-to-br from-pink-300/35 via-rose-200/30 to-amber-100/25 blur-3xl animate-liquid-blob-1 mix-blend-multiply" />
      <div className="absolute top-1/4 -right-28 w-[34rem] sm:w-[40rem] h-[34rem] sm:h-[40rem] bg-gradient-to-bl from-rose-300/30 via-fuchsia-200/25 to-pink-100/30 blur-3xl animate-liquid-blob-2 mix-blend-multiply" />
      <div className="absolute -bottom-32 left-1/4 w-[32rem] sm:w-[38rem] h-[32rem] sm:h-[38rem] bg-gradient-to-tr from-pink-200/35 via-rose-100/30 to-amber-200/20 blur-3xl animate-liquid-blob-3 mix-blend-multiply" />

      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-1/2 left-1/4 w-36 sm:w-44 h-[200%] bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-[32deg] blur-2xl animate-prism-beam-1" />
        <div className="absolute -top-1/2 left-2/3 w-48 sm:w-64 h-[200%] bg-gradient-to-r from-transparent via-rose-100/50 to-transparent rotate-[32deg] blur-3xl animate-prism-beam-2" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(244, 114, 182, 0.4) 0.75px, transparent 0.75px)',
          backgroundSize: '28px 28px'
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
