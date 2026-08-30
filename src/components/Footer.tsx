import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import logoFLP from "@/assets/logo-flp.jpeg";
import logoHCF from "@/assets/logo-hcf.jpeg";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-neutral-950 border-t border-border mt-20 w-full">
      <div className="w-full px-4 md:px-8 lg:px-16 py-12 text-primary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoHCF} alt="HCF Logo" className="w-12 h-12 object-contain rounded-md bg-white p-1 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-lg truncate">Happiness Comes First</h3>
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
              <li>
                <Link to="/survey/children" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Digital Safety Survey (Children)
                </Link>
              </li>
              <li>
                <Link to="/survey/parents" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Parent Questionnaire
                </Link>
              </li>
              <li>
                <Link to="/survey/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community Survey
                </Link>
              </li>
              <li>
                <Link to="/unity-circle" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  The unity circle
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/survey-stats" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Survey Statistics
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Job Opportunities
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
                <span>happynesscome01@gmail.com</span>
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
              <a href="https://www.facebook.com/share/1CuUVmE4ej/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full hover:text-primary-foreground transition-all flex items-center justify-center bg-[#1877F2] text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/happinesscomesfirst?igsh=dzBuMHppd3Jjdzk0" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full hover:text-primary-foreground transition-all flex items-center justify-center bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Scottish Charitable Incorporated Organisation (SCIO)
            </p>
          </div>
        </div>

        {/* Foundation Support Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-sm text-muted-foreground">Supported by</p>
            <a href="https://www.facebook.com/share/1CuUVmE4ej/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
              <img 
                src={logoFLP} 
                alt="Fondation Linda Pink Logo" 
                className="h-16 w-auto rounded-lg"
              />
            </a>
            <p className="text-xs text-muted-foreground">Fondation Linda Pink</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Happiness Comes First SCIO. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Proudly designed by{" "}
            <a 
              href="https://oredytech.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Oredy TECHNOLOGIES
            </a>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;