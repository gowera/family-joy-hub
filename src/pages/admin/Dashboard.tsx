import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Users, Calendar, CreditCard, TrendingUp, Heart } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalParents: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [childrenRes, parentsRes, enrollmentsRes, paymentsRes] = await Promise.all([
      supabase.from("children").select("id", { count: "exact" }),
      supabase.from("parents").select("id", { count: "exact" }),
      supabase.from("enrollments").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("payments").select("id", { count: "exact" }).eq("payment_status", "pending"),
    ]);

    setStats({
      totalChildren: childrenRes.count || 0,
      totalParents: parentsRes.count || 0,
      activeEnrollments: enrollmentsRes.count || 0,
      pendingPayments: paymentsRes.count || 0,
    });
  };

  const statCards = [
    { title: "Enfants inscrits", value: stats.totalChildren, icon: Baby, color: "text-pink-500" },
    { title: "Parents", value: stats.totalParents, icon: Users, color: "text-blue-500" },
    { title: "Inscriptions actives", value: stats.activeEnrollments, icon: Calendar, color: "text-green-500" },
    { title: "Paiements en attente", value: stats.pendingPayments, icon: CreditCard, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de Happiness Comes First</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Impact Statement
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm">
              <p className="text-muted-foreground">
                The Happiness Comes First Summer Kids Hub, delivered at St Francis Community Hall, 
                successfully supported children and families during the school holidays by providing 
                a safe, inclusive, and joyful environment. The programme promoted wellbeing, physical 
                activity, creativity, and social connection. Families reported high satisfaction, and 
                children demonstrated increased confidence, happiness, and engagement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Programme Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Improved confidence & communication
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Inclusive of neurodiverse children
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  Safe, caring & structured environment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Community cohesion across cultures
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
