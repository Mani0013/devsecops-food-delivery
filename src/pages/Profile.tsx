import { useState } from "react";
import { User, MapPin, Clock, CreditCard, Settings, Edit2, Plus, Trash2, Moon, Sun, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { defaultUser, UserAddress } from "@/data/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState(defaultUser);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSaveProfile = () => {
    setUser({ ...user, name: editName, email: editEmail, phone: editPhone });
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleDeleteAddress = (id: string) => {
    setUser({ ...user, addresses: user.addresses.filter((a) => a.id !== id) });
    toast.success("Address removed");
  };

  const toggleDarkMode = (val: boolean) => {
    setDarkMode(val);
    document.documentElement.classList.toggle("dark", val);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 mt-6 max-w-3xl">
        {/* Profile header */}
        <Card className="mb-6">
          <CardContent className="p-6 flex items-center gap-6">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <div><Label className="text-xs">Name</Label><Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" /></div>
                  <div><Label className="text-xs">Email</Label><Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="h-9" /></div>
                  <div><Label className="text-xs">Phone</Label><Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-9" /></div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                  <Button size="sm" variant="outline" className="mt-2 gap-1" onClick={() => setEditing(true)}>
                    <Edit2 className="h-3 w-3" /> Edit Profile
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="addresses">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="addresses" className="gap-1 text-xs"><MapPin className="h-3 w-3" /> Addresses</TabsTrigger>
            <TabsTrigger value="orders" className="gap-1 text-xs"><Clock className="h-3 w-3" /> Orders</TabsTrigger>
            <TabsTrigger value="payments" className="gap-1 text-xs"><CreditCard className="h-3 w-3" /> Payments</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 text-xs"><Settings className="h-3 w-3" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="addresses" className="mt-4 space-y-3">
            {user.addresses.map((addr) => (
              <Card key={addr.id}>
                <CardContent className="p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{addr.label}</h3>
                      {addr.isDefault && <Badge variant="secondary" className="text-[10px]">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteAddress(addr.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full gap-1"><Plus className="h-4 w-4" /> Add New Address</Button>
          </TabsContent>

          <TabsContent value="orders" className="mt-4 space-y-3">
            {user.orderHistory.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{order.restaurantName}</h3>
                      <p className="text-xs text-muted-foreground">{order.id} • {order.date}</p>
                    </div>
                    <Badge variant={order.status === "delivered" ? "default" : "destructive"} className="text-[10px]">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{order.items.join(", ")}</p>
                  <p className="font-bold text-sm mt-2">₹{order.total}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold">No saved payment methods</h3>
                <p className="text-sm text-muted-foreground mt-1">Payment methods will appear here</p>
                <Button variant="outline" className="mt-4 gap-1"><Plus className="h-4 w-4" /> Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <h3 className="font-semibold text-sm">Dark Mode</h3>
                    <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Push Notifications</h3>
                    <p className="text-xs text-muted-foreground">Get updates on your orders</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
