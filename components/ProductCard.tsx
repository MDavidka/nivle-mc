"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/stores";
import { useToastStore } from "./Toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const discount = product.originalPrice - product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Choose default first color and storage
    const defaultColor = product.colors[0];
    const defaultStorage = product.storage[0];
    
    addItem(product, defaultColor, defaultStorage);
    addToast(`Kosárba téve: ${product.name} (${defaultStorage}, ${defaultColor})!`, "success");
  };

  return (
    <div className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm">
          -{formatPrice(discount)} Kedvezmény
        </span>
      )}

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950/20">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full p-8 transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-slate-900 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-lg text-[10px] font-black">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-extrabold text-base text-foreground tracking-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-semibold flex-grow">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/40">
          <div>
            <span className="text-lg font-black text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through ml-2 font-bold">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/95 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/10"
            title="Kosárba teszem"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
