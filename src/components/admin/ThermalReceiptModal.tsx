/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, Copy, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { formatBDT } from '../../constants';

export const ThermalReceiptModal: React.FC = () => {
  const {
    receiptOrder,
    setReceiptOrder,
    receiptPaperWidth,
    setReceiptPaperWidth
  } = useAdmin();

  const { storeConfig, showToast } = useStore();

  if (!receiptOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-200/90 rounded-[2rem] max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-300 relative my-6 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Printer className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900 leading-none">
                Thermal POS Receipt
              </h3>
              <span className="text-[10px] text-slate-600 font-mono">
                Order #{receiptOrder.orderNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-slate-300 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setReceiptPaperWidth('80mm')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  receiptPaperWidth === '80mm'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                80mm
              </button>
              <button
                type="button"
                onClick={() => setReceiptPaperWidth('58mm')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  receiptPaperWidth === '58mm'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                58mm
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const courierText = `Order: ${receiptOrder.orderNumber}
Customer: ${receiptOrder.customerName}
Phone: ${receiptOrder.phone}
Address: ${receiptOrder.address}, ${receiptOrder.district}
Courier: ${receiptOrder.courier}
Items: ${(receiptOrder.items || []).map((i) => `${i.name} (${i.volume}) x${i.quantity}`).join(', ')}
COD Collection: ৳${receiptOrder.paymentMethod === 'COD' ? receiptOrder.totalAmount : 0}`;
                navigator.clipboard?.writeText(courierText);
                showToast("Courier dispatch info copied to clipboard!");
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 shadow-sm transition-all"
              title="Copy for Steadfast / Pathao Courier Panel"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Copy Note</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-slate-400/50 hover:scale-105 transition-all"
              title="Print to POS Thermal Printer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={() => setReceiptOrder(null)}
              className="p-2 rounded-xl bg-slate-300 hover:bg-slate-400 text-slate-800 transition-all"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto py-2 flex justify-center">
          <div
            id="thermal-receipt-print"
            className={`receipt-${receiptPaperWidth} bg-white text-slate-950 font-mono shadow-lg border border-slate-300 p-5 rounded-sm transition-all leading-relaxed ${
              receiptPaperWidth === '58mm' ? 'w-[280px] text-[10px]' : 'w-[360px] text-xs'
            }`}
          >
            {/* Store Header */}
            <div className="text-center space-y-0.5 pb-2">
              <div className="text-sm font-black tracking-widest uppercase">
                *** {storeConfig.storeName} ***
              </div>
              <div className="text-[10px] tracking-wider text-slate-700 font-semibold">
                {storeConfig.tagline}
              </div>
              <div className="text-[10px] text-slate-600">
                Flagship: Road 11, Banani, Dhaka-1213
              </div>
              <div className="text-[10px] text-slate-600">
                bKash: {storeConfig.bkashMerchant} • Nagad: {storeConfig.nagadMerchant}
              </div>
              {storeConfig.rocketMerchant && (
                <div className="text-[10px] text-slate-600">
                  Rocket: {storeConfig.rocketMerchant} • www.eclatderose.com
                </div>
              )}
            </div>

            <div className="text-center font-bold tracking-tight text-slate-400 select-none">
              ================================
            </div>

            {/* Receipt Metadata */}
            <div className="space-y-0.5 py-1 text-[11px]">
              <div className="flex justify-between">
                <span className="font-bold">INVOICE NO:</span>
                <span className="font-extrabold font-mono">{receiptOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">DATE/TIME :</span>
                <span>{receiptOrder.createdDateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">STATUS    :</span>
                <span className="font-bold uppercase underline">{receiptOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">COURIER   :</span>
                <span>{receiptOrder.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">ZONE      :</span>
                <span>
                  {receiptOrder.deliveryZone === 'inside'
                    ? 'Inside Dhaka'
                    : receiptOrder.deliveryZone === 'suburbs'
                    ? 'Dhaka Suburbs'
                    : 'Outside Dhaka'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">PAY METHOD:</span>
                <span className="font-bold">{receiptOrder.paymentMethod}</span>
              </div>
              {receiptOrder.paymentMethod !== 'COD' && (
                <>
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold">TRX ID    :</span>
                    <span className="font-mono font-bold">{receiptOrder.trxId}</span>
                  </div>
                  {receiptOrder.senderNumber && (
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold">SENDER NO :</span>
                      <span className="font-mono">{receiptOrder.senderNumber}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="text-center font-bold tracking-tight text-slate-400 select-none">
              --------------------------------
            </div>

            {/* Customer Details */}
            <div className="space-y-0.5 py-1 text-[11px]">
              <div className="font-bold uppercase text-[10px] text-slate-600">
                BILL & DELIVER TO:
              </div>
              <div className="font-extrabold text-slate-900 text-xs">
                {receiptOrder.customerName}
              </div>
              <div>PHONE: <strong className="font-mono">{receiptOrder.phone}</strong></div>
              <div>DEST : {receiptOrder.district}</div>
              <div className="text-[10px] leading-tight text-slate-800">
                ADDR : {receiptOrder.address}
              </div>
              {receiptOrder.notes && (
                <div className="text-[10px] italic text-slate-600 pt-0.5">
                  NOTE : {receiptOrder.notes}
                </div>
              )}
            </div>

            <div className="text-center font-bold tracking-tight text-slate-400 select-none">
              --------------------------------
            </div>

            {/* Itemized Table */}
            <div className="py-1">
              <div className="flex justify-between font-bold text-[10px] uppercase border-b border-dashed border-slate-300 pb-1 mb-1.5">
                <span>ITEM / VOL</span>
                <span className="text-right">QTY x PRICE   TOTAL</span>
              </div>

              <div className="space-y-2">
                {(receiptOrder.items || []).map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-bold text-[11px] leading-tight">
                      {item.name}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-700">
                      <span>Vol: {item.volume}</span>
                      <span className="font-mono">
                        {item.quantity} x {formatBDT(item.price)} = {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center font-bold tracking-tight text-slate-400 select-none">
              --------------------------------
            </div>

            {/* Accounting Totals */}
            <div className="space-y-1 py-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatBDT(receiptOrder.subtotal)}</span>
              </div>
              {receiptOrder.discount > 0 && (
                <div className="flex justify-between font-semibold">
                  <span>Promo Discount:</span>
                  <span>-{formatBDT(receiptOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge ({receiptOrder.deliveryZone === 'inside' ? 'Dhaka' : 'Suburbs/Out'}):</span>
                <span>{receiptOrder.shippingFee === 0 ? 'FREE' : formatBDT(receiptOrder.shippingFee)}</span>
              </div>
            </div>

            <div className="text-center font-bold tracking-tight text-slate-950 select-none">
              ================================
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline py-1 text-sm font-black text-slate-950">
              <span className="tracking-wider">TOTAL BILL:</span>
              <span className="text-base">{formatBDT(receiptOrder.totalAmount)}</span>
            </div>

            <div className="text-center font-bold tracking-tight text-slate-950 select-none">
              ================================
            </div>

            {/* Due vs Paid indicator */}
            <div className="py-1.5 text-center font-bold text-xs uppercase">
              {receiptOrder.paymentMethod === 'COD' ? (
                <div className="p-1.5 border-2 border-black tracking-wider">
                  &gt;&gt;&gt; CASH TO COLLECT: {formatBDT(receiptOrder.totalAmount)} &lt;&lt;&lt;
                </div>
              ) : (
                <div className="p-1 border border-black text-[11px] tracking-wide">
                  PAID IN ADVANCE VIA {receiptOrder.paymentMethod.toUpperCase()} (COLLECT: ৳0)
                </div>
              )}
            </div>

            <div className="text-center font-bold tracking-tight text-slate-950 select-none">
              ================================
            </div>

            {/* Visual Barcode Simulation */}
            <div className="my-2.5 flex flex-col items-center">
              <svg className="w-48 h-8 opacity-90" viewBox="0 0 160 30" preserveAspectRatio="none">
                <rect x="0" y="0" width="3" height="30" fill="black" />
                <rect x="5" y="0" width="1" height="30" fill="black" />
                <rect x="8" y="0" width="4" height="30" fill="black" />
                <rect x="15" y="0" width="2" height="30" fill="black" />
                <rect x="19" y="0" width="5" height="30" fill="black" />
                <rect x="27" y="0" width="2" height="30" fill="black" />
                <rect x="31" y="0" width="1" height="30" fill="black" />
                <rect x="34" y="0" width="3" height="30" fill="black" />
                <rect x="40" y="0" width="4" height="30" fill="black" />
                <rect x="46" y="0" width="2" height="30" fill="black" />
                <rect x="51" y="0" width="5" height="30" fill="black" />
                <rect x="58" y="0" width="1" height="30" fill="black" />
                <rect x="62" y="0" width="3" height="30" fill="black" />
                <rect x="67" y="0" width="4" height="30" fill="black" />
                <rect x="74" y="0" width="2" height="30" fill="black" />
                <rect x="78" y="0" width="1" height="30" fill="black" />
                <rect x="82" y="0" width="5" height="30" fill="black" />
                <rect x="90" y="0" width="3" height="30" fill="black" />
                <rect x="95" y="0" width="2" height="30" fill="black" />
                <rect x="100" y="0" width="4" height="30" fill="black" />
                <rect x="107" y="0" width="2" height="30" fill="black" />
                <rect x="111" y="0" width="5" height="30" fill="black" />
                <rect x="119" y="0" width="2" height="30" fill="black" />
                <rect x="123" y="0" width="3" height="30" fill="black" />
                <rect x="128" y="0" width="1" height="30" fill="black" />
                <rect x="132" y="0" width="4" height="30" fill="black" />
                <rect x="138" y="0" width="2" height="30" fill="black" />
                <rect x="143" y="0" width="5" height="30" fill="black" />
                <rect x="151" y="0" width="2" height="30" fill="black" />
                <rect x="155" y="0" width="3" height="30" fill="black" />
              </svg>
              <span className="font-mono text-[10px] tracking-[0.2em] font-bold mt-0.5">
                *{receiptOrder.orderNumber}*
              </span>
            </div>

            {/* Thermal Footer */}
            <div className="text-center space-y-1 pt-1 text-[10px] text-slate-700">
              <div className="font-bold uppercase tracking-wider">
                * THANK YOU FOR CHOOSING ÉCLAT DE ROSE *
              </div>
              <div>100% French & Grasse Artisanal Parfums</div>
              <div>Please inspect packaging before receiving</div>
              <div>Exchange within 7 days with this slip</div>
              <div className="pt-2 text-slate-400 font-bold select-none text-[9px]">
                - - - - - - - [ TEAR HERE ] - - - - - - -
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
