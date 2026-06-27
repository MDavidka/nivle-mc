"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle, Package, Truck } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { formatPrice } from "@/lib/utils";
import { useToastStore } from "@/components/Toast";

export default function OrdersPage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const { addToast } = useToastStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication guard
  useEffect(() => {
    if (initialized && !user) {
      addToast("Please sign in to view your orders", "error");
      router.push("/login?redirect=/orders");
    }
  }, [user, initialized, router, addToast]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("Orders fetch error:", err);
        setError(err.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!initialized || (user && loading)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading your order history...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" />
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track shipping progress and view past smartphone receipts.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Shop More Phones
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Display Fetch Errors */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-700 dark:text-red-300 font-semibold">
          Error: {error}
        </div>
      )}

      {/* Orders List / Empty State */}
      {!loading && orders.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-xl space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-foreground">No Orders Placed Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              You haven't purchased any smartphones yet. When you place an order, it will appear here.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            Browse Smartphone Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div key={order._id || order.id} className="border bg-card rounded-xl overflow-hidden shadow-sm">
                {/* Order Header Info */}
                <div className="bg-muted/40 p-4 sm:p-5 border-b flex flex-col sm:flex-row gap-4 justify-between sm:items-center text-xs">
                  <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-y-2">
                    <div>
                      <p className="text-muted-foreground font-bold uppercase tracking-wider">Date Placed</p>
                      <p className="text-foreground font-extrabold mt-0.5">{date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-bold uppercase tracking-wider">Total Amount</p>
                      <p className="text-primary font-black mt-0.5 text-sm">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-bold uppercase tracking-wider">Order Reference</p>
                      <p className="text-foreground font-extrabold mt-0.5 truncate max-w-[120px]">
                        {order._id || order.id}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900"
                          : order.status === "Shipped"
                          ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900"
                          : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900"
                      }`}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : order.status === "Shipped" ? (
                        <Truck className="w-3.5 h-3.5" />
                      ) : (
                        <Package className="w-3.5 h-3.5" />
                      )}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Body (Items Grid) */}
                <div className="p-4 sm:p-6 divide-y space-y-4">
                  <div className="space-y-4 pb-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg border bg-muted shrink-0"
                          />
                          <div>
                            <p className="font-bold text-sm text-foreground">{item.name}</p>
                            <div className="flex gap-2 mt-0.5 text-xs text-muted-foreground font-semibold">
                              <span>Color: {item.color}</span>
                              <span>·</span>
                              <span>Storage: {item.storage}</span>
                              <span>·</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="pt-4 text-xs font-semibold text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-start">
                    <div>
                      <p className="text-foreground font-bold uppercase tracking-wider mb-1">Shipping Destination</p>
                      <p className="text-foreground font-extrabold text-sm">{order.shippingAddress.fullName}</p>
                      <p className="font-medium mt-0.5">{order.shippingAddress.address}</p>
                      <p className="font-medium">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>

                    <div className="text-right mt-4 sm:mt-0">
                      <p className="text-foreground font-bold uppercase tracking-wider mb-1">Payment Information</p>
                      <p className="font-medium text-foreground">Method: {order.paymentMethod || "Credit Card"}</p>
                      {order.paymentDetails?.lastFour && (
                        <p className="font-medium">Card ending in •••• {order.paymentDetails.lastFour}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security Disclaimer */}
      <div className="border border-dashed p-4 rounded-xl flex items-center gap-3 bg-muted/20 text-xs text-muted-foreground">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
        <p className="font-semibold">
          Your order history is securely stored in MongoDB and indexed by user sessions. If you sign out, this history remains safe and will reappear the next time you log in.
        </p>
      </div>
    </div>
  );
}
