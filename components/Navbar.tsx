"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, LogOut, Smartphone, Menu, X, Sparkles } from "lucide-react";
import { useAuthStore, useCartStore } from "@/lib/stores";
import { useToastStore } from "./Toast";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, checkSession, initialized } = useAuthStore();
  const { getCartCount } = useCartStore();
  const { addToast } = useToastStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogout = async () => {
    await logout();
    addToast("Kijelentkezve sikeresen", "info");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Főoldal", href: "/" },
    { name: "Katalógus", href: "/catalog" },
    ...(user ? [{ name: "Rendeléseim", href: "/orders" }] : []),
  ];

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-primary hover:opacity-90 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-accent bg-clip-text text-transparent font-black">
            Phonix
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-extrabold uppercase tracking-wider transition-all hover:text-primary ${
                  isActive ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 text-muted-foreground hover:text-primary transition-all hover:scale-105 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-background animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          <span className="h-4 w-[1px] bg-border/60" />

          {/* User Section */}
          {initialized ? (
            user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-foreground bg-muted/35 border px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black border">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">Szia, {user.name.split(" ")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-red-200/40 text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Kilépés
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-muted transition-all"
                >
                  Belépés
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-extrabold uppercase tracking-wider bg-primary text-primary-foreground px-4.5 py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Regisztráció
                </Link>
              </div>
            )
          ) : (
            <div className="w-24 h-8 animate-pulse bg-muted rounded-xl" />
          )}
        </div>

        {/* Mobile Actions & Trigger */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-extrabold px-3 py-2.5 rounded-xl transition-all ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <hr className="border-border" />

          {/* Mobile User Section */}
          {initialized ? (
            user ? (
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-sm font-extrabold py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Kijelentkezés
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-border text-xs font-extrabold uppercase tracking-wider hover:bg-muted transition-colors"
                >
                  Belépés
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Regisztráció
                </Link>
              </div>
            )
          ) : (
            <div className="h-10 w-full animate-pulse bg-muted rounded-xl" />
          )}
        </div>
      )}
    </header>
  );
}
