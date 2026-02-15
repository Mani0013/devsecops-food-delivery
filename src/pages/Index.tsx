import { Link } from "react-router-dom";
import { Star, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { restaurants, cuisineCategories, heroBanners } from "@/data/restaurants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRef } from "react";

const Index = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const nearYou = restaurants.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Carousel */}
      <section className="container mx-auto px-4 mt-6">
        <Carousel plugins={[plugin.current]} opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {heroBanners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-48 md:h-72 rounded-2xl overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} flex flex-col justify-center px-8 md:px-12`}>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl md:text-4xl font-display font-bold text-white mb-2"
                    >
                      {banner.title}
                    </motion.h2>
                    <p className="text-white/90 text-sm md:text-lg">{banner.subtitle}</p>
                    <Link to="/restaurants">
                      <Button className="mt-4 bg-white text-primary hover:bg-white/90 w-fit">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Cuisine Categories */}
      <section className="container mx-auto px-4 mt-10">
        <h2 className="font-display text-2xl font-bold mb-5">What are you craving?</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {cuisineCategories.map((cat) => (
            <Link to={`/restaurants?cuisine=${cat.id}`} key={cat.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl bg-card border hover:border-primary hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-center whitespace-nowrap">{cat.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
            <Badge className="bg-white/20 text-white border-0 mb-2">Limited Time</Badge>
            <h3 className="font-display text-xl font-bold">Free Delivery Week!</h3>
            <p className="text-sm mt-1 opacity-90">Use code FREEDELIVERY on orders above ₹149</p>
          </div>
          <div className="bg-gradient-to-r from-fresh-orange to-accent rounded-2xl p-6 text-accent-foreground">
            <Badge className="bg-white/20 text-white border-0 mb-2">New Users</Badge>
            <h3 className="font-display text-xl font-bold">20% OFF First Order</h3>
            <p className="text-sm mt-1 opacity-90">Use code WELCOME20 – up to ₹150 off</p>
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="container mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold">Top Rated ⭐</h2>
          <Link to="/restaurants" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {topRated.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* Near You */}
      <section className="container mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold">Near You 📍</h2>
          <Link to="/restaurants" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {nearYou.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const RestaurantCard = ({ restaurant }: { restaurant: typeof restaurants[0] }) => (
  <Link to={`/restaurant/${restaurant.id}`}>
    <motion.div whileHover={{ y: -4 }} className="min-w-[260px] max-w-[260px]">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-40">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          {restaurant.isPromoted && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">Promoted</Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm truncate">{restaurant.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{restaurant.cuisine.join(", ")}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-fresh-orange text-fresh-orange" />
              <span className="text-xs font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">{restaurant.deliveryTime}</span>
            </div>
            <span className="text-xs text-muted-foreground">{restaurant.priceRange}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

export default Index;
