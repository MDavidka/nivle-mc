"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Star, ShoppingCart, ArrowLeft, Shield, Truck, RefreshCw, Layers } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/stores";
import { useToastStore } from "@/components/Toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const productId = params.id as string;
  const product = PRODUCTS.find((p) => p.id === productId);

  // Fallback if product is not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-6xl block">⚠️</span>
        <h1 className="text-2xl font-bold text-foreground">Smartphone Not Found</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          The smartphone you are looking for does not exist or has been discontinued.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Gallery state
  const [activeImage, setActiveImage] = useState(product.images[0] || product.image);

  // Choice states
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedStorage);
    addToast(
      `Added ${product.name} (${selectedStorage}, ${selectedColor}) to your cart!`,
      "success"
    );
  };

  const discount = product.originalPrice - product.price;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>

      {/* Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-card border rounded-2xl overflow-hidden relative shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                Save {formatPrice(discount)}
              </span>
            )}
          </div>

          {/* Thumbnails (Only show if there are multiple images) */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 aspect-square rounded-lg overflow-hidden border bg-card shrink-0 transition-all ${
                    activeImage === img ? "border-primary ring-2 ring-primary/10" : "border-border hover:border-slate-400"
                  }`}
                >
                  <img src={img} alt={`${product.name} gallery ${idx}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Config & Details */}
        <div className="space-y-6">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1">
                {product.name}
              </h1>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-md text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1 font-medium">
                {product.reviewsCount} reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-red-500 bg-red-500/5 px-2 py-0.5 rounded-md">
                  {Math.round((discount / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Select Color: <span className="text-muted-foreground font-normal">{selectedColor}</span></h3>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                    selectedColor === color
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                      : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Select Storage: <span className="text-muted-foreground font-normal">{selectedStorage}</span></h3>
            <div className="flex flex-wrap gap-2.5">
              {product.storage.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                    selectedStorage === storage
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                      : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="pt-4 border-t">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart — {formatPrice(product.price)}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center">
              <Truck className="w-5 h-5 text-primary mb-1" />
              <span className="text-[10px] font-bold text-foreground">Free Shipping</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center">
              <Shield className="w-5 h-5 text-accent mb-1" />
              <span className="text-[10px] font-bold text-foreground">2-Yr Warranty</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-[10px] font-bold text-foreground">30-Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <section className="bg-card border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 border-b pb-4">
          <Layers className="w-5 h-5 text-primary" />
          Technical Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {[
            { label: "Display", value: product.specs.screen },
            { label: "Processor", value: product.specs.processor },
            { label: "RAM / Memory", value: product.specs.ram },
            { label: "Camera System", value: product.specs.camera },
            { label: "Battery & Charging", value: product.specs.battery },
            { label: "Operating System", value: product.specs.os },
            { label: "Device Weight", value: product.specs.weight },
            { label: "Stock Availability", value: `${product.stock} units available` },
          ].map((spec, idx) => (
            <div key={idx} className="flex justify-between items-center py-2.5 border-b border-dashed text-sm">
              <span className="font-semibold text-muted-foreground">{spec.label}</span>
              <span className="font-bold text-foreground text-right ml-4">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
