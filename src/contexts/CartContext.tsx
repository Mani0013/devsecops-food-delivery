import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem } from "@/data/restaurants";

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  appliedCoupon: string | null;
  discount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const addToCart = useCallback((item: MenuItem, restaurantId: string, restaurantName: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1, restaurantId, restaurantName }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 149 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + tax - discount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = useCallback(
    (code: string) => {
      const coupons: Record<string, { discount: number; type: "flat" | "percent"; maxDiscount?: number; minOrder: number }> = {
        FRESH50: { discount: 50, type: "flat", minOrder: 299 },
        WELCOME20: { discount: 20, type: "percent", maxDiscount: 150, minOrder: 199 },
        BIRYANI30: { discount: 30, type: "percent", maxDiscount: 200, minOrder: 349 },
        FREEDELIVERY: { discount: 40, type: "flat", minOrder: 149 },
      };
      const coupon = coupons[code.toUpperCase()];
      if (!coupon || subtotal < coupon.minOrder) return false;
      let disc = coupon.type === "flat" ? coupon.discount : Math.round((subtotal * coupon.discount) / 100);
      if (coupon.maxDiscount) disc = Math.min(disc, coupon.maxDiscount);
      setDiscount(disc);
      setAppliedCoupon(code.toUpperCase());
      return true;
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, deliveryFee, tax, grandTotal, appliedCoupon, discount, applyCoupon, removeCoupon }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
