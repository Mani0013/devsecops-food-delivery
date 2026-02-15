import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Star, Clock, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurants, cuisineCategories } from "@/data/restaurants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type SortBy = "popularity" | "rating" | "deliveryTime" | "priceLow" | "priceHigh";

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const initialCuisine = searchParams.get("cuisine") || "";

  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [vegOnly, setVegOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...restaurants];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.menu.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    if (selectedCuisine) {
      const cuisineName = cuisineCategories.find((c) => c.id === selectedCuisine)?.name || "";
      result = result.filter((r) => r.cuisine.some((c) => c.toLowerCase().includes(cuisineName.toLowerCase())));
    }

    if (vegOnly) {
      result = result.filter((r) => r.menu.some((m) => m.isVeg));
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "deliveryTime":
        result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case "priceLow":
        result.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      case "priceHigh":
        result.sort((a, b) => b.priceRange.length - a.priceRange.length);
        break;
    }

    return result;
  }, [search, selectedCuisine, sortBy, vegOnly]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 mt-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search restaurants, cuisines, or dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl"
          />
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1 shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>

          {cuisineCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCuisine === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCuisine(selectedCuisine === cat.id ? "" : cat.id)}
              className="shrink-0 gap-1"
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-card rounded-xl border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sort:</span>
                  {[
                    { value: "popularity", label: "Popular" },
                    { value: "rating", label: "Rating" },
                    { value: "deliveryTime", label: "Fast" },
                    { value: "priceLow", label: "Price ↑" },
                    { value: "priceHigh", label: "Price ↓" },
                  ].map((s) => (
                    <Button
                      key={s.value}
                      variant={sortBy === s.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy(s.value as SortBy)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant={vegOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVegOnly(!vegOnly)}
                  className="gap-1"
                >
                  🟢 Veg Only
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters */}
        {(selectedCuisine || vegOnly) && (
          <div className="flex gap-2 mb-4">
            {selectedCuisine && (
              <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSelectedCuisine("")}>
                {cuisineCategories.find((c) => c.id === selectedCuisine)?.name} <X className="h-3 w-3" />
              </Badge>
            )}
            {vegOnly && (
              <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setVegOnly(false)}>
                Veg Only <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} restaurants found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((r) => (
            <Link to={`/restaurant/${r.id}`} key={r.id}>
              <motion.div whileHover={{ y: -4 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="relative h-44">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                    {r.isPromoted && (
                      <Badge className="absolute top-2 left-2 bg-primary text-[10px]">Promoted</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{r.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{r.cuisine.join(", ")}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-fresh-orange text-fresh-orange" />
                        <span className="text-sm font-medium">{r.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{r.deliveryTime}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{r.priceRange}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="font-display text-xl font-bold">No restaurants found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Restaurants;
