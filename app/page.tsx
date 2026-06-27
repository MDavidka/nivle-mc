"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Zap, Smartphone, ShieldCheck, Truck, RefreshCw, Layers } from "lucide-react";
import { PRODUCTS, Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/stores";
import { useToastStore } from "@/components/Toast";

export default function HomePage() {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  // Get featured products
  const featuredProducts = PRODUCTS.filter((p) => p.featured);

  // Customizer Demo States
  const demoModels = PRODUCTS.filter((p) => ["iphone-15-pro-max", "galaxy-s24-ultra", "pixel-8-pro"].includes(p.id));
  const [selectedModel, setSelectedModel] = useState<Product>(demoModels[0]);
  const [selectedColor, setSelectedColor] = useState(demoModels[0].colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(demoModels[0].storage[0]);

  // Handle Model Change in Customizer
  const handleModelChange = (modelId: string) => {
    const model = demoModels.find((m) => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setSelectedColor(model.colors[0]);
      setSelectedStorage(model.storage[0]);
    }
  };

  // Calculate dynamic price based on storage selection
  const getDynamicPrice = () => {
    let basePrice = selectedModel.price;
    const storageIdx = selectedModel.storage.indexOf(selectedStorage);
    // Add $100 for each storage tier upgrade
    return basePrice + (storageIdx > 0 ? storageIdx * 100 : 0);
  };

  const handleCustomizerAddToCart = () => {
    const customProduct = {
      ...selectedModel,
      price: getDynamicPrice(), // Apply storage tier pricing
    };
    addItem(customProduct, selectedColor, selectedStorage);
    addToast(
      `Hozzáadva: ${customProduct.name} (${selectedStorage}, ${selectedColor}) - ${formatPrice(getDynamicPrice())}!`,
      "success"
    );
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 lg:py-32">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[600px] h-[600px] rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text (7 cols on desktop) */}
          <div className="space-y-8 text-center lg:text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-current animate-pulse" />
              <span>A jövő okostelefon boltja</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">
              Vásárold meg a legújabb{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
                csúcskategóriás
              </span>{" "}
              telefonokat élesben.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Fedezd fel a prémium iPhone, Samsung Galaxy és Google Pixel készülékeket. Biztonságos MongoDB adatbázissal, JWT hitelesítéssel és azonnali kiszállítással.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-extrabold text-sm uppercase tracking-wider px-7 py-4 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Katalógus böngészése
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#customizer"
                className="inline-flex items-center justify-center bg-slate-900 border border-slate-800 text-white font-extrabold text-sm uppercase tracking-wider px-7 py-4 rounded-xl hover:bg-slate-800 transition-all"
              >
                Készülék testreszabása
              </a>
            </div>
          </div>

          {/* Hero Render Mockup (5 cols on desktop) */}
          <div className="relative flex justify-center lg:justify-end lg:col-span-5">
            <div className="relative w-full max-w-[340px] aspect-[9/19] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/5 rounded-[40px] p-3.5 shadow-[0_0_80px_rgba(59,130,246,0.25)] flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              
              {/* Fake status bar */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 px-3 font-bold">
                <span>09:41</span>
                <div className="w-20 h-4 bg-black rounded-full" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-5 h-2.5 bg-slate-500 rounded-sm" />
                </div>
              </div>

              {/* Central phone render */}
              <div className="my-auto flex flex-col items-center text-center space-y-4 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80"
                  alt="iPhone 15 Pro Max"
                  className="w-44 h-44 object-contain drop-shadow-[0_20px_35px_rgba(59,130,246,0.35)]"
                />
                <div>
                  <h3 className="font-extrabold text-base text-white">iPhone 15 Pro Max</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-wider mt-0.5">Szuper Áron</p>
                </div>
              </div>

              {/* Live popup notification */}
              <div className="bg-slate-900/90 border border-white/5 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">Ajánlat</p>
                  <p className="text-xs font-bold text-white mt-0.5">Spórolj $100-t ma!</p>
                </div>
                <Link
                  href="/product/iphone-15-pro-max"
                  className="bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-2 rounded-lg hover:bg-primary/95 transition-all"
                >
                  Megnézem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Válassz Márka Szerint</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Válogass a világ legelismertebb prémium okostelefon gyártói közül.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Apple", logo: "🍎", count: PRODUCTS.filter((p) => p.brand === "Apple").length },
            { name: "Samsung", logo: "🪐", count: PRODUCTS.filter((p) => p.brand === "Samsung").length },
            { name: "Google", logo: "🔍", count: PRODUCTS.filter((p) => p.brand === "Google").length },
            { name: "OnePlus", logo: "➕", count: PRODUCTS.filter((p) => p.brand === "OnePlus").length },
          ].map((brand) => (
            <Link
              key={brand.name}
              href={`/catalog?brand=${brand.name}`}
              className="group flex flex-col items-center justify-center p-6 bg-card border rounded-2xl hover:border-primary hover:shadow-md transition-all duration-300 text-center"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {brand.logo}
              </span>
              <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                {brand.count} {brand.count === 1 ? "Modell" : "Modell"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE TRY-IT CUSTOMIZER DEMO (2026 Standard) */}
      <section id="customizer" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Subtle details */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Phone Visual (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/20 border border-dashed rounded-2xl p-8 aspect-square relative">
            <div className="absolute top-4 left-4 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Interaktív 3D Demo
            </div>
            
            <img
              src={selectedModel.image}
              alt={selectedModel.name}
              className="w-56 h-56 object-contain drop-shadow-[0_25px_40px_rgba(var(--primary),0.3)] transition-all duration-500 transform hover:scale-105"
            />

            <div className="mt-6 text-center">
              <span className="text-2xl font-black text-foreground">
                {formatPrice(getDynamicPrice())}
              </span>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">
                Összeállításod ára
              </p>
            </div>
          </div>

          {/* Right Column: Customizer Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Tervezőstúdió</span>
              <h2 className="text-3xl font-black text-foreground tracking-tight">Szabd Testre A Telefonod!</h2>
              <p className="text-sm text-muted-foreground">
                Válaszd ki a modellt, a tárhelyet és a színt. Az árak és specifikációk azonnal frissülnek!
              </p>
            </div>

            {/* Model Select */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">1. Válassz Modellt</h4>
              <div className="grid grid-cols-3 gap-2.5">
                {demoModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleModelChange(m.id)}
                    className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between h-20 ${
                      selectedModel.id === m.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="text-xs font-black text-foreground line-clamp-1">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground font-bold">Alapár: {formatPrice(m.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Select */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">2. Válassz Színt: <span className="text-muted-foreground font-normal">{selectedColor}</span></h4>
              <div className="flex flex-wrap gap-2">
                {selectedModel.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                      selectedColor === color
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Select */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">3. Válassz Tárhelyet: <span className="text-muted-foreground font-normal">{selectedStorage}</span></h4>
              <div className="grid grid-cols-3 gap-2.5">
                {selectedModel.storage.map((storage, idx) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between ${
                      selectedStorage === storage
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="text-xs font-extrabold text-foreground">{storage}</span>
                    <span className="text-[10px] text-muted-foreground font-bold">
                      {idx === 0 ? "Alapméret" : `+${formatPrice(idx * 100)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA action */}
            <div className="pt-4 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground font-bold">Végösszeg:</p>
                <span className="text-2xl font-black text-foreground">{formatPrice(getDynamicPrice())}</span>
              </div>
              <button
                onClick={handleCustomizerAddToCart}
                className="w-full sm:w-auto bg-primary text-primary-foreground font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all"
              >
                Egyedi telefon kosárba tétele
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-black text-foreground tracking-tight">Kiemelt Akcióink</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Válogass a legújabb, mesterséges intelligenciával felszerelt csúcsmodellekből.
            </p>
          </div>
          <Link
            href="/catalog?featured=true"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors self-center sm:self-auto"
          >
            Összes kiemelt megtekintése
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

      {/* 5. Promo Deal Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl text-white p-8 sm:p-14 shadow-xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3.5 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
              Limitált idejű ajánlat
            </span>
            <h2 className="text-3xl sm:text-5xl font-black leading-none tracking-tighter">
              Vásárolj Galaxy S24 Ultra-t és ajándék fülhallgatót kapsz!
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">
              Rendeld meg a Samsung Galaxy S24 Ultra készüléket ma, és automatikusan egy ingyenes Galaxy Buds Pro 2-t adunk mellé, valamint 2 év kiterjesztett garanciát!
            </p>
            <div className="pt-4">
              <Link
                href="/product/galaxy-s24-ultra"
                className="inline-flex items-center justify-center bg-white text-indigo-700 font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-md hover:bg-indigo-50 transition-all hover:scale-105"
              >
                Kérem az ajánlatot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Mit Mondanak Vásárlóink?</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
            Több mint 5,000+ elégedett vásárló világszerte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Jenkins Sára",
              role: "Technológiai szakértő",
              comment: "Az iPhone 15 Pro Max mindössze 24 óra alatt megérkezett hozzám. A csomagolás makulátlan volt, a 2 év garancia pedig óriási biztonságot ad. Szuper bolt!",
              rating: 5,
            },
            {
              name: "Chen Márk",
              role: "Mobilfotós",
              comment: "A Google Pixel 8 Pro-t rendeltem meg tőlük. A vásárlási folyamat elképesztően egyszerű volt, és az áruk lényegesen jobb, mint a szolgáltatóknál.",
              rating: 5,
            },
            {
              name: "Rostova Elena",
              role: "Üzleti tanácsadó",
              comment: "Kicsit tartottam az online vásárlástól, de a Phonix felülmúlta a várakozásaimat. A MongoDB-alapú bejelentkezés és a fizetés rendkívül gyors volt, a telefonom pedig zseniális.",
              rating: 5,
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-card border p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic font-medium">"{t.comment}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
