import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, ChefHat, Truck, Package, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const steps = [
  { id: 1, label: "Order Placed", icon: Check, description: "Your order has been confirmed" },
  { id: 2, label: "Preparing", icon: ChefHat, description: "Restaurant is preparing your food" },
  { id: 3, label: "Out for Delivery", icon: Truck, description: "Your order is on its way" },
  { id: 4, label: "Delivered", icon: Package, description: "Enjoy your meal!" },
];

const OrderTracking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(2), 3000),
      setTimeout(() => setCurrentStep(3), 7000),
      setTimeout(() => setCurrentStep(4), 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 mt-6 max-w-2xl">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {currentStep === 4 ? <Check className="h-8 w-8 text-primary" /> : <Clock className="h-8 w-8 text-primary animate-pulse" />}
          </motion.div>
          <h1 className="font-display text-3xl font-bold">{currentStep === 4 ? "Order Delivered!" : "Tracking Your Order"}</h1>
          <p className="text-muted-foreground mt-1">Order ID: {orderId}</p>
        </div>

        {/* Progress bar */}
        <Progress value={progressValue} className="h-2 mb-8" />

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.id * 0.1 }}
              >
                <Card className={`transition-all ${isCurrent ? "border-primary shadow-md" : ""} ${isActive ? "" : "opacity-40"}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{step.label}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    {isActive && <Check className="h-5 w-5 text-primary shrink-0" />}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Estimated time */}
        {currentStep < 4 && (
          <Card className="mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Estimated delivery</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">25-35 min</p>
            </CardContent>
          </Card>
        )}

        {/* Delivery person */}
        {currentStep >= 3 && currentStep < 4 && (
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Delivery" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Rajesh Kumar</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-fresh-orange text-fresh-orange" /> 4.8 • 1200+ deliveries
                </div>
              </div>
              <Button size="icon" variant="outline" className="rounded-full">
                <Phone className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="text-center">
            <Link to="/"><Button className="gap-2">🏠 Back to Home</Button></Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderTracking;
