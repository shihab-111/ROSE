/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  PerfumeProduct, 
  StoreConfig, 
  OrderRecord, 
  AdminTab 
} from '../types';
import { DEFAULT_STORE_CONFIG } from '../constants';
import { useStore } from './StoreContext';
import { 
  syncConfigToFirestore, 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  updateOrderStatusInFirestore 
} from '../services/firebase';

interface AdminContextType {
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  adminPinInput: string;
  setAdminPinInput: (pin: string) => void;
  adminPinError: string;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  
  receiptOrder: OrderRecord | null;
  setReceiptOrder: (order: OrderRecord | null) => void;
  receiptPaperWidth: '80mm' | '58mm';
  setReceiptPaperWidth: (w: '80mm' | '58mm') => void;
  adminOrderSearch: string;
  setAdminOrderSearch: (s: string) => void;
  adminOrderFilter: 'All' | 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  setAdminOrderFilter: (f: 'All' | 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled') => void;

  bannerForm: StoreConfig;
  setBannerForm: React.Dispatch<React.SetStateAction<StoreConfig>>;
  editingProduct: PerfumeProduct | null;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  productForm: {
    name: string;
    subtitle: string;
    category: PerfumeProduct['category'];
    scentFamily: PerfumeProduct['scentFamily'];
    volume: string;
    costPrice: number;
    price: number;
    originalPrice: number;
    stock: number;
    featured: boolean;
    longevity: number;
    sillage: number;
    image: string;
    description: string;
    topNotes: string;
    middleNotes: string;
    baseNotes: string;
  };
  setProductForm: React.Dispatch<React.SetStateAction<{
    name: string;
    subtitle: string;
    category: PerfumeProduct['category'];
    scentFamily: PerfumeProduct['scentFamily'];
    volume: string;
    costPrice: number;
    price: number;
    originalPrice: number;
    stock: number;
    featured: boolean;
    longevity: number;
    sillage: number;
    image: string;
    description: string;
    topNotes: string;
    middleNotes: string;
    baseNotes: string;
  }>>;

  adminMetrics: {
    totalRevenue: number;
    netProfit: number;
    totalOrders: number;
    pendingOrdersCount: number;
    lowStockProducts: PerfumeProduct[];
  };

  handleAdminUnlock: (e: React.FormEvent) => void;
  handleSaveStoreConfig: (e?: React.FormEvent, successMsg?: string) => Promise<void>;
  handleCreateSampleOrder: () => void;
  openAddProductModal: () => void;
  openEditProductModal: (prod: PerfumeProduct) => void;
  handleSaveProduct: (e: React.FormEvent) => Promise<void>;
  handleDeleteProduct: (prodId: string, prodName: string) => Promise<void>;
  handleUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['status']) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    storeConfig, 
    setStoreConfig, 
    products, 
    setProducts, 
    orders, 
    setOrders, 
    setBgMode, 
    showToast 
  } = useStore();

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const [receiptOrder, setReceiptOrder] = useState<OrderRecord | null>(null);
  const [receiptPaperWidth, setReceiptPaperWidth] = useState<'80mm' | '58mm'>('80mm');
  const [adminOrderSearch, setAdminOrderSearch] = useState('');
  const [adminOrderFilter, setAdminOrderFilter] = useState<
    'All' | 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  >('All');

  const [bannerForm, setBannerForm] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('edr_store_config');
      return saved ? { ...DEFAULT_STORE_CONFIG, ...JSON.parse(saved) } : DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  useEffect(() => {
    setBannerForm((prev) => ({ ...DEFAULT_STORE_CONFIG, ...prev, ...storeConfig }));
  }, [storeConfig]);

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

  const handleSaveStoreConfig = async (
    e?: React.FormEvent,
    successMsg = "Store settings & payment numbers saved live!"
  ) => {
    if (e && e.preventDefault) e.preventDefault();
    const updatedConfig: StoreConfig = {
      ...DEFAULT_STORE_CONFIG,
      ...storeConfig,
      ...bannerForm,
      insideDhakaFee: Number(bannerForm.insideDhakaFee),
      suburbsDhakaFee: Number(bannerForm.suburbsDhakaFee),
      outsideDhakaFee: Number(bannerForm.outsideDhakaFee),
      freeShippingThreshold: Number(bannerForm.freeShippingThreshold)
    };

    await syncConfigToFirestore(updatedConfig);
    setStoreConfig(updatedConfig);
    setBannerForm(updatedConfig);
    if (bannerForm.bgAnimationMode) {
      setBgMode(bannerForm.bgAnimationMode);
    }
    showToast(successMsg);
  };

  const handleCreateSampleOrder = () => {
    const demoOrder: OrderRecord = {
      orderNumber: `EDR-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Ayesha Rahman",
      phone: "01755123456",
      district: "Dhaka City (Inside Dhaka)",
      deliveryZone: "inside",
      address: "House 42, Road 11, Block D, Banani",
      courier: "Steadfast Courier",
      paymentMethod: "bKash",
      senderNumber: "01755123456",
      trxId: "9K2M7X19QL",
      notes: "Please call before delivery. Fragile perfume flacon.",
      items: [
        {
          id: products[0]?.id || "perfume-1",
          name: products[0]?.name || "Rose de Dhaka Extrait",
          volume: "100ml",
          price: products[0]?.price || 3850,
          costPrice: products[0]?.costPrice || 1850,
          quantity: 1,
          image: products[0]?.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539"
        },
        {
          id: products[1]?.id || "perfume-2",
          name: products[1]?.name || "Sylhet Rain & White Tea",
          volume: "10ml Decant",
          price: 650,
          costPrice: 300,
          quantity: 2,
          image: products[1]?.image || "https://images.unsplash.com/photo-1541643600914-78b084683601"
        }
      ],
      subtotal: 5150,
      discount: 0,
      shippingFee: 0,
      totalAmount: 5150,
      status: "Confirmed",
      createdAt: Date.now(),
      createdDateStr: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    setOrders((prev) => [demoOrder, ...prev]);
    showToast("Sample customer order created! You can now print the thermal receipt.");
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
        const updated = { ...editingProduct, ...payload } as PerfumeProduct;
        await saveProductToFirestore(updated, true);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        showToast(`Updated "${payload.name}" in catalog!`);
      } else {
        const newId = `perfume-${Date.now()}`;
        const newProd = { id: newId, ...payload } as PerfumeProduct;
        await saveProductToFirestore(newProd, false);
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
    await deleteProductFromFirestore(prodId);
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    showToast(`Removed "${prodName}" from catalog.`);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    await updateOrderStatusInFirestore(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderId || o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to ${newStatus}`);
  };

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

  return (
    <AdminContext.Provider
      value={{
        isAdminUnlocked,
        setIsAdminUnlocked,
        adminPinInput,
        setAdminPinInput,
        adminPinError,
        adminTab,
        setAdminTab,
        receiptOrder,
        setReceiptOrder,
        receiptPaperWidth,
        setReceiptPaperWidth,
        adminOrderSearch,
        setAdminOrderSearch,
        adminOrderFilter,
        setAdminOrderFilter,
        bannerForm,
        setBannerForm,
        editingProduct,
        isProductModalOpen,
        setIsProductModalOpen,
        productForm,
        setProductForm,
        adminMetrics,
        handleAdminUnlock,
        handleSaveStoreConfig,
        handleCreateSampleOrder,
        openAddProductModal,
        openEditProductModal,
        handleSaveProduct,
        handleDeleteProduct,
        handleUpdateOrderStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
