/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  collection,
  type Firestore
} from 'firebase/firestore';
import { 
  Sparkles, ShoppingBag, Search, Heart, ShieldCheck, Truck, 
  X, Plus, Minus, CheckCircle2, Lock, 
  Settings, Package, ShoppingCart, BarChart3, Edit3, Trash2, 
  Eye, Phone, CreditCard, ArrowRight, Star, Droplets, 
  Wind, Clock, AlertCircle, ChevronRight, Copy, Check,
  Flame, Award, Gift, Wand2, Layers, RefreshCw
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
declare global {
  var __firebase_config: string | undefined;
  var __app_id: string | undefined;
  var __initial_auth_token: string | undefined;
}

export interface PerfumeProduct {
  id: string;
  name: string;
  subtitle: string;
  category: 'For Her' | 'For Him' | 'Unisex' | 'Luxury Attar/Oud' | 'Gift Sets';
  scentFamily: 'Floral' | 'Oriental' | 'Woody' | 'Fresh' | 'Gourmand';
  volume: string;
  costPrice: number;
  price: number;
  originalPrice: number;
  stock: number;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  longevity: number;
  sillage: number;
  image: string;
  description: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
}

export interface CartItem extends PerfumeProduct {
  cartKey: string;
  selectedVolume: string;
  unitPrice: number;
  quantity: number;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  announcementText: string;
  bannerBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCta: string;
  bannerImage: string;
  featuredBottleName: string;
  featuredBottlePrice: string;
  bgAnimationMode: 'silk-aurora' | 'rose-petals' | 'crystal-mesh';
  insideDhakaFee: number;
  suburbsDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingThreshold: number;
  bkashMerchant: string;
  nagadMerchant: string;
  rocketMerchant: string;
  adminPin: string;
}

export interface OrderItem {
  id: string;
  name: string;
  volume: string;
  price: number;
  costPrice: number;
  quantity: number;
  image: string;
}

export interface OrderRecord {
  id?: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  district: string;
  deliveryZone: 'inside' | 'suburbs' | 'outside';
  address: string;
  courier: string;
  paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  trxId: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: number;
  createdDateStr: string;
}

// ==========================================
// CURATED LUXURY BOTTLE PRESETS FOR ADMIN
// ==========================================
const LUXURY_BOTTLE_PRESETS = [
  {
    label: "Rose Quartz Extrait Flacon",
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85"
  },
  {
    label: "Parisian Blush Glass",
    url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85"
  },
  {
    label: "Royal Gold & Oud Elixir",
    url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85"
  },
  {
    label: "Peony Silk Couture",
    url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85"
  },
  {
    label: "Crystal Amber & Saffron",
    url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85"
  },
  {
    label: "Pink Champagne Nectar",
    url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=900&q=85"
  }
];

const VOLUME_MULTIPLIERS: Record<string, number> = {
  "10ml Decant": 0.22,
  "30ml": 0.48,
  "50ml": 0.72,
  "100ml": 1.0
};

// ==========================================
// INITIAL SEED DATA (DHAKA & PARIS LUXURY PERFUMES)
// ==========================================
const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: "ÉCLAT DE ROSE",
  tagline: "DHAKA • PARIS • GRASSE",
  announcementText: "🌸 SPRING & EID LUXURY COLLECTION: Use code ROSE10 for 10% OFF! Free courier delivery across Bangladesh on orders over ৳5,000 🌸",
  bannerBadge: "2026 SIGNATURE ATELIER COLLECTION",
  bannerTitle: "The Essence of Blooming Luxury",
  bannerSubtitle: "Handcrafted French Extraits de Parfum & Artisanal Rose Ouds curated exclusively for Bangladesh's climate. Intense 24-hour longevity and magnetic projection.",
  bannerCta: "Explore Fragrances",
  bannerImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85",
  featuredBottleName: "Rose de Dhaka Extrait",
  featuredBottlePrice: "৳3,850",
  bgAnimationMode: "silk-aurora",
  insideDhakaFee: 70,
  suburbsDhakaFee: 100,
  outsideDhakaFee: 130,
  freeShippingThreshold: 5000,
  bkashMerchant: "01711-889900",
  nagadMerchant: "01819-556677",
  rocketMerchant: "01911-334455",
  adminPin: "2026"
};

const INITIAL_PRODUCTS: PerfumeProduct[] = [
  {
    id: "perfume-1",
    name: "Rose de Dhaka Extrait",
    subtitle: "Extrait de Parfum • Intense",
    category: "For Her",
    scentFamily: "Floral",
    volume: "100ml",
    costPrice: 1850,
    price: 3850,
    originalPrice: 4600,
    stock: 28,
    featured: true,
    rating: 4.9,
    reviewsCount: 142,
    longevity: 96,
    sillage: 92,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    description: "A hypnotic fusion of velvety Turkish Damask rose wrapped in smoky Cambodian agarwood, sweet praline, and warm ambergris. Specially calibrated to bloom gorgeously in warm South Asian evenings.",
    topNotes: ["Damask Rose", "Pink Pepper", "Rajshahi Lychee"],
    middleNotes: ["Peony Blossom", "Raspberry Nectar", "Clove"],
    baseNotes: ["Cambodian Oud", "Roasted Praline", "White Amber"]
  },
  {
    id: "perfume-2",
    name: "Sylhet Rain & White Tea",
    subtitle: "Eau de Parfum • Luminescent",
    category: "Unisex",
    scentFamily: "Fresh",
    volume: "100ml",
    costPrice: 1300,
    price: 2950,
    originalPrice: 3500,
    stock: 42,
    featured: true,
    rating: 4.9,
    reviewsCount: 118,
    longevity: 88,
    sillage: 84,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    description: "Inspired by monsoon mist rolling over Sylhet's lush green tea estates and blooming night Beli jasmine. Crisp, dewy, and effortlessly serene.",
    topNotes: ["Silver Needle White Tea", "Bergamot", "Monsoon Accord"],
    middleNotes: ["Night Beli Jasmine", "Pink Lotus", "Rose Centifolia"],
    baseNotes: ["Cashmere Wood", "White Musk", "Vetiver"]
  },
  {
    id: "perfume-3",
    name: "Midnight Bakhoor & Rose Oud",
    subtitle: "Pure Artisanal Attar / Oil Parfum",
    category: "Luxury Attar/Oud",
    scentFamily: "Oriental",
    volume: "30ml",
    costPrice: 2100,
    price: 4400,
    originalPrice: 5200,
    stock: 15,
    featured: true,
    rating: 5.0,
    reviewsCount: 215,
    longevity: 99,
    sillage: 96,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    description: "Distilled from aged Sylheti agarwood and infused with Taif rose otto and saffron threads. Alcohol-free luxury oil concentration that lingers on fine fabrics for days.",
    topNotes: ["Taif Rose Otto", "Kashmiri Saffron", "Cardamom"],
    middleNotes: ["Aged Sylhet Agarwood", "Royal Bakhoor", "Red Geranium"],
    baseNotes: ["Mysore Sandalwood", "Golden Amber", "White Musk Accord"]
  },
  {
    id: "perfume-4",
    name: "Lychee Blossom & Peony Silk",
    subtitle: "Eau de Parfum • Soft Couture",
    category: "For Her",
    scentFamily: "Floral",
    volume: "100ml",
    costPrice: 1450,
    price: 3150,
    originalPrice: 3750,
    stock: 34,
    featured: false,
    rating: 4.8,
    reviewsCount: 86,
    longevity: 85,
    sillage: 82,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    description: "Like draping a delicate blush silk Jamdani scarf. Sparkling luscious lychee and mandarin open into a lavish heart of pink peony and velvety suede musk.",
    topNotes: ["Lush Lychee", "Sicilian Mandarin", "Pear Blossom"],
    middleNotes: ["Pink Peony", "Turkish Rose Water", "Magnolia"],
    baseNotes: ["Soft Suede", "Silk Musk", "Cedarwood"]
  },
  {
    id: "perfume-5",
    name: "Velvet Oud & Crystal Saffron",
    subtitle: "Extrait de Parfum • Unisex",
    category: "Unisex",
    scentFamily: "Oriental",
    volume: "100ml",
    costPrice: 2300,
    price: 4850,
    originalPrice: 5800,
    stock: 19,
    featured: true,
    rating: 4.9,
    reviewsCount: 310,
    longevity: 98,
    sillage: 95,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    description: "An addictive crystal amber and caramelized saffron masterpiece. Luminous saffron and Egyptian jasmine meet mineral ambergris and freshly cut cedar.",
    topNotes: ["Red Saffron", "Bitter Almond", "Blood Orange"],
    middleNotes: ["Egyptian Jasmine", "Spun Sugar", "Rose Petals"],
    baseNotes: ["Ambergris", "Fir Resin", "Virginia Cedar"]
  },
  {
    id: "perfume-6",
    name: "Pink Champagne Elixir",
    subtitle: "Eau de Parfum • Gourmand",
    category: "For Her",
    scentFamily: "Gourmand",
    volume: "50ml",
    costPrice: 1150,
    price: 2590,
    originalPrice: 3100,
    stock: 50,
    featured: false,
    rating: 4.8,
    reviewsCount: 74,
    longevity: 87,
    sillage: 85,
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
    description: "Effervescent pink champagne bubbles, wild strawberries, and whipped bourbon vanilla cream. Playful, celebratory, and irresistibly magnetic.",
    topNotes: ["Pink Champagne", "Wild Strawberry", "Pink Grapefruit"],
    middleNotes: ["Rose Macaron", "Gardenia", "Peach Nectar"],
    baseNotes: ["Whipped Vanilla", "Salted Caramel", "Sandalwood"]
  },
  {
    id: "perfume-7",
    name: "Santal Rose & Smoked Vetiver",
    subtitle: "Eau de Parfum • Pour Homme",
    category: "For Him",
    scentFamily: "Woody",
    volume: "100ml",
    costPrice: 1700,
    price: 3650,
    originalPrice: 4300,
    stock: 22,
    featured: false,
    rating: 4.8,
    reviewsCount: 89,
    longevity: 91,
    sillage: 88,
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
    description: "A refined masculine woody signature with an unexpected heart of dark rose, Mysore sandalwood, cracked black pepper, and Haitian vetiver.",
    topNotes: ["Black Pepper", "Cardamom", "Calabrian Bergamot"],
    middleNotes: ["Dark Turkish Rose", "Papyrus", "Violet Leaf"],
    baseNotes: ["Mysore Sandalwood", "Smoked Vetiver", "Guaiac Wood"]
  },
  {
    id: "perfume-8",
    name: "L'Amour Bridal Coffret Set",
    subtitle: "3 x 30ml Luxury Gift Box",
    category: "Gift Sets",
    scentFamily: "Floral",
    volume: "100ml",
    costPrice: 2800,
    price: 5600,
    originalPrice: 6800,
    stock: 12,
    featured: true,
    rating: 5.0,
    reviewsCount: 53,
    longevity: 94,
    sillage: 91,
    image: "https://images.unsplash.com/photo-1512777576244-b846ac3d816f?auto=format&fit=crop&w=800&q=80",
    description: "Presented in our signature blush velvet & rose-gold gift coffret. Includes 30ml travel sprays of Rose de Dhaka, Sylhet Rain, and Lychee Blossom.",
    topNotes: ["Rose Otto", "Pink Champagne", "White Tea"],
    middleNotes: ["Jasmine Sambac", "Peony", "Oud Wood"],
    baseNotes: ["White Amber", "Silk Musk", "Vanilla Bean"]
  }
];

