import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, BookOpen, LogOut, Settings, Image as ImageIcon, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const cards = [
    { to: "/admin/content", icon: Settings, title: "Global Content", desc: "Hero, navbar, footer, about, contact, and more" },
    { to: "/admin/case-studies", icon: FileText, title: "Case Studies", desc: "Create, edit, and manage case studies" },
    { to: "/admin/blog", icon: BookOpen, title: "Blog Posts", desc: "Create, edit, and manage blog posts" },
    { to: "/admin/media", icon: ImageIcon, title: "Media / Assets", desc: "Upload and manage images" },
    { to: "/admin/analytics", icon: BarChart3, title: "Analytics", desc: "Pageviews, visitors, locations" },
  ];

  return (
    <div className="container py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-foreground">Admin CMS</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30"
          >
            <card.icon className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <h2 className="font-heading text-xl text-foreground">{card.title}</h2>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
