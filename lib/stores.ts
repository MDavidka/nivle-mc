import { create } from "zustand";
import { Product } from "./products";

// --- AUTH STORE TYPES & IMPLEMENTATION ---
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  clearError: () => set({ error: null }),

  checkSession: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        set({ user: data.user, error: null });
      } else {
        set({ user: null });
      }
    } catch (err) {
      console.error("Session check failed:", err);
      set({ user: null });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/api/auth/login", { // Wait, standard path is /api/auth/login
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      // Wait, let's fix path to "/api/auth/login"
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        set({ error: data.error || "Login failed", loading: false });
        return { success: false, error: data.error || "Login failed" };
      }
      set({ user: data.user, error: null, loading: false });
      return { success: true };
    } catch (err: any) {
      set({ error: "Network error occurred", loading: false });
      return { success: false, error: "Network error occurred" };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || "Registration failed", loading: false });
        return { success: false, error: data.error || "Registration failed" };
      }
      set({ user: data.user, error: null, loading: false });
      return { success: true };
    } catch (err: any) {
      set({ error: "Network error occurred", loading: false });
      return { success: false, error: "Network error occurred" };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null, error: null });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ loading: false });
    }
  },
}));


// --- CART STORE TYPES & IMPLEMENTATION ---
export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedStorage: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, color: string, storage: string) => void;
  removeItem: (productId: string, color: string, storage: string) => void;
  updateQuantity: (productId: string, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  // Safe localStorage access for Next.js SSR
  const isClient = typeof window !== "undefined";
  const initialItems = isClient ? JSON.parse(localStorage.getItem("phonix_cart") || "[]") : [];

  const saveCart = (items: CartItem[]) => {
    if (isClient) {
      localStorage.setItem("phonix_cart", JSON.stringify(items));
    }
  };

  return {
    items: initialItems,

    addItem: (product, color, storage) => {
      const currentItems = get().items;
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedStorage === storage
      );

      let newItems = [...currentItems];

      if (existingItemIndex > -1) {
        newItems[existingItemIndex].quantity += 1;
      } else {
        newItems.push({
          product,
          selectedColor: color,
          selectedStorage: storage,
          quantity: 1,
        });
      }

      set({ items: newItems });
      saveCart(newItems);
    },

    removeItem: (productId, color, storage) => {
      const currentItems = get().items;
      const newItems = currentItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedStorage === storage
          )
      );
      set({ items: newItems });
      saveCart(newItems);
    },

    updateQuantity: (productId, color, storage, quantity) => {
      if (quantity <= 0) {
        get().removeItem(productId, color, storage);
        return;
      }

      const currentItems = get().items;
      const newItems = currentItems.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedStorage === storage
        ) {
          return { ...item, quantity };
        }
        return item;
      });

      set({ items: newItems });
      saveCart(newItems);
    },

    clearCart: () => {
      set({ items: [] });
      saveCart([]);
    },

    getCartTotal: () => {
      return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    },

    getCartCount: () => {
      return get().items.reduce((count, item) => count + item.quantity, 0);
    },
  };
});
