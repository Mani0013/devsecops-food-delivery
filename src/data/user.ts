export interface UserAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface OrderHistoryItem {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  date: string;
  status: "delivered" | "cancelled";
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: UserAddress[];
  orderHistory: OrderHistoryItem[];
}

export const defaultUser: UserProfile = {
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  addresses: [
    { id: "a1", label: "Home", address: "42, 3rd Cross, Koramangala, Bangalore - 560034", isDefault: true },
    { id: "a2", label: "Work", address: "Tech Park, Outer Ring Road, Marathahalli, Bangalore - 560037", isDefault: false },
  ],
  orderHistory: [
    { id: "ORD-1001", restaurantName: "Spice Garden", items: ["Chicken Biryani x2", "Butter Chicken x1", "Garlic Naan x3"], total: 1016, date: "2026-02-10", status: "delivered" },
    { id: "ORD-1002", restaurantName: "Dosa Corner", items: ["Masala Dosa x2", "Filter Coffee x2"], total: 356, date: "2026-02-08", status: "delivered" },
    { id: "ORD-1003", restaurantName: "Burger Barn", items: ["Classic Chicken Burger x1", "Loaded Fries x1", "Chocolate Milkshake x1"], total: 457, date: "2026-02-05", status: "delivered" },
    { id: "ORD-1004", restaurantName: "Dragon Wok", items: ["Hakka Noodles x1", "Chilli Paneer x1"], total: 418, date: "2026-01-30", status: "cancelled" },
  ],
};
