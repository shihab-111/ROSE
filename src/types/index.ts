/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  bkashType?: string;
  nagadType?: string;
  rocketType?: string;
  bkashInstructions?: string;
  nagadInstructions?: string;
  rocketInstructions?: string;
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

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type BgMode = 'silk-aurora' | 'rose-petals' | 'crystal-mesh';
export type ViewMode = 'storefront' | 'admin' | 'track-order';
export type AdminTab = 'dashboard' | 'products' | 'payments' | 'banner' | 'orders' | 'github';
