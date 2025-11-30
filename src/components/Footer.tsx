import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12 bg-[sidebar-accent-foreground] bg-neutral-950 text-primary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-heading font-bold text-lg">Happiness Comes First</h3>
                <p className="text-sm text-muted-foreground">Where Everyone Belongs</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Supporting families from all backgrounds through inclusive fitness, cultural
              celebration, and community activities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Impact & Evaluation
                </Link>
              </li>
              <li>
                <Link to="/safeguarding" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Safeguarding Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>+44 7774 134000</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>contactsandrapink@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Glasgow Community Centre, Glasgow, UK</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full hover:text-primary-foreground transition-all flex items-center justify-center bg-[#22378d]">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full hover:text-primary-foreground transition-all flex items-center justify-center bg-[#d32802]">
                <Instagram className="w-5 h-5 bg-black/[0.02]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full transition-all flex items-center justify-center bg-[#2b7bf2] text-white">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Scottish Charitable Incorporated Organisation (SCIO)
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Happiness Comes First SCIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;