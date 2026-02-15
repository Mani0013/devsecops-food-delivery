import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, Heart, Plus, Minus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { restaurants } from "@/data/restaurants";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "@/data/restaurants";

const RestaurantDetail = () => {
  const { id } = useParams();
  const restaurant = restaurants.find((r) => r.id === id);
  const { items: cartItems, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState<string>("");

  const categories = useMemo(() => {
    if (!restaurant) return [];
    const cats = [...new Set(restaurant.menu.map((m) => m.category))];
    if (!activeCategory && cats.length > 0) setActiveCategory(cats[0]);
    return cats;
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-4">😕</p>
          <h2 className="font-display text-2xl font-bold">Restaurant not found</h2>
          <Link to="/restaurants"><Button className="mt-4">Browse Restaurants</Button></Link>
        </div>
      </div>
    );
  }

  const getCartQty = (itemId: string) => cartItems.find((i) => i.id === itemId)?.quantity || 0;

  const handleAdd = (item: MenuItem) => {
    addToCart(item, restaurant.id, restaurant.name);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover */}
      <div className="relative h-52 md:h-72">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 container mx-auto">
          <Link to="/restaurants" className="inline-flex items-center gap-1 text-white/80 text-sm mb-2 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">{restaurant.name}</h1>
          <p className="text-white/80 text-sm mt-1">{restaurant.cuisine.join(" • ")}</p>
          <div className="flex items-center gap-4 mt-2 text-white/90 text-sm">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-fresh-orange text-fresh-orange" /> {restaurant.rating}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {restaurant.deliveryTime}</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {restaurant.address}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6 sticky top-16 bg-background z-10 py-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Menu items */}
        <div className="space-y-4 pb-8">
          {restaurant.menu
            .filter((m) => m.category === activeCategory)
            .map((item) => {
              const qty = getCartQty(item.id);
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0 flex">
                      <div className="relative w-32 md:w-44 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover min-h-[120px]" />
                        <button
                          onClick={() => toggleWishlist(item, restaurant.id, restaurant.name)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(item.id) ? "fill-fresh-red text-fresh-red" : "text-muted-foreground"}`} />
                        </button>
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-sm border-2 ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                              <span className={`block w-1.5 h-1.5 rounded-full m-[1px] ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                            </span>
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            {item.isBestseller && <Badge className="text-[10px] bg-fresh-orange border-0">Bestseller</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-fresh-orange text-fresh-orange" />
                              <span className="text-xs">{item.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold">₹{item.price}</span>
                          {qty > 0 ? (
                            <div className="flex items-center gap-2 bg-primary rounded-lg">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => updateQuantity(item.id, qty - 1)}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-sm font-bold text-primary-foreground w-4 text-center">{qty}</span>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => updateQuantity(item.id, qty + 1)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" onClick={() => handleAdd(item)} className="gap-1">
                              <Plus className="h-4 w-4" /> Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;