const BD_DISTRICTS = [
  "Dhaka City (Inside Dhaka)",
  "Savar / Keraniganj / Gazipur / Narayanganj (Dhaka Suburbs)",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Cox's Bazar",
  "Bogura",
  "Jashore"
];

const COURIER_PARTNERS = ["Steadfast Courier", "Pathao Courier", "RedX Logistics"];

const BG_MODES = [
  {
    id: "silk-aurora" as const,
    name: "Silk Aurora & Mist",
    shortLabel: "Silk Waves",
    desc: "Interactive 60fps liquid rose silk waves + cursor scent trail"
  },
  {
    id: "rose-petals" as const,
    name: "Botanical Petals & Rays",
    shortLabel: "Rose Petals",
    desc: "Floating 3D rose petals + golden champagne sunbeams"
  },
  {
    id: "crystal-mesh" as const,
    name: "Liquid Crystal Mesh",
    shortLabel: "Crystal Mesh",
    desc: "Morphing rose-quartz & lavender prism glass blobs"
  }
];

// Helper Formatter
const formatBDT = (amount: number | string) => {
  const num = Math.round(Number(amount) || 0);
  return `৳${num.toLocaleString('en-IN')}`;
};

// ==========================================
// 60FPS INTERACTIVE CANVAS BACKGROUND ENGINE
// ==========================================
function LuxuryAnimatedBackground({ mode = "silk-aurora" }: { mode: 'silk-aurora' | 'rose-petals' | 'crystal-mesh' }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
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
      if (trailRipples.length < 28 && Math.random() > 0.35) {
        trailRipples.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          r: Math.random() * 4 + 2,
          maxR: Math.random() * 34 + 18,
          alpha: 0.55,
          hue: Math.random() > 0.4 ? 338 : 38
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const particleCount = mode === 'rose-petals' ? 42 : 32;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: mode === 'rose-petals' ? Math.random() * 9 + 5 : Math.random() * 5 + 2,
      speedY: -(Math.random() * 0.45 + 0.18),
      speedX: (Math.random() - 0.5) * 0.35,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.018,
      alpha: Math.random() * 0.45 + 0.2,
      isPetal: mode === 'rose-petals' ? i % 2 === 0 : i % 5 === 0,
      colorType: i % 3
    }));

    let tick = 0;

    const render = () => {
      tick += 0.012;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Cursor aura glow
      const cursorGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.min(width, height) * 0.42
      );
      cursorGrad.addColorStop(0, 'rgba(244, 114, 182, 0.13)');
      cursorGrad.addColorStop(0.45, 'rgba(251, 207, 232, 0.08)');
      cursorGrad.addColorStop(1, 'rgba(255, 248, 250, 0)');
      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, width, height);

      // Flowing silk ribbon waves
      const waveCount = mode === 'crystal-mesh' ? 4 : 3;
      const wavePalettes = [
        { stroke: 'rgba(244, 114, 182, 0.18)', fill: 'rgba(251, 207, 232, 0.14)' },
        { stroke: 'rgba(251, 146, 60, 0.12)', fill: 'rgba(254, 240, 138, 0.10)' },
        { stroke: 'rgba(236, 72, 153, 0.14)', fill: 'rgba(249, 168, 212, 0.12)' },
        { stroke: 'rgba(192, 132, 252, 0.14)', fill: 'rgba(233, 213, 255, 0.11)' }
      ];

      for (let w = 0; w < waveCount; w++) {
        const palette = wavePalettes[w % wavePalettes.length];
        ctx.beginPath();
        const baseY = height * (0.28 + w * 0.21);
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 28) {
          const distFromMouse = Math.abs(x - mouse.x);
          const mousePull = Math.max(0, 1 - distFromMouse / 420) * ((mouse.y - height * 0.5) * 0.08);
          const y =
            baseY +
            Math.sin(x * 0.0025 + tick * (1.1 + w * 0.25) + w) * (42 + w * 12) +
            Math.cos(x * 0.0055 - tick * 0.8 + w * 2) * 24 +
            mousePull;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = palette.fill;
        ctx.fill();

        ctx.lineWidth = 1.4;
        ctx.strokeStyle = palette.stroke;
        ctx.stroke();
      }

      // Render floating scent molecules & rose petals
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick + p.angle) * 0.22;
        p.angle += p.spin;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 1) {
          p.x += (dx / dist) * 0.65;
          p.y += (dy / dist) * 0.65;
        }

        if (p.y < -30) {
          p.y = height + 25;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 25;
        if (p.x > width + 30) p.x = -25;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.isPetal) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 1.15,
            -p.size * 0.8,
            p.size * 1.25,
            p.size * 0.7,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 1.25,
            p.size * 0.7,
            -p.size * 1.15,
            -p.size * 0.8,
            0,
            -p.size
          );
          ctx.closePath();
          ctx.fillStyle =
            p.colorType === 0
              ? `rgba(244, 114, 182, ${p.alpha * 0.85})`
              : p.colorType === 1
              ? `rgba(251, 207, 232, ${p.alpha})`
              : `rgba(253, 164, 175, ${p.alpha * 0.9})`;
          ctx.fill();
        } else {
          const orbGrad = ctx.createRadialGradient(0, 0, 0.5, 0, 0, p.size * 2.2);
          if (p.colorType === 1) {
            orbGrad.addColorStop(0, `rgba(253, 224, 71, ${p.alpha})`);
            orbGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
          } else {
            orbGrad.addColorStop(0, `rgba(244, 114, 182, ${p.alpha})`);
            orbGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
          }
          ctx.fillStyle = orbGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Cursor scent mist ripples
      for (let i = trailRipples.length - 1; i >= 0; i--) {
        const rip = trailRipples[i];
        rip.r += (rip.maxR - rip.r) * 0.08;
        rip.alpha *= 0.93;
        rip.y -= 0.45;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${rip.hue}, 88%, 72%, ${rip.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (rip.alpha < 0.03) {
          trailRipples.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFF8FA]">
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
      <div className="absolute -top-28 -left-24 w-[36rem] h-[36rem] bg-gradient-to-br from-pink-300/40 via-rose-200/35 to-amber-100/30 blur-3xl animate-liquid-blob-1 mix-blend-multiply" />
      <div className="absolute top-1/4 -right-28 w-[40rem] h-[40rem] bg-gradient-to-bl from-rose-300/35 via-fuchsia-200/30 to-pink-100/35 blur-3xl animate-liquid-blob-2 mix-blend-multiply" />
      <div className="absolute -bottom-32 left-1/4 w-[38rem] h-[38rem] bg-gradient-to-tr from-pink-200/40 via-rose-100/35 to-amber-200/25 blur-3xl animate-liquid-blob-3 mix-blend-multiply" />

      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute -top-1/2 left-1/4 w-44 h-[200%] bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-[32deg] blur-2xl animate-prism-beam-1" />
        <div className="absolute -top-1/2 left-2/3 w-64 h-[200%] bg-gradient-to-r from-transparent via-rose-100/60 to-transparent rotate-[32deg] blur-3xl animate-prism-beam-2" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(244, 114, 182, 0.4) 0.75px, transparent 0.75px)',
          backgroundSize: '28px 28px'
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}

// ==========================================
// MAIN COMPONENT: ÉCLAT DE ROSE
// ==========================================
export default function App() {
  // Database & User Context
  const [currentUser, setCurrentUser] = useState<User | { uid: string; isLocal: boolean } | null>(null);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('edr_store_config');
      return saved ? JSON.parse(saved) : DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  const [products, setProducts] = useState<PerfumeProduct[]>(() => {
    try {
      const saved = localStorage.getItem('edr_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edr_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Background Mode
  const [bgMode, setBgMode] = useState<'silk-aurora' | 'rose-petals' | 'crystal-mesh'>('silk-aurora');

  // Navigation & View Mode
  const [activeView, setActiveView] = useState<'storefront' | 'admin' | 'track-order'>('storefront');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(7500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Dynamic Volume Size Selection Map (productId -> size)
  const [selectedVolumes, setSelectedVolumes] = useState<Record<string, string>>({});

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<PerfumeProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('edr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('edr_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  // Scent Quiz Modal
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ vibe: '', intensity: '' });

  // Checkout Form (Bangladesh Localized)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [customerForm, setCustomerForm] = useState({
    fullName: '',
    phone: '',
    district: 'Dhaka City (Inside Dhaka)',
    deliveryZone: 'inside' as 'inside' | 'suburbs' | 'outside',
    address: '',
    courier: 'Steadfast Courier',
    paymentMethod: 'COD' as 'COD' | 'bKash' | 'Nagad' | 'Rocket',
    senderNumber: '',
    trxId: '',
    notes: ''
  });
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Order Tracking
  const [trackQuery, setTrackQuery] = useState('');

  // Admin Security & Management
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'banner' | 'orders' | 'github'>('dashboard');

  // Admin Forms
  const [bannerForm, setBannerForm] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [editingProduct, setEditingProduct] = useState<PerfumeProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: 'Eau de Parfum',
    category: 'For Her' as PerfumeProduct['category'],
    scentFamily: 'Floral' as PerfumeProduct['scentFamily'],
    volume: '100ml',
    costPrice: 1500,
    price: 3200,
    originalPrice: 3800,
    stock: 25,
    featured: true,
    longevity: 90,
    sillage: 85,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    description: '',
    topNotes: 'Damask Rose, Bergamot',
    middleNotes: 'Peony, Jasmine',
    baseNotes: 'Oud, White Musk'
  });

  // ==========================================
  // SYNC WITH LOCAL STORAGE FOR OFFLINE / GITHUB RESILIENCE
  // ==========================================
  useEffect(() => {
    try {
      localStorage.setItem('edr_store_config', JSON.stringify(storeConfig));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [storeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('edr_products', JSON.stringify(products));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('edr_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('edr_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('edr_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [wishlist]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // ==========================================
  // FIREBASE INITIALIZATION & REALTIME SYNC (IF PROVIDED)
  // ==========================================
  useEffect(() => {
    let rawConfig: any = null;
    try {
      if (typeof window !== 'undefined' && (window as any).__firebase_config) {
        rawConfig = JSON.parse((window as any).__firebase_config);
      } else if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        rawConfig = JSON.parse(__firebase_config);
      }
    } catch (e) {
      console.warn("Firebase config parse check:", e);
    }

    const isFbValid = Boolean(rawConfig && rawConfig.apiKey);

    if (!isFbValid) {
      // Standalone mode: set local admin user
      setCurrentUser({ uid: 'local-admin-dhaka', isLocal: true });
      return;
    }

    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(rawConfig);
      const auth = getAuth(app);
      const db: Firestore = getFirestore(app);
      const appId = (window as any).__app_id || 'eclat-de-rose-bd';

      const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
        if (!u) {
          try {
            await signInAnonymously(auth);
          } catch (err) {
            console.error("Sign-in anonymously error:", err);
          }
        }
        setCurrentUser(u);
      });

      // Listen to store settings doc
      const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'storeConfig');
      const unsubConfig = onSnapshot(configDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<StoreConfig>;
          setStoreConfig((prev) => ({ ...prev, ...data }));
          setBannerForm((prev) => ({ ...prev, ...data }));
          if (data.bgAnimationMode) setBgMode(data.bgAnimationMode);
        } else {
          setDoc(configDocRef, DEFAULT_STORE_CONFIG).catch(() => {});
        }
      });

      // Listen to products
      const productsColRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
      const unsubProducts = onSnapshot(productsColRef, (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PerfumeProduct[];
          setProducts(list);
        } else {
          INITIAL_PRODUCTS.forEach((p) => {
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id), p).catch(() => {});
          });
        }
      });

      // Listen to orders
      const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
      const unsubOrders = onSnapshot(ordersColRef, (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as OrderRecord[];
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(list);
      });

      return () => {
        unsubscribeAuth();
        unsubConfig();
        unsubProducts();
        unsubOrders();
      };
    } catch (err) {
      console.warn("Firebase runtime initialization skipped:", err);
      setCurrentUser({ uid: 'local-admin-dhaka', isLocal: true });
    }
  }, []);

  // ==========================================
  // VOLUME SIZING & DYNAMIC PRICING
  // ==========================================
  const getProductVolume = (product: PerfumeProduct) => {
    return selectedVolumes[product.id] || product.volume || "100ml";
  };

  const getDynamicPrice = (basePrice: number, chosenVol: string, defaultVol = "100ml") => {
    const base = Number(basePrice) || 0;
    if (!chosenVol || chosenVol === defaultVol) return base;
    const mult = VOLUME_MULTIPLIERS[chosenVol] || 1.0;
    const defMult = VOLUME_MULTIPLIERS[defaultVol] || 1.0;
    return Math.round((base / defMult) * mult);
  };

  const addToCart = (product: PerfumeProduct, qty = 1, customVolume?: string) => {
    if (product.stock <= 0) {
      showToast("Sorry, this luxury fragrance is currently out of stock!", "error");
      return;
    }
    const chosenVolume = customVolume || getProductVolume(product);
    const unitPrice = getDynamicPrice(product.price, chosenVolume, product.volume || "100ml");
    const cartKey = `${product.id}-${chosenVolume}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.min(product.stock, item.quantity + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartKey,
          selectedVolume: chosenVolume,
          unitPrice,
          price: unitPrice,
          quantity: qty
        }
      ];
    });
    showToast(`Added "${product.name} (${chosenVolume})" to your Luxury Bag`);
  };

  const updateCartQty = (cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey === cartKey) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(item.stock || 99, nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.unitPrice || item.price) * item.quantity, 0);
  }, [cart]);

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= Number(storeConfig.freeShippingThreshold || 5000)) return 0;
    if (customerForm.deliveryZone === 'inside') return Number(storeConfig.insideDhakaFee || 70);
    if (customerForm.deliveryZone === 'suburbs') return Number(storeConfig.suburbsDhakaFee || 100);
    return Number(storeConfig.outsideDhakaFee || 130);
  }, [cartSubtotal, customerForm.deliveryZone, storeConfig]);

  const discountAmount = useMemo(() => {
    return Math.round((cartSubtotal * appliedDiscount) / 100);
  }, [cartSubtotal, appliedDiscount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingFee);
  }, [cartSubtotal, discountAmount, shippingFee]);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ROSE10' || code === 'EID10') {
      setAppliedDiscount(10);
      showToast("Promo code applied! 10% Luxury Discount activated.");
    } else if (code === 'PINK15' || code === 'VIP15') {
      setAppliedDiscount(15);
      showToast("VIP Promo code applied! 15% Discount activated.");
    } else {
      showToast("Invalid promo code. Try ROSE10 for 10% off!", "error");
    }
  };

  const handleDistrictChange = (district: string) => {
    let deliveryZone: 'inside' | 'suburbs' | 'outside' = 'outside';
    if (district.includes('Inside Dhaka')) deliveryZone = 'inside';
    else if (district.includes('Dhaka Suburbs')) deliveryZone = 'suburbs';
    setCustomerForm((prev) => ({ ...prev, district, deliveryZone }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    const cleanPhone = customerForm.phone.replace(/[-\s]/g, '');
    if (!bdPhoneRegex.test(cleanPhone)) {
      showToast("Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01712345678)", "error");
      return;
    }

    if (customerForm.paymentMethod !== 'COD' && !customerForm.trxId.trim()) {
      showToast(`Please enter your ${customerForm.paymentMethod} Transaction ID (TrxID)`, "error");
      return;
    }

    try {
      const orderNumber = `EDR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: OrderRecord = {
        orderNumber,
        customerName: customerForm.fullName,
        phone: cleanPhone,
        district: customerForm.district,
        deliveryZone: customerForm.deliveryZone,
        address: customerForm.address,
        courier: customerForm.courier,
        paymentMethod: customerForm.paymentMethod,
        senderNumber: customerForm.senderNumber || cleanPhone,
        trxId: customerForm.paymentMethod === 'COD' ? 'CASH ON DELIVERY' : customerForm.trxId.toUpperCase(),
        notes: customerForm.notes,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          volume: i.selectedVolume || i.volume,
          price: Number(i.unitPrice || i.price),
          costPrice: Number(i.costPrice || Math.round(i.price * 0.5)),
          quantity: i.quantity,
          image: i.image
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingFee,
        totalAmount: grandTotal,
        status: 'Pending',
        createdAt: Date.now(),
        createdDateStr: new Date().toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })
      };

      // Try syncing with Firestore if available
      try {
        if (getApps().length > 0) {
          const db = getFirestore(getApp());
          const appId = (window as any).__app_id || 'eclat-de-rose-bd';
          const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
          await addDoc(ordersColRef, newOrder);

          for (const item of cart) {
            const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', item.id);
            const newStock = Math.max(0, (item.stock || 10) - item.quantity);
            await updateDoc(pRef, { stock: newStock });
          }
        }
      } catch (fbErr) {
        console.warn("Firestore order sync fallback to local state:", fbErr);
      }

      // Local State Update
      setOrders((prev) => [newOrder, ...prev]);
      setProducts((prev) =>
        prev.map((p) => {
          const inCart = cart.find((c) => c.id === p.id);
          return inCart ? { ...p, stock: Math.max(0, (p.stock || 10) - inCart.quantity) } : p;
        })
      );

      setLastPlacedOrder(newOrder);
      setCart([]);
      setAppliedDiscount(0);
      setCheckoutStep('success');

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fbbf24']
        });
      } catch {}

      showToast(`Order ${orderNumber} placed successfully!`);
    } catch (error) {
      console.error("Order placement error:", error);
      showToast("Could not place order. Please check connection.", "error");
    }
  };

  // ==========================================
  // ADMIN ACTIONS
  // ==========================================
  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const validPin = storeConfig.adminPin || "2026";
    if (adminPinInput === validPin || adminPinInput === "2026") {
      setIsAdminUnlocked(true);
      setAdminPinError('');
      showToast("Welcome to Éclat de Rose Executive Admin Suite");
    } else {
      setAdminPinError("Invalid Admin PIN. (Demo default PIN is 2026)");
    }
  };

  const handleSaveStoreConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: StoreConfig = {
      ...bannerForm,
      insideDhakaFee: Number(bannerForm.insideDhakaFee),
      suburbsDhakaFee: Number(bannerForm.suburbsDhakaFee),
      outsideDhakaFee: Number(bannerForm.outsideDhakaFee),
      freeShippingThreshold: Number(bannerForm.freeShippingThreshold)
    };

    try {
      if (getApps().length > 0) {
        const db = getFirestore(getApp());
        const appId = (window as any).__app_id || 'eclat-de-rose-bd';
        const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'storeConfig');
        await setDoc(configDocRef, updatedConfig);
      }
    } catch (err) {
      console.warn("Firestore config save fallback to local state:", err);
    }

    setStoreConfig(updatedConfig);
    if (bannerForm.bgAnimationMode) {
      setBgMode(bannerForm.bgAnimationMode);
    }
    showToast("Storefront Banner, Background Aura & Fees updated live!");
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      subtitle: 'Extrait de Parfum',
      category: 'For Her',
      scentFamily: 'Floral',
      volume: '100ml',
      costPrice: 1500,
      price: 3500,
      originalPrice: 4200,
      stock: 30,
      featured: true,
      longevity: 92,
      sillage: 88,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      description: 'Handcrafted luxury fragrance with blooming rose and warm oriental woods.',
      topNotes: 'Damask Rose, Pink Pepper, Bergamot',
      middleNotes: 'Peony Blossom, Night Jasmine, Raspberry',
      baseNotes: 'Cambodian Oud, White Amber, Cashmere Musk'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: PerfumeProduct) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      subtitle: prod.subtitle || '',
      category: prod.category || 'For Her',
      scentFamily: prod.scentFamily || 'Floral',
      volume: prod.volume || '100ml',
      costPrice: prod.costPrice || Math.round(prod.price * 0.5),
      price: prod.price || 3000,
      originalPrice: prod.originalPrice || 3600,
      stock: prod.stock ?? 20,
      featured: Boolean(prod.featured),
      longevity: prod.longevity || 90,
      sillage: prod.sillage || 85,
      image: prod.image || '',
      description: prod.description || '',
      topNotes: Array.isArray(prod.topNotes) ? prod.topNotes.join(', ') : prod.topNotes || '',
      middleNotes: Array.isArray(prod.middleNotes) ? prod.middleNotes.join(', ') : prod.middleNotes || '',
      baseNotes: Array.isArray(prod.baseNotes) ? prod.baseNotes.join(', ') : prod.baseNotes || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<PerfumeProduct> = {
      name: productForm.name.trim(),
      subtitle: productForm.subtitle.trim(),
      category: productForm.category,
      scentFamily: productForm.scentFamily,
      volume: productForm.volume.trim(),
      costPrice: Number(productForm.costPrice) || 0,
      price: Number(productForm.price) || 0,
      originalPrice: Number(productForm.originalPrice) || 0,
      stock: Number(productForm.stock) || 0,
      featured: Boolean(productForm.featured),
      longevity: Number(productForm.longevity) || 88,
      sillage: Number(productForm.sillage) || 85,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 24,
      image: productForm.image.trim(),
      description: productForm.description.trim(),
      topNotes: productForm.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
      middleNotes: productForm.middleNotes.split(',').map((s) => s.trim()).filter(Boolean),
      baseNotes: productForm.baseNotes.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingProduct) {
        try {
          if (getApps().length > 0) {
            const db = getFirestore(getApp());
            const appId = (window as any).__app_id || 'eclat-de-rose-bd';
            const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', editingProduct.id);
            await updateDoc(pRef, payload);
          }
        } catch {}

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...payload } as PerfumeProduct) : p))
        );
        showToast(`Updated "${payload.name}" in catalog!`);
      } else {
        const newId = `perfume-${Date.now()}`;
        const newProd = { id: newId, ...payload } as PerfumeProduct;

        try {
          if (getApps().length > 0) {
            const db = getFirestore(getApp());
            const appId = (window as any).__app_id || 'eclat-de-rose-bd';
            const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', newId);
            await setDoc(pRef, newProd);
          }
        } catch {}

        setProducts((prev) => [newProd, ...prev]);
        showToast(`Added "${payload.name}" to storefront!`);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error("Save product error:", err);
      showToast("Error saving product", "error");
    }
  };

  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    try {
      if (getApps().length > 0) {
        const db = getFirestore(getApp());
        const appId = (window as any).__app_id || 'eclat-de-rose-bd';
        const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', prodId);
        await deleteDoc(pRef);
      }
    } catch {}

    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    showToast(`Removed "${prodName}" from catalog.`);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    try {
      if (getApps().length > 0) {
        const db = getFirestore(getApp());
        const appId = (window as any).__app_id || 'eclat-de-rose-bd';
        const oRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
        await updateDoc(oRef, { status: newStatus });
      }
    } catch {}

    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderId || o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to ${newStatus}`);
  };

  // ==========================================
  // ANALYTICS CALCULATIONS
  // ==========================================
  const adminMetrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    let totalCost = 0;
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        totalCost += Number(item.costPrice || Math.round(item.price * 0.5)) * Number(item.quantity || 1);
      });
    });

    const netProfit = Math.max(0, totalRevenue - totalCost);
    const lowStockProducts = products.filter((p) => Number(p.stock) <= 15);
    const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

    return {
      totalRevenue,
      netProfit,
      totalOrders: orders.length,
      pendingOrdersCount,
      lowStockProducts
    };
  }, [orders, products]);

  // ==========================================
  // CATALOG FILTERING & SORTING
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedFamily !== 'All' && p.scentFamily !== selectedFamily) return false;
        if (Number(p.price) > priceRange) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const notes = [
            ...(Array.isArray(p.topNotes) ? p.topNotes : [p.topNotes]),
            ...(Array.isArray(p.middleNotes) ? p.middleNotes : [p.middleNotes]),
            ...(Array.isArray(p.baseNotes) ? p.baseNotes : [p.baseNotes])
          ]
            .join(' ')
            .toLowerCase();
          if (!matchName && !matchDesc && !notes.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedFamily, priceRange, searchQuery, sortBy]);

  // Scent Finder Quiz Recommendation
  const recommendedQuizProduct = useMemo(() => {
    if (!products.length) return null;
    if (quizAnswers.vibe === 'oud') {
      return products.find((p) => p.category === 'Luxury Attar/Oud') || products[0];
    }
    if (quizAnswers.vibe === 'sweet') {
      return products.find((p) => p.scentFamily === 'Gourmand') || products[0];
    }
    if (quizAnswers.vibe === 'woody') {
      return products.find((p) => p.scentFamily === 'Woody' || p.category === 'Unisex') || products[0];
    }
    return products[0];
  }, [products, quizAnswers]);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-800 selection:bg-rose-500 selection:text-white">
      {/* Dynamic Keyframe & Glass Classes */}
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
      <LuxuryAnimatedBackground mode={bgMode} />

      {/* Floating Aura Mode Switcher */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full glass-card shadow-xl shadow-rose-200/50 border border-rose-200/80">
        <span className="pl-2.5 pr-1 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1">
          <Wand2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Aura BG:
        </span>
        {BG_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setBgMode(m.id);
              showToast(`Aura switched to "${m.name}"`);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
              bgMode === m.id
                ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
            }`}
          >
            {m.shortLabel}
          </button>
        ))}
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 bg-white/95 border-rose-200 text-slate-800">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="relative z-30 bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-white text-xs sm:text-sm py-2.5 px-4 text-center font-medium tracking-wide shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span>{storeConfig.announcementText}</span>
          <span className="hidden md:inline-block text-rose-200">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-rose-100 text-xs">
            <Truck className="w-3.5 h-3.5" /> Steadfast & Pathao Express Delivery Across 64 Districts
          </span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 glass-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <button
            onClick={() => setActiveView('storefront')}
            className="text-left group focus:outline-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-300/50 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider bg-gradient-to-r from-rose-900 via-rose-700 to-pink-600 bg-clip-text text-transparent block leading-none">
                  {storeConfig.storeName}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-rose-500 font-semibold uppercase block mt-0.5">
                  {storeConfig.tagline}
                </span>
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 bg-rose-50/80 p-1.5 rounded-full border border-rose-200/60">
            <button
              onClick={() => setActiveView('storefront')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeView === 'storefront'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-rose-600'
              }`}
            >
              Perfume Atelier
            </button>
            <button
              onClick={() => {
                setQuizStep(0);
                setIsQuizOpen(true);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-rose-600 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Scent Finder Quiz
            </button>
            <button
              onClick={() => setActiveView('track-order')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeView === 'track-order'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-rose-600'
              }`}
            >
              Track BD Order
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white shadow-sm'
                  : 'text-rose-700 hover:bg-rose-100/70'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Admin Portal
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'storefront' : 'admin')}
              className="md:hidden px-3 py-2 rounded-xl bg-rose-100/80 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200"
            >
              <Settings className="w-3.5 h-3.5" />
              {activeView === 'admin' ? 'Store' : 'Admin'}
            </button>

            <button
              onClick={() => setActiveView('track-order')}
              title="Track Order"
              className="p-2.5 rounded-full bg-white/80 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-rose-100 shadow-sm transition-all"
            >
              <Truck className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setCheckoutStep('cart');
                setIsCartOpen(true);
              }}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-300/50 hover:shadow-rose-400/60 hover:scale-[1.02] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Luxury Bag</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-rose-700 text-xs font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: STOREFRONT */}
      {activeView === 'storefront' && (
        <main className="relative z-10 pb-24">
          {/* HERO BANNER */}
          <section className="relative pt-6 pb-14 md:py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-card rounded-[2.25rem] p-6 sm:p-10 lg:p-14 shadow-2xl shadow-rose-200/40 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-300/40 via-pink-200/40 to-transparent blur-2xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-300/60 text-rose-700 text-xs font-bold tracking-widest uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      {storeConfig.bannerBadge}
                    </div>

                    <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight">
                      {storeConfig.bannerTitle}
                    </h1>

                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                      {storeConfig.bannerSubtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href="#catalog"
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-rose-300/60 hover:shadow-rose-400/80 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        {storeConfig.bannerCta}
                        <ArrowRight className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setQuizStep(0);
                          setIsQuizOpen(true);
                        }}
                        className="px-6 py-4 rounded-full bg-white/90 hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2"
                      >
                        <Droplets className="w-4 h-4 text-rose-500" />
                        Find Your Signature Scent
                      </button>
                    </div>

                    <div className="pt-6 border-t border-rose-200/60 grid grid-cols-3 gap-4 max-w-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">100% Authentic</div>
                          <div className="text-[11px] text-slate-500">French & Grasse Oils</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">24-48h Delivery</div>
                          <div className="text-[11px] text-slate-500">Dhaka & All BD</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">bKash / COD</div>
                          <div className="text-[11px] text-slate-500">Pay on Delivery</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative flex justify-center">
                    <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] p-3 bg-gradient-to-b from-white/90 via-rose-50/70 to-pink-100/80 border border-rose-200 shadow-2xl overflow-hidden group">
                      <img
                        src={storeConfig.bannerImage}
                        alt={storeConfig.featuredBottleName}
                        className="w-full h-full object-cover rounded-[1.5rem] animate-bottle transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl shadow-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">
                            Bestseller in Dhaka
                          </span>
                          <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                            {storeConfig.featuredBottleName}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block">Extrait 100ml</span>
                          <span className="text-lg font-extrabold text-rose-600">
                            {storeConfig.featuredBottlePrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SCENT FAMILY FILTERS & CATALOG */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                  Curated Olfactory Library
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
                  Explore by Fragrance Notes
                </h2>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['All', 'Floral', 'Oriental', 'Woody', 'Fresh', 'Gourmand'].map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                      selectedFamily === fam
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-300/60'
                        : 'bg-white/80 text-slate-700 hover:bg-rose-100/60 border border-rose-200/70'
                    }`}
                  >
                    {fam === 'All' ? '✨ All Scent Families' : `🌸 ${fam}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Bar */}
            <div id="catalog" className="glass-card rounded-3xl p-4 sm:p-6 shadow-lg shadow-rose-100/60 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {['All', 'For Her', 'For Him', 'Unisex', 'Luxury Attar/Oud', 'Gift Sets'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                          : 'bg-rose-50/70 text-slate-700 hover:bg-rose-100/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="md:col-span-3 relative">
                  <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rose, oud, vanilla..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/90 border border-rose-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Max Budget</span>
                      <span className="text-rose-600 font-bold">{formatBDT(priceRange)}</span>
                    </div>
                    <input
                      type="range"
                      min="1500"
                      max="10000"
                      step="250"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer h-1.5 bg-rose-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center my-8">
                <Sparkles className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                <h3 className="font-serif-luxury text-2xl font-bold text-slate-800 mb-2">
                  No Fragrances Match Your Filter
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Try adjusting the budget slider or resetting category filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedFamily('All');
                    setSearchQuery('');
                    setPriceRange(10000);
                  }}
                  className="px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const activeVol = getProductVolume(product);
                  const activePrice = getDynamicPrice(product.price, activeVol, product.volume || "100ml");
                  const activeOrigPrice = getDynamicPrice(product.originalPrice, activeVol, product.volume || "100ml");
                  const discountPercent =
                    activeOrigPrice > activePrice
                      ? Math.round(((activeOrigPrice - activePrice) / activeOrigPrice) * 100)
                      : 0;

                  return (
                    <div
                      key={product.id}
                      className="glass-card rounded-[2rem] overflow-hidden shadow-lg shadow-rose-100/50 hover:shadow-2xl hover:shadow-rose-300/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-rose-50 to-pink-100/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        />

                        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                          {discountPercent > 0 && (
                            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-sm">
                              -{discountPercent}% OFF
                            </span>
                          )}
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-rose-800 text-[10px] font-bold tracking-wider uppercase border border-rose-200">
                            {product.category}
                          </span>
                        </div>

                        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                              wishlist.includes(product.id)
                                ? 'bg-rose-600 text-white'
                                : 'bg-white/90 text-slate-700 hover:text-rose-600'
                            }`}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            title="Inspect Olfactory Pyramid"
                            className="w-9 h-9 rounded-full bg-white/90 hover:bg-rose-600 text-slate-700 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md text-white text-[11px] font-semibold">
                            {activeVol}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold ${
                              product.stock > 5
                                ? 'bg-emerald-900/70 text-emerald-100'
                                : product.stock > 0
                                ? 'bg-amber-900/75 text-amber-100'
                                : 'bg-rose-900/80 text-rose-100'
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                        <div>
                          <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
                            <span>{product.subtitle}</span>
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating || 4.9}
                            </span>
                          </div>

                          <h3
                            onClick={() => setQuickViewProduct(product)}
                            className="font-serif-luxury text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1"
                          >
                            {product.name}
                          </h3>

                          {/* Bottle Decant & Size Buttons */}
                          <div className="mt-2.5 flex items-center gap-1">
                            {["10ml Decant", "30ml", "50ml", "100ml"].map((vol) => (
                              <button
                                key={vol}
                                type="button"
                                onClick={() =>
                                  setSelectedVolumes((prev) => ({ ...prev, [product.id]: vol }))
                                }
                                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                  activeVol === vol
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                    : 'bg-white/80 text-slate-600 border-rose-200/80 hover:bg-rose-50'
                                }`}
                              >
                                {vol === "10ml Decant" ? "10ml" : vol}
                              </button>
                            ))}
                          </div>

                          {/* Olfactory Notes Preview */}
                          <div className="mt-2.5 p-2.5 rounded-2xl bg-rose-50/80 border border-rose-100 space-y-1 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-600 truncate">
                              <span className="font-bold text-rose-600 uppercase text-[10px] w-10 shrink-0">Top:</span>
                              <span className="truncate">
                                {Array.isArray(product.topNotes) ? product.topNotes.join(', ') : product.topNotes}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 truncate">
                              <span className="font-bold text-pink-600 uppercase text-[10px] w-10 shrink-0">Heart:</span>
                              <span className="truncate">
                                {Array.isArray(product.middleNotes) ? product.middleNotes.join(', ') : product.middleNotes}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 truncate">
                              <span className="font-bold text-rose-800 uppercase text-[10px] w-10 shrink-0">Base:</span>
                              <span className="truncate">
                                {Array.isArray(product.baseNotes) ? product.baseNotes.join(', ') : product.baseNotes}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-rose-100 flex items-center justify-between gap-2">
                          <div>
                            <div className="text-xl font-extrabold text-rose-600">
                              {formatBDT(activePrice)}
                            </div>
                            {activeOrigPrice > activePrice && (
                              <div className="text-xs text-slate-400 line-through">
                                {formatBDT(activeOrigPrice)}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product, 1, activeVol)}
                            disabled={product.stock <= 0}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                              product.stock > 0
                                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-200 hover:shadow-lg hover:scale-105'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* BANGLADESH EXPERIENCE SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="glass-card rounded-[2.25rem] p-8 sm:p-12 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-rose-100/80 border border-rose-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                    Bespoke for Bangladesh
                  </span>
                  <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
                    Why Fragrance Connoisseurs Choose Éclat de Rose
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Subtropical heat requires deeper perfume oil concentrations. Each flacon contains 25%-35% pure Extrait de Parfum essences for all-day trail in Dhaka.
                  </p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/85 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2">
                    <Flame className="w-7 h-7 text-rose-600" />
                    <h4 className="font-bold text-slate-900 text-sm">24-Hour Tropical Projection</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Reinforced with Cambodian Oud, Ambroxan, and Cashmere Musk to project through humidity.
                    </p>
                  </div>
                  <div className="bg-white/85 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2">
                    <Gift className="w-7 h-7 text-rose-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Complimentary Coffret & Samples</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Every order arrives in a velvet keepsake box with 2 free 2ml discovery spray vials.
                    </p>
                  </div>
                  <div className="bg-white/85 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2">
                    <Award className="w-7 h-7 text-rose-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Doorstep Inspection & COD</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Inspect your sealed box at your doorstep anywhere in Bangladesh before paying courier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: ORDER TRACKING */}
      {activeView === 'track-order' && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <div className="glass-card rounded-[2rem] p-6 sm:p-10 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-widest">
                Real-Time Courier Tracking
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Track Your Luxury Perfume Order
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter your 11-digit Bangladeshi mobile number or Order ID (e.g. EDR-123456)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Enter 017XXXXXXXX or EDR-..."
                className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={() => setActiveView('storefront')}
                className="px-5 py-3.5 rounded-2xl bg-rose-100 text-rose-700 font-bold text-xs hover:bg-rose-200 transition-all"
              >
                Back to Shop
              </button>
            </div>

            <div className="space-y-4">
              {orders
                .filter(
                  (o) =>
                    trackQuery.trim() !== '' &&
                    (o.phone?.includes(trackQuery.trim()) ||
                      o.orderNumber?.toLowerCase().includes(trackQuery.trim().toLowerCase()))
                )
                .map((order) => (
                  <div
                    key={order.orderNumber}
                    className="p-6 rounded-2xl bg-white/90 border border-rose-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-rose-600">{order.orderNumber}</span>
                        <h4 className="font-bold text-slate-800">{order.customerName}</h4>
                        <span className="text-xs text-slate-500">{order.createdDateStr}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'Confirmed'
                              ? 'bg-purple-100 text-purple-700'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          ● {order.status}
                        </span>
                        <div className="text-sm font-extrabold text-rose-600 mt-1">
                          Total: {formatBDT(order.totalAmount)} ({order.paymentMethod})
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                      <span>
                        <strong>Courier:</strong> {order.courier}
                      </span>
                      <span>
                        <strong>Address:</strong> {order.address}, {order.district}
                      </span>
                    </div>
                  </div>
                ))}

              {trackQuery.trim() !== '' &&
                orders.filter(
                  (o) =>
                    o.phone?.includes(trackQuery.trim()) ||
                    o.orderNumber?.toLowerCase().includes(trackQuery.trim().toLowerCase())
                ).length === 0 && (
                  <p className="text-center text-sm text-slate-500 py-6">
                    No matching orders found for "{trackQuery}".
                  </p>
                )}
            </div>
          </div>
        </section>
      )}

      {/* VIEW 3: ADMIN MANAGEMENT SUITE */}
      {activeView === 'admin' && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {!isAdminUnlocked ? (
            <div className="max-w-md mx-auto glass-card rounded-[2rem] p-8 shadow-2xl border border-rose-200 text-center my-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-300/50">
                <Lock className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-widest">
                Executive Management Suite
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-2">
                Admin Authentication
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Enter your Admin Security PIN to manage live products, pricing, hero banner, and verify bKash/Nagad transactions.
              </p>

              <form onSubmit={handleAdminUnlock} className="space-y-4">
                <input
                  type="password"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  placeholder="Security PIN (Demo PIN: 2026)"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-rose-200 text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                {adminPinError && (
                  <p className="text-xs text-rose-600 font-semibold">{adminPinError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-300/60 hover:opacity-95 transition-all"
                >
                  Unlock Admin Suite
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-rose-200/70">
                <button
                  onClick={() => {
                    setAdminPinInput('2026');
                    setIsAdminUnlocked(true);
                    showToast("Admin Portal unlocked in Demo Mode!");
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold transition-all"
                >
                  ⚡ Instant Demo Unlock (PIN: 2026)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header */}
              <div className="glass-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
                        Executive Admin Suite
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        ● Live Sync Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Manage hero banners, costs, margins, product catalog, and bKash / Nagad order delivery queues.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'dashboard' as const, label: 'Analytics & Revenue', icon: BarChart3 },
                    { id: 'products' as const, label: `Perfumes (${products.length})`, icon: Package },
                    { id: 'banner' as const, label: 'Banner & BD Fees', icon: Edit3 },
                    { id: 'orders' as const, label: `Orders (${orders.length})`, icon: ShoppingCart },
                    { id: 'github' as const, label: 'Deployment Guide', icon: Layers }
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setAdminTab(t.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          adminTab === t.id
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-300/50'
                            : 'bg-white/90 text-slate-700 hover:bg-rose-50 border border-rose-200/70'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setIsAdminUnlocked(false)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-bold transition-all"
                  >
                    Lock
                  </button>
                </div>
              </div>

              {/* TAB 1: DASHBOARD */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
                      <span className="text-xs font-bold uppercase text-rose-600 tracking-wider">
                        Total Revenue (BDT)
                      </span>
                      <div className="text-3xl font-extrabold text-slate-900 mt-2">
                        {formatBDT(adminMetrics.totalRevenue)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Excludes cancelled orders</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
                      <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">
                        Estimated Gross Profit
                      </span>
                      <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                        {formatBDT(adminMetrics.netProfit)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Revenue minus product formulation cost</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
                      <span className="text-xs font-bold uppercase text-pink-600 tracking-wider">
                        Total Customer Orders
                      </span>
                      <div className="text-3xl font-extrabold text-slate-900 mt-2">
                        {adminMetrics.totalOrders}
                      </div>
                      <p className="text-xs text-amber-600 font-semibold mt-1">
                        {adminMetrics.pendingOrdersCount} Pending Verification
                      </p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-rose-200 shadow-sm">
                      <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">
                        Active Catalog Items
                      </span>
                      <div className="text-3xl font-extrabold text-slate-900 mt-2">
                        {products.length}
                      </div>
                      <p className="text-xs text-rose-600 font-semibold mt-1">
                        {adminMetrics.lowStockProducts.length} Fragrances Low in Stock
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                          Stock & Cost Margin Watch
                        </h3>
                        <button
                          onClick={openAddProductModal}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Flacon
                        </button>
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {products.map((p) => {
                          const unitProfit = Number(p.price) - Number(p.costPrice || Math.round(p.price * 0.5));
                          return (
                            <div
                              key={p.id}
                              className="flex items-center justify-between p-3 rounded-2xl bg-white/85 border border-rose-100"
                            >
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover" />
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                                  <span className="text-[11px] text-slate-500">
                                    Cost: {formatBDT(p.costPrice || 1500)} • Sell: {formatBDT(p.price)} •{' '}
                                    <strong className="text-emerald-600">Margin: {formatBDT(unitProfit)}</strong>
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                    p.stock <= 15
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {p.stock} units
                                </span>
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                          Recent Orders Queue
                        </h3>
                        <button
                          onClick={() => setAdminTab('orders')}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          View All ({orders.length}) →
                        </button>
                      </div>

                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-500 py-8 text-center">
                          No customer orders yet. Place a test order from the storefront!
                        </p>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          {orders.slice(0, 6).map((o) => (
                            <div
                              key={o.orderNumber}
                              className="p-3.5 rounded-2xl bg-white/85 border border-rose-100 flex items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-rose-600">{o.orderNumber}</span>
                                  <span className="text-xs font-bold text-slate-800">{o.customerName}</span>
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {o.phone} • {o.district} • <strong>{o.paymentMethod}</strong>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-extrabold text-slate-900">
                                  {formatBDT(o.totalAmount)}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER */}
              {adminTab === 'products' && (
                <div className="glass-card rounded-3xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">
                        Perfume Catalog & Cost Manager
                      </h2>
                      <p className="text-xs text-slate-500">
                        Update formulation costs, selling prices, bottle photography URLs, olfactory notes, and stock levels.
                      </p>
                    </div>
                    <button
                      onClick={openAddProductModal}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-300/50 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add New Fragrance
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-rose-200 text-[11px] uppercase tracking-wider text-slate-500">
                          <th className="py-3 px-3">Flacon & Name</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Unit Cost</th>
                          <th className="py-3 px-3">Selling Price</th>
                          <th className="py-3 px-3">Stock</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100 text-xs sm:text-sm">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-rose-50/50 transition-colors">
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-rose-200 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{prod.name}</div>
                                  <div className="text-xs text-slate-500">{prod.subtitle}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-semibold">
                                {prod.category}
                              </span>
                              <span className="block text-xs text-slate-500 mt-1">{prod.volume} • {prod.scentFamily}</span>
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-slate-600">
                              {formatBDT(prod.costPrice || Math.round(prod.price * 0.5))}
                            </td>
                            <td className="py-3.5 px-3 font-extrabold text-rose-600">
                              {formatBDT(prod.price)}
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                  prod.stock > 10
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {prod.stock} units
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs transition-all flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: BANNER & FEES */}
              {adminTab === 'banner' && (
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

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
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
              )}

              {/* TAB 4: ORDERS */}
              {adminTab === 'orders' && (
                <div className="glass-card rounded-3xl p-6 space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">
                      Customer Orders & bKash / Nagad Verification
                    </h2>
                    <p className="text-xs text-slate-500">
                      Verify mobile banking Transaction IDs (TrxID) and manage Steadfast/Pathao shipment pipeline.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No customer orders yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.orderNumber}
                          className="p-5 rounded-2xl bg-white/90 border border-rose-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold">
                                {order.orderNumber}
                              </span>
                              <span className="font-bold text-slate-900 text-sm">
                                {order.customerName}
                              </span>
                              <span className="text-xs font-semibold text-rose-600">
                                📞 {order.phone}
                              </span>
                              <span className="text-xs text-slate-400">
                                • {order.createdDateStr}
                              </span>
                            </div>

                            <div className="text-xs text-slate-600">
                              <strong>Delivery Address:</strong> {order.address}, {order.district} ({order.courier})
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <span className="px-2.5 py-1 rounded-md bg-pink-50 border border-pink-200 text-rose-800 text-xs font-bold">
                                Payment: {order.paymentMethod}
                              </span>
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                                TrxID: {order.trxId}
                              </span>
                              <span className="text-xs text-slate-600">
                                Items:{' '}
                                {(order.items || [])
                                  .map((i) => `${i.name} (${i.volume}) x${i.quantity}`)
                                  .join(', ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                            <div className="text-right mr-2">
                              <span className="text-[11px] text-slate-400 block">Grand Total</span>
                              <span className="text-lg font-extrabold text-rose-600">
                                {formatBDT(order.totalAmount)}
                              </span>
                            </div>

                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.orderNumber, e.target.value as OrderRecord['status'])
                              }
                              className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="Pending">Pending Verification</option>
                              <option value="Confirmed">Confirmed & Packed</option>
                              <option value="Shipped">Handed to Courier</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GITHUB & DEPLOY */}
              {adminTab === 'github' && (
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
              )}
            </div>
          )}
        </section>
      )}

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card bg-white rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-5">
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  {editingProduct ? `Edit Perfume: ${editingProduct.name}` : 'Add New Fragrance Flacon'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure formulation pricing in BDT, production costs, bottle image URL, and olfactory pyramid.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfume Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g., Velvet Rose & Oud"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Concentration / Subtitle *</label>
                  <input
                    type="text"
                    required
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    placeholder="e.g., Extrait de Parfum"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as PerfumeProduct['category'] })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                  >
                    <option value="For Her">For Her</option>
                    <option value="For Him">For Him</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Luxury Attar/Oud">Luxury Attar/Oud</option>
                    <option value="Gift Sets">Gift Sets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scent Family</label>
                  <select
                    value={productForm.scentFamily}
                    onChange={(e) => setProductForm({ ...productForm, scentFamily: e.target.value as PerfumeProduct['scentFamily'] })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                  >
                    <option value="Floral">Floral</option>
                    <option value="Oriental">Oriental</option>
                    <option value="Woody">Woody</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Gourmand">Gourmand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bottle Volume</label>
                  <input
                    type="text"
                    value={productForm.volume}
                    onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                    placeholder="100ml / 50ml / 30ml"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Product Cost (৳)</label>
                  <input
                    type="number"
                    required
                    value={productForm.costPrice}
                    onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-700 mb-1">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm font-extrabold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-9">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bottle Image URL *</label>
                    <input
                      type="url"
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-center">
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-2xl object-cover border border-rose-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-rose-600 mb-1.5">
                    Or Quick-Select a Preset Luxury Flacon:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {LUXURY_BOTTLE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => setProductForm({ ...productForm, image: preset.url })}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-left shrink-0 transition-all ${
                          productForm.image === preset.url
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-rose-50/70 text-slate-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="text-[11px] font-bold">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-rose-600 mb-1">Top Notes</label>
                  <input
                    type="text"
                    value={productForm.topNotes}
                    onChange={(e) => setProductForm({ ...productForm, topNotes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-pink-600 mb-1">Heart Notes</label>
                  <input
                    type="text"
                    value={productForm.middleNotes}
                    onChange={(e) => setProductForm({ ...productForm, middleNotes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-800 mb-1">Base Notes</label>
                  <input
                    type="text"
                    value={productForm.baseNotes}
                    onChange={(e) => setProductForm({ ...productForm, baseNotes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fragrance Story</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-300/60"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Fragrance Flacon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK VIEW */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card bg-white/95 rounded-[2.25rem] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center hover:bg-rose-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50 border border-rose-200">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                    {quickViewProduct.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                    {quickViewProduct.volume}
                  </span>
                </div>

                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest">
                  {quickViewProduct.subtitle}
                </p>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-rose-600">
                    {formatBDT(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-base text-slate-400 line-through">
                      {formatBDT(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/70 border border-rose-200 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-rose-700 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Olfactory Scent Pyramid
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white text-rose-600 font-bold w-24 text-center border border-rose-100">
                      Top Notes
                    </span>
                    <span className="text-slate-700 font-medium">
                      {Array.isArray(quickViewProduct.topNotes)
                        ? quickViewProduct.topNotes.join(' • ')
                        : quickViewProduct.topNotes}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white text-pink-600 font-bold w-24 text-center border border-rose-100">
                      Heart Notes
                    </span>
                    <span className="text-slate-700 font-medium">
                      {Array.isArray(quickViewProduct.middleNotes)
                        ? quickViewProduct.middleNotes.join(' • ')
                        : quickViewProduct.middleNotes}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white text-rose-900 font-bold w-24 text-center border border-rose-100">
                      Base Notes
                    </span>
                    <span className="text-slate-700 font-medium">
                      {Array.isArray(quickViewProduct.baseNotes)
                        ? quickViewProduct.baseNotes.join(' • ')
                        : quickViewProduct.baseNotes}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-500" /> Longevity
                      </span>
                      <span className="text-rose-600">{quickViewProduct.longevity || 90}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                        style={{ width: `${quickViewProduct.longevity || 90}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-rose-500" /> Sillage
                      </span>
                      <span className="text-rose-600">{quickViewProduct.sillage || 85}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                        style={{ width: `${quickViewProduct.sillage || 85}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-300/60 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag — {formatBDT(quickViewProduct.price)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SCENT QUIZ */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-card bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative">
            <button
              onClick={() => setIsQuizOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-rose-50 text-rose-600"
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
                      className="p-4 rounded-2xl border border-rose-200 hover:border-rose-500 hover:bg-rose-50/70 transition-all"
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
                    className="w-1/3 py-3 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
                  >
                    Retake
                  </button>
                  <button
                    onClick={() => {
                      addToCart(recommendedQuizProduct, 1);
                      setIsQuizOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg"
                  >
                    Add Match to Bag
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRAWER: SHOPPING BAG & BANGLADESH CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#FFF9FB] h-full shadow-2xl border-l border-rose-200 flex flex-col justify-between overflow-hidden">
            <div className="p-5 bg-white border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-slate-900 leading-none">
                    {checkoutStep === 'cart'
                      ? 'Your Luxury Perfume Bag'
                      : checkoutStep === 'shipping'
                      ? 'Bangladesh Express Checkout'
                      : 'Order Confirmed'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Free courier on orders above {formatBDT(storeConfig.freeShippingThreshold)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <ShoppingBag className="w-14 h-14 text-rose-300 mx-auto" />
                      <h4 className="font-serif-luxury text-2xl font-bold text-slate-800">
                        Your Bag is Empty
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Explore our signature French Extraits de Parfum & Sylheti Rose Ouds.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.cartKey}
                          className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-center gap-3.5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-rose-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                            <span className="text-xs text-rose-600 font-semibold">{item.selectedVolume}</span>
                            <div className="text-sm font-extrabold text-rose-600 mt-0.5">
                              {formatBDT(item.unitPrice * item.quantity)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200">
                            <button
                              onClick={() => updateCartQty(item.cartKey, -1)}
                              className="text-rose-700 hover:text-rose-900"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.cartKey, 1)}
                              className="text-rose-700 hover:text-rose-900"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Promo code (ROSE10)"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-xs uppercase font-bold"
                          />
                          <button
                            onClick={handleApplyPromo}
                            className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form id="bd-checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerForm.fullName}
                      onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                      placeholder="e.g., Tasnim Rahman"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bangladeshi Mobile (11 Digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-200 text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District / Region *</label>
                      <select
                        value={customerForm.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold"
                      >
                        {BD_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Express Courier</label>
                      <select
                        value={customerForm.courier}
                        onChange={(e) => setCustomerForm({ ...customerForm, courier: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold"
                      >
                        {COURIER_PARTNERS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      placeholder="House, Road, Block, Area (e.g. Banani, Gulshan, Uttara)"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-sm"
                    />
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'COD' as const, label: 'Cash on Delivery' },
                        { id: 'bKash' as const, label: 'bKash Payment' },
                        { id: 'Nagad' as const, label: 'Nagad Payment' },
                        { id: 'Rocket' as const, label: 'DBBL Rocket' }
                      ].map((pm) => (
                        <button
                          type="button"
                          key={pm.id}
                          onClick={() => setCustomerForm({ ...customerForm, paymentMethod: pm.id })}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            customerForm.paymentMethod === pm.id
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                              : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-50'
                          }`}
                        >
                          <div className="text-xs font-extrabold">{pm.id}</div>
                          <div
                            className={`text-[10px] ${
                              customerForm.paymentMethod === pm.id ? 'text-rose-100' : 'text-slate-400'
                            }`}
                          >
                            {pm.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    {customerForm.paymentMethod !== 'COD' && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-800">
                            {customerForm.paymentMethod} Merchant Number:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const num =
                                customerForm.paymentMethod === 'bKash'
                                  ? storeConfig.bkashMerchant
                                  : customerForm.paymentMethod === 'Nagad'
                                  ? storeConfig.nagadMerchant
                                  : storeConfig.rocketMerchant;
                              navigator.clipboard?.writeText(num);
                              setCopiedNumber(true);
                              setTimeout(() => setCopiedNumber(false), 2000);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-rose-700 text-xs font-extrabold border border-rose-200"
                          >
                            {customerForm.paymentMethod === 'bKash'
                              ? storeConfig.bkashMerchant
                              : customerForm.paymentMethod === 'Nagad'
                              ? storeConfig.nagadMerchant
                              : storeConfig.rocketMerchant}
                            {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Please Send Money / Payment of <strong>{formatBDT(grandTotal)}</strong> and enter your TrxID below:
                        </p>
                        <input
                          type="text"
                          required
                          value={customerForm.trxId}
                          onChange={(e) => setCustomerForm({ ...customerForm, trxId: e.target.value })}
                          placeholder={`Enter ${customerForm.paymentMethod} TrxID`}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-xs font-mono uppercase font-bold"
                        />
                      </div>
                    )}
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && lastPlacedOrder && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                    Order ID: {lastPlacedOrder.orderNumber}
                  </span>
                  <h4 className="font-serif-luxury text-3xl font-bold text-slate-900">
                    Dhonnobad, {lastPlacedOrder.customerName}!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your luxury order has been registered and handed to <strong>{lastPlacedOrder.courier}</strong> for delivery to {lastPlacedOrder.district}.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-rose-200 text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-bold">{lastPlacedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <span className="font-bold">{lastPlacedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payable Total:</span>
                      <span className="font-extrabold text-rose-600">{formatBDT(lastPlacedOrder.totalAmount)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep('cart');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs"
                  >
                    Continue Exploring Perfumes
                  </button>
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className="p-5 bg-white border-t border-rose-100 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatBDT(cartSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedDiscount}%)</span>
                      <span>-{formatBDT(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Delivery ({customerForm.deliveryZone === 'inside' ? 'Inside Dhaka' : customerForm.deliveryZone === 'suburbs' ? 'Dhaka Suburbs' : 'Outside Dhaka'})
                    </span>
                    <span className="font-bold">
                      {shippingFee === 0 ? 'FREE' : formatBDT(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-rose-100">
                    <span>Total (BDT)</span>
                    <span className="text-rose-600">{formatBDT(grandTotal)}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-300/60 flex items-center justify-center gap-2"
                  >
                    Proceed to Bangladesh Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="w-1/3 py-3.5 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      form="bd-checkout-form"
                      className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-300/60"
                    >
                      Confirm Order ({formatBDT(grandTotal)})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 glass-card border-t border-rose-200/80 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-600">
          <div className="space-y-3">
            <span className="font-serif-luxury text-2xl font-bold text-rose-800 block">
              {storeConfig.storeName}
            </span>
            <p className="leading-relaxed">
              Luxury French Extraits de Parfum & Artisanal Sylheti Oud atelier operating across Dhaka, Chattogram, Sylhet and all 64 districts of Bangladesh.
            </p>
            <div className="text-rose-700 font-semibold">
              bKash Merchant: {storeConfig.bkashMerchant}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">Collections</h4>
            <ul className="space-y-1.5">
              <li>Velvet Damask Rose Extrait</li>
              <li>Royal Sylheti Agarwood Attar</li>
              <li>Bridal Gift Coffrets</li>
              <li>Unisex Crystal Amber</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">Courier Rates</h4>
            <ul className="space-y-1.5">
              <li>Inside Dhaka: {formatBDT(storeConfig.insideDhakaFee)} (24 Hours)</li>
              <li>Dhaka Suburbs: {formatBDT(storeConfig.suburbsDhakaFee)}</li>
              <li>Outside Dhaka: {formatBDT(storeConfig.outsideDhakaFee)} (48-72 Hours)</li>
              <li>Partners: Steadfast, Pathao, RedX</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">Boutique & Admin</h4>
            <p>Atelier Boutique: Road 11, Banani, Dhaka-1213, Bangladesh</p>
            <button
              onClick={() => setActiveView('admin')}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition-all"
            >
              <Lock className="w-3.5 h-3.5" /> Open Executive Admin (PIN: 2026)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
