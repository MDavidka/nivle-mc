"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/stores";
import { formatPrice } from "@/lib/utils";
import { useToastStore } from "@/components/Toast";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal, getCartCount } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const estimatedTax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + estimatedTax;

  const handleQuantityChange = (
    productId: string,
    color: string,
    storage: string,
    currentQty: number,
    increment: boolean
  ) => {
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    updateQuantity(productId, color, storage, newQty);
  };

  const handleRemoveItem = (productId: string, color: string, storage: string, name: string) => {
    removeItem(productId, color, storage);
    addToast(`Removed ${name} from your cart`, "info");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-foreground">Your Shopping Cart is Empty</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Before you can checkout, you must add some premium smartphones to your cart.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your items and proceed to secure checkout.
        </p>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="divide-y">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  {/* Product Details */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border bg-muted shrink-0"
                    />
                    <div>
                      <Link
                        href={`/product/${item.product.id}`}
                        className="font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground font-semibold">
                        <span>Color: {item.selectedColor}</span>
                        <span className="text-border">|</span>
                        <span>Storage: {item.selectedStorage}</span>
                      </div>
                      <span className="block text-sm font-extrabold text-foreground mt-2">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Quantity and Delete) */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t pt-3 sm:pt-0 sm:border-t-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.selectedColor,
                            item.selectedStorage,
                            item.quantity,
                            false
                          )
                        }
                        className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold text-foreground min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.selectedColor,
                            item.selectedStorage,
                            item.quantity,
                            true
                          )
                        }
                        className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-extrabold text-foreground min-w-[70px] text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveItem(
                            item.product.id,
                            item.selectedColor,
                            item.selectedStorage,
                            item.product.name
                          )
                        }
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Add more items
          </Link>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-4">
          <div className="border rounded-xl bg-card p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-foreground border-b pb-3">Order Summary</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Subtotal</span>
                <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Shipping</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Estimated Tax (8%)</span>
                <span className="font-bold text-foreground">{formatPrice(estimatedTax)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-extrabold text-foreground">Total</span>
                <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Action Checkout CTA */}
            {user ? (
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-primary/10 text-center text-sm"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login?redirect=/checkout"
                  className="w-full flex items-center justify-center bg-accent text-accent-foreground font-bold py-3.5 rounded-xl hover:bg-accent/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-accent/10 text-center text-sm"
                >
                  Sign In to Checkout
                </Link>
                <p className="text-[10px] text-center text-muted-foreground font-semibold">
                  A valid user session is required to record your order in MongoDB.
                </p>
              </div>
            )}
          </div>

          {/* Guarantee Badge */}
          <div className="border border-dashed border-border p-4 rounded-xl flex items-start gap-3 bg-muted/20">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-foreground">Secure Checkout Guarantee</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                Your credentials and transactions are fully encrypted. Orders are recorded in a secure MongoDB cluster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
