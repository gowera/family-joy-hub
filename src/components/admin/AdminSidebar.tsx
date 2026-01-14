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
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { path: "/admin/children", icon: Baby, label: "Enfants" },
    { path: "/admin/parents", icon: Users, label: "Parents" },
    { path: "/admin/enrollments", icon: Calendar, label: "Inscriptions" },
    { path: "/admin/payments", icon: CreditCard, label: "Paiements" },
    { path: "/admin/attendance", icon: ClipboardCheck, label: "Présences" },
    { path: "/admin/documents", icon: FileText, label: "Documents" },
    { path: "/admin/testimonials", icon: MessageSquare, label: "Témoignages" },
    { path: "/admin/users", icon: Shield, label: "Administrateurs" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2 group">
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

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
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
    </div>
  );
};

export default AdminSidebar;
