/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
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
import type { StoreConfig, PerfumeProduct, OrderRecord } from '../types';
import { DEFAULT_STORE_CONFIG, INITIAL_PRODUCTS } from '../constants';

declare global {
  var __firebase_config: string | undefined;
  var __app_id: string | undefined;
  var __initial_auth_token: string | undefined;
}

export function getAppId(): string {
  if (typeof window !== 'undefined' && (window as any).__app_id) {
    return (window as any).__app_id;
  }
  return 'eclat-de-rose-bd';
}

export function getFirebaseRawConfig(): any {
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
  return rawConfig;
}

export function initFirebaseService(callbacks: {
  onUserChange: (user: User | { uid: string; isLocal: boolean } | null) => void;
  onConfigChange: (config: Partial<StoreConfig>) => void;
  onProductsChange: (products: PerfumeProduct[]) => void;
  onOrdersChange: (orders: OrderRecord[]) => void;
}) {
  const rawConfig = getFirebaseRawConfig();
  const isFbValid = Boolean(rawConfig && rawConfig.apiKey);

  if (!isFbValid) {
    callbacks.onUserChange({ uid: 'local-admin-dhaka', isLocal: true });
    return () => {};
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(rawConfig);
    const auth = getAuth(app);
    const db: Firestore = getFirestore(app);
    const appId = getAppId();

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Sign-in anonymously error:", err);
        }
      }
      callbacks.onUserChange(u);
    });

    const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'storeConfig');
    const unsubConfig = onSnapshot(
      configDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<StoreConfig>;
          callbacks.onConfigChange(data);
        } else {
          setDoc(configDocRef, DEFAULT_STORE_CONFIG).catch(() => {});
        }
      },
      (error) => {
        console.warn("Firestore config listener fallback to local state:", error);
      }
    );

    const productsColRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    const unsubProducts = onSnapshot(
      productsColRef,
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PerfumeProduct[];
          callbacks.onProductsChange(list);
        } else {
          INITIAL_PRODUCTS.forEach((p) => {
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id), p).catch(() => {});
          });
        }
      },
      (error) => {
        console.warn("Firestore products listener fallback to local state:", error);
      }
    );

    const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    const unsubOrders = onSnapshot(
      ordersColRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as OrderRecord[];
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callbacks.onOrdersChange(list);
      },
      (error) => {
        console.warn("Firestore orders listener fallback to local state:", error);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubConfig();
      unsubProducts();
      unsubOrders();
    };
  } catch (err) {
    console.warn("Firebase runtime initialization skipped:", err);
    callbacks.onUserChange({ uid: 'local-admin-dhaka', isLocal: true });
    return () => {};
  }
}

export async function syncOrderToFirestore(order: OrderRecord, cartItems: { id: string; quantity: number; stock?: number }[]) {
  try {
    if (getApps().length > 0) {
      const db = getFirestore(getApp());
      const appId = getAppId();
      const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
      await addDoc(ordersColRef, order);

      for (const item of cartItems) {
        const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', item.id);
        const newStock = Math.max(0, (item.stock || 10) - item.quantity);
        await updateDoc(pRef, { stock: newStock }).catch(() => {});
      }
    }
  } catch (e) {
    console.warn("Firestore order sync fallback to local state:", e);
  }
}

export async function syncConfigToFirestore(config: StoreConfig) {
  try {
    if (getApps().length > 0) {
      const db = getFirestore(getApp());
      const appId = getAppId();
      const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'storeConfig');
      await setDoc(configDocRef, config);
    }
  } catch (e) {
    console.warn("Firestore config save fallback to local state:", e);
  }
}

export async function saveProductToFirestore(product: PerfumeProduct, isEdit: boolean) {
  try {
    if (getApps().length > 0) {
      const db = getFirestore(getApp());
      const appId = getAppId();
      const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', product.id);
      if (isEdit) {
        await updateDoc(pRef, product as any);
      } else {
        await setDoc(pRef, product);
      }
    }
  } catch (e) {
    console.warn("Firestore save product fallback to local state:", e);
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    if (getApps().length > 0) {
      const db = getFirestore(getApp());
      const appId = getAppId();
      const pRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', productId);
      await deleteDoc(pRef);
    }
  } catch (e) {
    console.warn("Firestore delete product fallback to local state:", e);
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: OrderRecord['status']) {
  try {
    if (getApps().length > 0) {
      const db = getFirestore(getApp());
      const appId = getAppId();
      const oRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      await updateDoc(oRef, { status });
    }
  } catch (e) {
    console.warn("Firestore order status update fallback to local state:", e);
  }
}
