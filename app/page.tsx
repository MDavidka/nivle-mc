"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, ShieldCheck, Truck, RefreshCw, Star, Zap } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  // Get featured products
  const featuredProducts = PRODUCTS.filter((p) => p.featured);

  // Popular brands with icons
  const brands = [
    { name: "Apple", logo: "🍎", count: PRODUCTS.filter((p) => p.brand === "Apple").length },
    { name: "Samsung", logo: "🪐", count: PRODUCTS.filter((p) => p.brand === "Samsung").length },
    { name: "Google", logo: "🔍", count: PRODUCTS.filter((p) => p.brand === "Google").length },
    { name: "OnePlus", logo: "➕", count: PRODUCTS.filter((p) => p.brand === "OnePlus").length },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-24">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[500px] h-[500px] rounded-full bg-primary/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Next-Gen Smartphone Store</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              The Ultimate Way to Buy Your{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
                Next Phone
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Discover the latest iPhones, Samsung Galaxy flagships, Google Pixels, and OnePlus devices. Fast delivery, 2-year warranty, and secure checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all"
              >
                Browse Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog?featured=true"
                className="inline-flex items-center justify-center bg-slate-900 border border-slate-800 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                View Featured Deals
              </Link>
            </div>
          </div>

          {/* Hero Image / Graphic Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] aspect-[4/5] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              
              {/* Fake status bar */}
              <div className="flex justify-between items-center text-xs text-slate-500 px-2">
                <span>9:41</span>
                <div className="w-16 h-4 bg-black rounded-full" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-5 h-2.5 bg-slate-500 rounded-sm" />
                </div>
              </div>

              {/* Central device render */}
              <div className="my-auto flex flex-col items-center text-center space-y-4 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80"
                  alt="iPhone 15 Pro Max"
                  className="w-48 h-48 object-contain drop-shadow-[0_25px_25px_rgba(59,130,246,0.35)]"
                />
                <div>
                  <h3 className="font-bold text-lg text-white">iPhone 15 Pro Max</h3>
                  <p className="text-xs text-primary font-semibold mt-0.5">Starting from $1,199</p>
                </div>
              </div>

              {/* CTA card */}
              <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Deal of the Day</p>
                  <p className="text-xs font-bold text-white mt-0.5">Save $100 on checkout</p>
                </div>
                <Link
                  href="/product/iphone-15-pro-max"
                  className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Shop by Brand
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose from your favorite premium smartphone makers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/catalog?brand=${brand.name}`}
              className="group flex flex-col items-center justify-center p-6 bg-card border rounded-xl hover:border-primary hover:shadow-sm transition-all duration-300 text-center"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {brand.logo}
              </span>
              <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {brand.count} {brand.count === 1 ? "Model" : "Models"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Featured Flagships
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top-rated smartphones loaded with next-generation AI and camera capabilities.
            </p>
          </div>
          <Link
            href="/catalog?featured=true"
            className="inline-flex items-center justify-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors self-center sm:self-auto"
          >
            View All Featured
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Promo Deal Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-lg space-y-4">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
              Limited Time Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Upgrade to Galaxy S24 Ultra & Get Free Galaxy Buds!
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Order the Samsung Galaxy S24 Ultra today and receive free Galaxy Buds Pro 2 + standard 2-year warranty automatically. Offer ends this Sunday.
            </p>
            <div className="pt-2">
              <Link
                href="/product/galaxy-s24-ultra"
                className="inline-flex items-center justify-center bg-white text-indigo-700 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-50 transition-colors"
              >
                Claim This Deal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Over 5,000+ happy smartphone upgrades worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Jenkins",
              role: "Tech Enthusiast",
              comment: "The iPhone 15 Pro Max arrived in just 24 hours. The packaging was pristine, and the standard 2-year warranty gives me peace of mind. Exceptional customer service!",
              rating: 5,
            },
            {
              name: "Marcus Chen",
              role: "Mobile Photographer",
              comment: "Upgraded to the Google Pixel 8 Pro. Phonix provided the best checkout experience, and the price was $100 cheaper than major carriers. Will definitely buy here again.",
              rating: 5,
            },
            {
              name: "Elena Rostova",
              role: "Business Consultant",
              comment: "I was hesitant about buying online, but Phonix surpassed all expectations. The MongoDB auth and checkout process was extremely smooth, and my S24 Ultra is amazing.",
              rating: 5,
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-card border p-6 rounded-xl flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.comment}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
