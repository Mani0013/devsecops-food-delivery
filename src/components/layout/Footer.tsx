import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t mt-12">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🍽️</span>
            <span className="font-display text-lg font-bold text-primary">FreshBite</span>
          </div>
          <p className="text-sm text-muted-foreground">Fresh food, delivered fast. Your favorite restaurants at your doorstep.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/restaurants" className="block text-muted-foreground hover:text-primary transition-colors">Restaurants</Link>
            <Link to="/cart" className="block text-muted-foreground hover:text-primary transition-colors">Cart</Link>
            <Link to="/wishlist" className="block text-muted-foreground hover:text-primary transition-colors">Wishlist</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Help & FAQs</p>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            <p>Refund Policy</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📧 support@freshbite.com</p>
            <p>📞 1800-123-4567</p>
            <p>📍 Bangalore, India</p>
          </div>
        </div>
      </div>
      <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
        © 2026 FreshBite. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
