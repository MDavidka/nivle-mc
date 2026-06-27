import React from "react";
import Link from "next/link";
import { Smartphone, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Brand features / perks */}
      <div className="border-b border-slate-800 bg-slate-950/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 px-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all orders over $500, delivered in 1-2 business days.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 px-4">
            <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">2-Year Full Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Standard 2-year warranty on all brand new smartphones.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 px-4">
            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Not satisfied? Return your device within 30 days for a full refund.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer contents */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
              <Smartphone className="w-6 h-6" />
            </div>
            <span>Phonix</span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-400">
            Phonix is a premium, authorized retailer of the world's finest smartphones. We bring you the latest devices with secure payment, express shipping, and exceptional customer support.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/catalog" className="hover:text-white transition-colors">Browse Catalog</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white transition-colors">Track Orders</Link>
            </li>
          </ul>
        </div>

        {/* Popular Brands */}
        <div>
          <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">Popular Brands</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/catalog?brand=Apple" className="hover:text-white transition-colors">Apple iPhones</Link>
            </li>
            <li>
              <Link href="/catalog?brand=Samsung" className="hover:text-white transition-colors">Samsung Galaxy</Link>
            </li>
            <li>
              <Link href="/catalog?brand=Google" className="hover:text-white transition-colors">Google Pixel</Link>
            </li>
            <li>
              <Link href="/catalog?brand=OnePlus" className="hover:text-white transition-colors">OnePlus Flagships</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>100 Innovation Way, Silicon Valley, CA 94025</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+1 (800) 555-PHONIX</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>support@phonix-store.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Phonix Store. All rights reserved. Powered by Syra on Sycord.</p>
      </div>
    </footer>
  );
}
