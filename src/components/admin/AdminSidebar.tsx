import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Baby, 
  Calendar, 
  CreditCard, 
  FileText, 
  MessageSquare,
  ClipboardCheck,
  LogOut,
  Heart,
  Shield,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { path: "/admin/children", icon: Baby, label: "Enfants" },
    { path: "/admin/parents", icon: Users, label: "Parents" },
    { path: "/admin/enrollments", icon: Calendar, label: "Inscriptions" },
    { path: "/admin/payments", icon: CreditCard, label: "Paiements" },
    { path: "/admin/attendance", icon: ClipboardCheck, label: "Présences" },
    { path: "/admin/documents", icon: FileText, label: "Documents" },
    { path: "/admin/testimonials", icon: MessageSquare, label: "Témoignages" },
    { path: "/admin/survey-stats", icon: ClipboardCheck, label: "Sondages" },
    { path: "/admin/users", icon: Shield, label: "Administrateurs" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2 group" onClick={onLinkClick}>
          <div className="relative w-8 h-8">
            <Heart className="w-8 h-8" style={{ fill: 'url(#heart-gradient-sidebar)' }} />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="heart-gradient-sidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF1493" />
                  <stop offset="50%" stopColor="#FF69B4" />
                  <stop offset="100%" stopColor="#DB2777" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm leading-tight">
              Happiness Comes First
            </h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: hamburger + sheet drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-6 h-6" style={{ fill: 'url(#heart-gradient-sidebar-mobile)' }} />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="heart-gradient-sidebar-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF1493" />
                <stop offset="50%" stopColor="#FF69B4" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-heading font-bold text-sm">HCF Admin</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 flex flex-col">
            <SidebarContent onLinkClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: fixed sidebar */}
      <div className="hidden md:flex w-64 bg-card border-r border-border min-h-screen flex-col">
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
