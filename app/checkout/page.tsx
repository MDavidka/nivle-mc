"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, ShieldCheck, ArrowLeft, ShoppingBag, CheckCircle2, ShoppingCart } from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/stores";
import { formatPrice } from "@/lib/utils";
import { useToastStore } from "@/components/Toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, initialized } = useAuthStore();
  const { addToast } = useToastStore();

  // Guard redirects
  useEffect(() => {
    if (initialized && !user) {
      addToast("You must be logged in to check out.", "error");
      router.push("/login?redirect=/checkout");
    }
  }, [user, initialized, router, addToast]);

  // Pricing calculations
  const subtotal = getCartTotal();
  const shipping = 0;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  // Redirect if cart is empty (and user is logged in, meaning checkout isn't finished yet)
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrder, setPlacedPlacedOrder] = useState<any>(null);

  useEffect(() => {
    if (items.length === 0 && !isSuccess && initialized && user) {
      router.push("/cart");
    }
  }, [items, isSuccess, initialized, user, router]);

  // Form states
  const [fullName, setFullName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");

  // Payment mock states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Auto-fill user name once loaded
  useEffect(() => {
    if (user && !fullName) {
      setFullName(user.name);
    }
  }, [user, fullName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !address || !city || !state || !zipCode) {
      addToast("Please fill in all shipping details", "error");
      return;
    }

    if (!cardNumber || !expiry || !cvc) {
      addToast("Please complete payment card details", "error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            brand: item.product.brand,
            image: item.product.image,
            price: item.product.price,
            color: item.selectedColor,
            storage: item.selectedStorage,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName,
            address,
            city,
            state,
            zipCode,
            country,
          },
          paymentDetails: {
            method: "Credit Card",
            lastFour: cardNumber.slice(-4) || "4242",
          },
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setPlacedPlacedOrder(data.order);
      setIsSuccess(true);
      clearCart();
      addToast("Order placed successfully!", "success");
    } catch (error: any) {
      addToast(error.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Format Card Number (adds spaces)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  if (!initialized || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Verifying checkout session...</p>
      </div>
    );
  }

  // Celebration Success Screen
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl space-y-8">
        <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
          <CheckCircle2 className="w-14 h-14" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Order Placed Successfully!</h1>
          <p className="text-sm text-muted-foreground font-semibold max-w-md mx-auto leading-relaxed">
            Thank you for your purchase! Your smartphone order has been recorded in our MongoDB cluster. A receipt has been sent to <strong>{user.email}</strong>.
          </p>
        </div>

        {placedOrder && (
          <div className="bg-card border p-6 rounded-xl text-left space-y-4 shadow-sm">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase border-b pb-3">
              <span>Order ID: {placedOrder._id || placedOrder.id}</span>
              <span>Status: {placedOrder.status}</span>
            </div>
            <div className="space-y-2 text-sm font-semibold">
              <p className="text-foreground">Deliver to:</p>
              <div className="text-muted-foreground font-medium text-xs leading-relaxed">
                <p className="font-bold text-foreground">{placedOrder.shippingAddress.fullName}</p>
                <p>{placedOrder.shippingAddress.address}</p>
                <p>
                  {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.zipCode}
                </p>
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-muted-foreground">Total Charged:</span>
              <span className="text-lg font-black text-primary">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="bg-primary text-primary-foreground font-bold px-6 py-3.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            Track Order History
          </Link>
          <Link
            href="/catalog"
            className="bg-muted text-foreground border font-bold px-6 py-3.5 rounded-lg hover:bg-muted/80 transition-all"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Cart Link */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Shipping Address */}
          <div className="border rounded-xl bg-card p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2 border-b pb-3">
              <MapPin className="w-5 h-5 text-primary" />
              1. Shipping Address
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Recipient Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                  required
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label htmlFor="address" className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="123 Smartphone Blvd, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                  required
                />
              </div>

              {/* Grid of City, State, Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs font-bold text-foreground uppercase tracking-wider">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="San Jose"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="state" className="text-xs font-bold text-foreground uppercase tracking-wider">
                    State / Region
                  </label>
                  <input
                    id="state"
                    type="text"
                    placeholder="CA"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="zipCode" className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Postal Code
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    placeholder="95112"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Secure Mock Payment */}
          <div className="border rounded-xl bg-card p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2 border-b pb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              2. Secured Mock Payment
            </h2>

            <div className="space-y-4">
              {/* Card Number */}
              <div className="space-y-1.5">
                <label htmlFor="cardNumber" className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  maxLength={19}
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                  required
                />
              </div>

              {/* Grid of Expiry, CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="expiry" className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Expiration Date
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-center"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="cvc" className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Security Code (CVC)
                  </label>
                  <input
                    id="cvc"
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-center"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="space-y-4">
          <div className="border rounded-xl bg-card p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-foreground border-b pb-3">Checkout Summary</h2>

            {/* Cart Items Quick List */}
            <div className="max-h-40 overflow-y-auto divide-y pr-2 space-y-2.5">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-2.5 first:pt-0 items-center justify-between text-xs">
                  <div className="flex gap-2.5 items-center">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded border" />
                    <div>
                      <p className="font-bold text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-muted-foreground font-semibold">
                        Qty: {item.quantity} · {item.selectedStorage}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-border" />

            {/* Price breakdown */}
            <div className="space-y-3 text-xs font-semibold text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-foreground font-bold">{formatPrice(estimatedTax)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-extrabold text-foreground">Total Charge</span>
                <span className="text-xl font-black text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>
                  Place Order — {formatPrice(total)}
                </>
              )}
            </button>
          </div>

          {/* Secure details */}
          <div className="border border-dashed p-4 rounded-xl flex items-start gap-3 bg-muted/20">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-foreground">MongoDB Cluster Integration</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                By completing this order, your shipping address and purchased item arrays are serialized and saved securely in your MongoDB collection.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
