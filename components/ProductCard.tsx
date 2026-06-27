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
    addToast(`Added ${product.name} (${defaultStorage}, ${defaultColor}) to cart!`, "success");
  };

  return (
    <div className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
          Save {formatPrice(discount)}
        </span>
      )}

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <span className="bg-white text-slate-900 p-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-md text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-bold text-base text-foreground line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t">
          <div>
            <span className="text-lg font-extrabold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Quick Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
