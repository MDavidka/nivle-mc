"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User as UserIcon, ArrowRight, Smartphone, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { useToastStore } from "@/components/Toast";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, loading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const redirect = searchParams.get("redirect") || "/";

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
    clearError();
  }, [user, router, redirect, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name || !email || !password) {
      setValidationError("Please fill out all fields");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      addToast("Account created successfully! Welcome to Phonix.", "success");
      router.push(redirect);
    } else {
      addToast(result.error || "Registration failed", "error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Pane: Register Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground font-semibold">
              Sign up today to record and track your orders in MongoDB.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Errors */}
            {(error || validationError) && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex gap-3 text-sm text-red-700 dark:text-red-300 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{validationError || error}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-card border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-card border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
                <input
                  id="password"
                  type="password"
                  placeholder="•••••••• (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-card border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/15 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-muted-foreground font-semibold">
            Already have an account?{" "}
            <Link
              href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
              className="text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>

          {/* MongoDB note */}
          <div className="p-4 bg-muted/40 rounded-xl border text-center">
            <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
              🔒 <strong>MongoDB Cluster Storage</strong>: Your account will be securely saved in the database. Password hashing is done via 10-round bcrypt encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane: Graphic Banner (Desktop only) */}
      <div className="hidden lg:flex relative overflow-hidden bg-slate-950 text-white flex-col justify-between p-12">
        {/* Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white relative z-10">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
            <Smartphone className="w-6 h-6" />
          </div>
          <span>Phonix</span>
        </Link>

        {/* Central Marketing Quote */}
        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Unlock the Full Experience with MongoDB.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            By creating an account, you gain access to our custom order pipeline. All purchases, receipts, and order tracking statuses are stored securely in a MongoDB cluster.
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-primary">Free</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Account Creation</span>
            </div>
            <span className="w-[1px] bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-accent">Bcrypt</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Password Hashing</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-slate-500 font-semibold relative z-10">
          © {new Date().getFullYear()} Phonix Store. Secured with SSL & JWT.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading registration page...</p>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
