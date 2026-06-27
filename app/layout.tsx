import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "@/components/Toast";
import ChatWidget from "@/components/ChatWidget";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Phonix — Premium Smartphone Store",
  description: "Buy the latest iPhones, Galaxies, Pixels, and flagships with secure checkout and express delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <ToastContainer />
      </body>
    </html>
  );
}
