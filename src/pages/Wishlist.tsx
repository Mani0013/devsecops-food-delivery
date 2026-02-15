import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart(item, item.restaurantId, item.restaurantName);
    removeFromWishlist(item.id);
    toast.success(`${item.name} moved to cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-6xl mb-4">💚</p>
          <h2 className="font-display text-2xl font-bold">Your wishlist is empty</h2>
          <p className="text-muted-foreground mt-2">Save your favorite dishes for later!</p>
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
        <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-7 w-7 text-fresh-red" /> My Wishlist
          <Badge variant="secondary" className="ml-2">{items.length} items</Badge>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div key={item.id} layout exit={{ opacity: 0, scale: 0.9 }}>
                <Card className="overflow-hidden">
                  <div className="relative h-40">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 left-2 w-4 h-4 rounded-sm border-2 ${item.isVeg ? "border-green-600 bg-white" : "border-red-600 bg-white"}`}>
                      <span className={`block w-2 h-2 rounded-full m-[2px] ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
                    <p className="font-bold mt-2">₹{item.price}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1 gap-1" onClick={() => handleMoveToCart(item)}>
                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
