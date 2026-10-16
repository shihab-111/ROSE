/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { 
  PerfumeProduct, 
  StoreConfig, 
  CartItem, 
  OrderRecord, 
  BgMode, 
  ViewMode 
} from '../types';
import { 
  DEFAULT_STORE_CONFIG, 
  INITIAL_PRODUCTS, 
  VOLUME_MULTIPLIERS 
} from '../constants';
import { 
  initFirebaseService, 
  syncOrderToFirestore 
} from '../services/firebase';

interface StoreContextType {
  // State
  currentUser: any;
  storeConfig: StoreConfig;
  setStoreConfig: React.Dispatch<React.SetStateAction<StoreConfig>>;
  products: PerfumeProduct[];
  setProducts: React.Dispatch<React.SetStateAction<PerfumeProduct[]>>;
  orders: OrderRecord[];
  setOrders: React.Dispatch<React.SetStateAction<OrderRecord[]>>;
  bgMode: BgMode;
  setBgMode: (mode: BgMode) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedFamily: string;
  setSelectedFamily: (fam: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
  selectedVolumes: Record<string, string>;
  setSelectedVolumes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  
  // Modals & Drawers
  quickViewProduct: PerfumeProduct | null;
  setQuickViewProduct: (prod: PerfumeProduct | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cart: CartItem[];
  wishlist: string[];
  toast: { message: string; type?: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
  
  // Quiz
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  quizStep: number;
  setQuizStep: (step: number) => void;
  quizAnswers: { vibe: string; intensity: string };
  setQuizAnswers: React.Dispatch<React.SetStateAction<{ vibe: string; intensity: string }>>;
  recommendedQuizProduct: PerfumeProduct | null;

  // Checkout
  checkoutStep: 'cart' | 'shipping' | 'success';
  setCheckoutStep: (step: 'cart' | 'shipping' | 'success') => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedDiscount: number;
  customerForm: {
    fullName: string;
    phone: string;
    district: string;
    deliveryZone: 'inside' | 'suburbs' | 'outside';
    address: string;
    courier: string;
    paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket';
    senderNumber: string;
    trxId: string;
    notes: string;
  };
  setCustomerForm: React.Dispatch<React.SetStateAction<{
    fullName: string;
    phone: string;
    district: string;
    deliveryZone: 'inside' | 'suburbs' | 'outside';
    address: string;
    courier: string;
    paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket';
    senderNumber: string;
    trxId: string;
    notes: string;
  }>>;
  lastPlacedOrder: OrderRecord | null;
  copiedNumber: boolean;
  setCopiedNumber: (copied: boolean) => void;
  showIOSGuide: boolean;
  setShowIOSGuide: (show: boolean) => void;
  trackQuery: string;
  setTrackQuery: (query: string) => void;

  // Computed & Helpers
  getProductVolume: (product: PerfumeProduct) => string;
  getDynamicPrice: (basePrice: number, chosenVol: string, defaultVol?: string) => number;
  filteredProducts: PerfumeProduct[];
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  grandTotal: number;
  addToCart: (product: PerfumeProduct, qty?: number, customVolume?: string) => void;
  updateCartQty: (cartKey: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  handleApplyPromo: () => void;
  handleDistrictChange: (district: string) => void;
  handlePlaceOrder: (e: React.FormEvent) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('edr_store_config');
      return saved ? { ...DEFAULT_STORE_CONFIG, ...JSON.parse(saved) } : DEFAULT_STORE_CONFIG;
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

  const [bgMode, setBgMode] = useState<BgMode>('silk-aurora');
  const [activeView, setActiveView] = useState<ViewMode>('storefront');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(7500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedVolumes, setSelectedVolumes] = useState<Record<string, string>>({});

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

  // Scent Quiz
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ vibe: '', intensity: '' });

  // Checkout
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
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');

  // Local Storage Sync
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

  // Firebase Realtime Service Initialization
  useEffect(() => {
    const unsub = initFirebaseService({
      onUserChange: (u) => setCurrentUser(u),
      onConfigChange: (data) => {
        setStoreConfig((prev) => ({ ...prev, ...data }));
        if (data.bgAnimationMode) setBgMode(data.bgAnimationMode);
      },
      onProductsChange: (list) => setProducts(list),
      onOrdersChange: (list) => setOrders(list)
    });
    return unsub;
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

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

      // Sync with Firestore
      await syncOrderToFirestore(
        newOrder,
        cart.map((c) => ({ id: c.id, quantity: c.quantity, stock: c.stock }))
      );

      // Local state update
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
    <StoreContext.Provider
      value={{
        currentUser,
        storeConfig,
        setStoreConfig,
        products,
        setProducts,
        orders,
        setOrders,
        bgMode,
        setBgMode,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedFamily,
        setSelectedFamily,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        selectedVolumes,
        setSelectedVolumes,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        cart,
        wishlist,
        toast,
        showToast,
        isQuizOpen,
        setIsQuizOpen,
        quizStep,
        setQuizStep,
        quizAnswers,
        setQuizAnswers,
        recommendedQuizProduct,
        checkoutStep,
        setCheckoutStep,
        promoCode,
        setPromoCode,
        appliedDiscount,
        customerForm,
        setCustomerForm,
        lastPlacedOrder,
        copiedNumber,
        setCopiedNumber,
        showIOSGuide,
        setShowIOSGuide,
        trackQuery,
        setTrackQuery,
        getProductVolume,
        getDynamicPrice,
        filteredProducts,
        cartSubtotal,
        shippingFee,
        discountAmount,
        grandTotal,
        addToCart,
        updateCartQty,
        toggleWishlist,
        handleApplyPromo,
        handleDistrictChange,
        handlePlaceOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
