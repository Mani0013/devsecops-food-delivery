import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem } from "@/data/restaurants";

export interface WishlistItem extends MenuItem {
  restaurantId: string;
  restaurantName: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  toggleWishlist: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addToWishlist = useCallback((item: MenuItem, restaurantId: string, restaurantName: string) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, { ...item, restaurantId, restaurantName }];
    });
  }, []);

  const removeFromWishlist = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const isInWishlist = useCallback((itemId: string) => items.some((i) => i.id === itemId), [items]);

  const toggleWishlist = useCallback(
    (item: MenuItem, restaurantId: string, restaurantName: string) => {
      if (isInWishlist(item.id)) {
        removeFromWishlist(item.id);
      } else {
        addToWishlist(item, restaurantId, restaurantName);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
