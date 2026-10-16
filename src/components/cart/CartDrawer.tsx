/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShoppingBag, 
  X, 
  Minus, 
  Plus, 
  Copy, 
  Check, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  handleImageError, 
  formatBDT, 
  BD_DISTRICTS, 
  COURIER_PARTNERS 
} from '../../constants';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    checkoutStep,
    setCheckoutStep,
    cart,
    updateCartQty,
    storeConfig,
    promoCode,
    setPromoCode,
    handleApplyPromo,
    appliedDiscount,
    customerForm,
    setCustomerForm,
    handleDistrictChange,
    handlePlaceOrder,
    copiedNumber,
    setCopiedNumber,
    showToast,
    lastPlacedOrder,
    cartSubtotal,
    shippingFee,
    discountAmount,
    grandTotal
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#FFF9FB] h-full shadow-2xl border-l border-rose-200 flex flex-col justify-between overflow-hidden">
        {/* Header */}
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
            className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
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
                        onError={handleImageError}
                        loading="lazy"
                        decoding="async"
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
                          className="text-rose-700 hover:text-rose-900 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.cartKey, 1)}
                          className="text-rose-700 hover:text-rose-900 p-0.5"
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
                        className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs transition-colors"
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
                      <div>
                        <span className="text-xs font-bold text-rose-800 block">
                          {customerForm.paymentMethod} Number:
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {customerForm.paymentMethod === 'bKash'
                            ? storeConfig.bkashType || 'Personal (Send Money)'
                            : customerForm.paymentMethod === 'Nagad'
                            ? storeConfig.nagadType || 'Personal (Send Money)'
                            : storeConfig.rocketType || 'Personal (Send Money)'}
                        </span>
                      </div>
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
                          showToast(`Copied ${customerForm.paymentMethod} number: ${num}`);
                          setTimeout(() => setCopiedNumber(false), 2000);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-rose-700 text-xs font-extrabold border border-rose-300 shadow-sm hover:bg-rose-100 transition-all"
                      >
                        {customerForm.paymentMethod === 'bKash'
                          ? storeConfig.bkashMerchant
                          : customerForm.paymentMethod === 'Nagad'
                          ? storeConfig.nagadMerchant
                          : storeConfig.rocketMerchant}
                        {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      {customerForm.paymentMethod === 'bKash'
                        ? storeConfig.bkashInstructions || `Please Send Money of ${formatBDT(grandTotal)} to the number above.`
                        : customerForm.paymentMethod === 'Nagad'
                        ? storeConfig.nagadInstructions || `Please Send Money of ${formatBDT(grandTotal)} to the number above.`
                        : storeConfig.rocketInstructions || `Please Send Money of ${formatBDT(grandTotal)} to the number above.`}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Your {customerForm.paymentMethod} Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerForm.senderNumber}
                          onChange={(e) => setCustomerForm({ ...customerForm, senderNumber: e.target.value })}
                          placeholder="01XXXXXXXXX"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Transaction ID (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerForm.trxId}
                          onChange={(e) => setCustomerForm({ ...customerForm, trxId: e.target.value })}
                          placeholder={`Enter ${customerForm.paymentMethod} TrxID`}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-xs font-mono uppercase font-bold"
                        />
                      </div>
                    </div>
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-all"
              >
                Continue Exploring Perfumes
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && checkoutStep !== 'success' && (
          <div className="p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white border-t border-rose-100 space-y-3">
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-300/60 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                Proceed to Bangladesh Checkout <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="w-1/3 py-3.5 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  form="bd-checkout-form"
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-300/60 hover:opacity-95 transition-all"
                >
                  Confirm Order ({formatBDT(grandTotal)})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
