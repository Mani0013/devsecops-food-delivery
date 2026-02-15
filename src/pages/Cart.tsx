import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, tax, grandTotal, appliedCoupon, discount, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    if (applyCoupon(couponCode)) {
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    } else {
      toast.error("Invalid coupon or minimum order not met");
    }
  };

  const handlePlaceOrder = () => {
    clearCart();
    navigate("/order-tracking");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">Add some delicious items to get started!</p>
          <Link to="/restaurants"><Button className="mt-6">Browse Restaurants</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 mt-6">
        <h1 className="font-display text-3xl font-bold mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.id} layout exit={{ opacity: 0, x: -100 }}>
                  <Card>
                    <CardContent className="p-3 flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-sm border-2 ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                            <span className={`block w-1.5 h-1.5 rounded-full m-[1px] ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                          </span>
                          <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
                        <p className="font-bold text-sm mt-1">₹{item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 border rounded-lg">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

                {/* Coupon */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{appliedCoupon}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-destructive text-xs">Remove</Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="h-9" />
                      <Button size="sm" onClick={handleApplyCoupon} disabled={!couponCode}>Apply</Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {["FRESH50", "WELCOME20"].map((c) => (
                      <Badge key={c} variant="outline" className="cursor-pointer text-[10px]" onClick={() => setCouponCode(c)}>{c}</Badge>
                    ))}
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery Fee</span><span>{deliveryFee === 0 ? <span className="text-primary">FREE</span> : `₹${deliveryFee}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>₹{tax}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary"><span>Discount</span><span>-₹{discount}</span></div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span><span>₹{grandTotal}</span>
                </div>

                <Button className="w-full mt-4 h-12 text-base gap-2" onClick={handlePlaceOrder}>
                  <ShoppingBag className="h-5 w-5" /> Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
