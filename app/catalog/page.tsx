"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from "lucide-react";
import { PRODUCTS, Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters
  const initialBrand = searchParams.get("brand") || "All";
  const initialFeatured = searchParams.get("featured") === "true";
  const initialSearch = searchParams.get("search") || "";

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [brand, setBrand] = useState(initialBrand);
  const [featured, setFeatured] = useState(initialFeatured);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState("popular");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available brands in database
  const brands = ["All", "Apple", "Samsung", "Google", "OnePlus", "Nothing", "Xiaomi"];

  // Sync state with URL changes
  useEffect(() => {
    setBrand(searchParams.get("brand") || "All");
    setFeatured(searchParams.get("featured") === "true");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Handle filter logic
  useEffect(() => {
    let result = [...PRODUCTS];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (brand !== "All") {
      result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Featured filter
    if (featured) {
      result = result.filter((p) => p.featured);
    }

    // Price range filter
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [search, brand, featured, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setBrand("All");
    setFeatured(false);
    setMaxPrice(1500);
    setSortBy("popular");
    router.push("/catalog");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Smartphone Catalog</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore our collection of the latest and greatest mobile devices.
        </p>
      </div>

      {/* Control Bar (Search & Sort) */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-card border p-4 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search phones, brands, specs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="popular">Sort by: Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout (Sidebar Filters + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-card border p-6 rounded-xl space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Filters
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Brand</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    brand.toLowerCase() === b.toLowerCase()
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">Max Price</h3>
              <span className="text-xs font-bold text-primary">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
              <span>$500</span>
              <span>$1,000</span>
              <span>$1,500</span>
            </div>
          </div>

          <hr className="border-border" />

          {/* Quick Toggles */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Status</h3>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span>Featured Deals Only</span>
            </label>
          </div>
        </aside>

        {/* Mobile Filters Drawer (Modal overlay) */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex justify-end">
            <div className="bg-background w-full max-w-xs h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="space-y-6 overflow-y-auto flex-grow pr-2">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Brand Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-foreground">Brand</h3>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBrand(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          brand.toLowerCase() === b.toLowerCase()
                            ? "bg-primary border-primary text-primary-foreground shadow-sm"
                            : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-border" />

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-foreground">Max Price</h3>
                    <span className="text-xs font-bold text-primary">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                    <span>$500</span>
                    <span>$1,000</span>
                    <span>$1,500</span>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Quick Toggles */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-foreground">Status</h3>
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span>Featured Deals Only</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-4 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 border rounded-lg text-sm font-semibold hover:bg-muted transition-colors text-center"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors text-center shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active filter tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">Active:</span>
            {brand !== "All" && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
                Brand: {brand}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-primary/80" onClick={() => setBrand("All")} />
              </span>
            )}
            {featured && (
              <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full border border-accent/20">
                Featured Deals
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-accent/80" onClick={() => setFeatured(false)} />
              </span>
            )}
            {maxPrice < 1500 && (
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                Max: ${maxPrice}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-500/80" onClick={() => setMaxPrice(1500)} />
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                Search: "{search}"
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-amber-500/80" onClick={() => setSearch("")} />
              </span>
            )}
            {brand === "All" && !featured && maxPrice === 1500 && !search && (
              <span className="text-xs text-muted-foreground italic font-medium">All Phones</span>
            )}
          </div>

          {/* Results Count */}
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "smartphone" : "smartphones"}
          </p>

          {/* Results Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border rounded-xl space-y-4 shadow-sm">
              <span className="text-5xl block">📱</span>
              <h3 className="font-extrabold text-lg text-foreground">No Smartphones Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We couldn't find any phones matching your filters. Try adjusting your price range or search terms.
              </p>
              <button
                onClick={resetFilters}
                className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading smartphone catalog...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
