/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { PerfumeProduct, StoreConfig } from '../types';

export const OFFLINE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.currentTarget;
  if (!img.dataset.hasFailed) {
    img.dataset.hasFailed = "true";
    img.src = OFFLINE_FALLBACK_IMAGE;
  }
};

export const VOLUME_MULTIPLIERS: Record<string, number> = {
  "10ml Decant": 0.22,
  "30ml": 0.48,
  "50ml": 0.72,
  "100ml": 1.0
};

export const LUXURY_BOTTLE_PRESETS = [
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

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: "ÉCLAT DE ROSE",
  tagline: "DHAKA • PARIS • GRASSE",
  announcementText:
    "🌸 SPRING & EID LUXURY COLLECTION: Use code ROSE10 for 10% OFF! Free courier delivery across Bangladesh on orders over ৳5,000 🌸",
  bannerBadge: "2026 SIGNATURE ATELIER COLLECTION",
  bannerTitle: "The Essence of Blooming Luxury",
  bannerSubtitle:
    "Handcrafted French Extraits de Parfum & Artisanal Rose Ouds curated exclusively for Bangladesh's climate. Intense 24-hour longevity and magnetic projection.",
  bannerCta: "Explore Fragrances",
  bannerImage:
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85",
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
  bkashType: "Personal (Send Money)",
  nagadType: "Personal (Send Money)",
  rocketType: "Personal (Send Money)",
  bkashInstructions:
    "Send Money to our personal bKash number via bKash App or *247# and submit the TrxID below.",
  nagadInstructions:
    "Send Money to our personal Nagad number via Nagad App or *167# and submit the TrxID below.",
  rocketInstructions:
    "Send Money to our 12-digit DBBL Rocket number via Rocket App or *322# and submit the TrxID below.",
  adminPin: "2026"
};

export const INITIAL_PRODUCTS: PerfumeProduct[] = [
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
    description:
      "A hypnotic fusion of velvety Turkish Damask rose wrapped in smoky Cambodian agarwood, sweet praline, and warm ambergris. Specially calibrated to bloom gorgeously in warm South Asian evenings.",
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
    description:
      "Inspired by monsoon mist rolling over Sylhet's lush green tea estates and blooming night Beli jasmine. Crisp, dewy, and effortlessly serene.",
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
    description:
      "Distilled from aged Sylheti agarwood and infused with Taif rose otto and saffron threads. Alcohol-free luxury oil concentration that lingers on fine fabrics for days.",
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
    description:
      "Like draping a delicate blush silk Jamdani scarf. Sparkling luscious lychee and mandarin open into a lavish heart of pink peony and velvety suede musk.",
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
    description:
      "An addictive crystal amber and caramelized saffron masterpiece. Luminous saffron and Egyptian jasmine meet mineral ambergris and freshly cut cedar.",
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
    description:
      "Effervescent pink champagne bubbles, wild strawberries, and whipped bourbon vanilla cream. Playful, celebratory, and irresistibly magnetic.",
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
    description:
      "A refined masculine woody signature with an unexpected heart of dark rose, Mysore sandalwood, cracked black pepper, and Haitian vetiver.",
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
    description:
      "Presented in our signature blush velvet & rose-gold gift coffret. Includes 30ml travel sprays of Rose de Dhaka, Sylhet Rain, and Lychee Blossom.",
    topNotes: ["Rose Otto", "Pink Champagne", "White Tea"],
    middleNotes: ["Jasmine Sambac", "Peony", "Oud Wood"],
    baseNotes: ["White Amber", "Silk Musk", "Vanilla Bean"]
  }
];

export const BD_DISTRICTS = [
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

export const COURIER_PARTNERS = ["Steadfast Courier", "Pathao Courier", "RedX Logistics"];

export const BG_MODES = [
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

export const formatBDT = (amount: number | string) => {
  const num = Math.round(Number(amount) || 0);
  return `৳${num.toLocaleString('en-IN')}`;
};
