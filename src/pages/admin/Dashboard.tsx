import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Users, Calendar, CreditCard, TrendingUp, Heart, PoundSterling } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalParents: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    paidRevenue: 0,
  });
  const [enrollmentsByStatus, setEnrollmentsByStatus] = useState<any[]>([]);
  const [paymentsByMethod, setPaymentsByMethod] = useState<any[]>([]);
  const [monthlyEnrollments, setMonthlyEnrollments] = useState<any[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    const [childrenRes, parentsRes, enrollmentsRes, paymentsRes, paidPaymentsRes] = await Promise.all([
      supabase.from("children").select("id", { count: "exact" }),
      supabase.from("parents").select("id", { count: "exact" }),
      supabase.from("enrollments").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("payments").select("amount").eq("payment_status", "pending"),
      supabase.from("payments").select("amount").eq("payment_status", "paid"),
    ]);

    const pendingTotal = paymentsRes.data?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const paidTotal = paidPaymentsRes.data?.reduce((sum, p) => sum + p.amount, 0) || 0;

    setStats({
      totalChildren: childrenRes.count || 0,
      totalParents: parentsRes.count || 0,
      activeEnrollments: enrollmentsRes.count || 0,
      pendingPayments: paymentsRes.data?.length || 0,
      totalRevenue: pendingTotal + paidTotal,
      paidRevenue: paidTotal,
    });
  };

  const fetchChartData = async () => {
    // Enrollments by status
    const { data: enrollments } = await supabase.from("enrollments").select("status");
    if (enrollments) {
      const statusCounts = enrollments.reduce((acc: any, e) => {
        acc[e.status] = (acc[e.status] || 0) + 1;
        return acc;
      }, {});
      setEnrollmentsByStatus([
        { name: "Actifs", value: statusCounts.active || 0, color: "#22c55e" },
        { name: "Terminés", value: statusCounts.completed || 0, color: "#3b82f6" },
        { name: "Annulés", value: statusCounts.cancelled || 0, color: "#ef4444" },
        { name: "Liste d'attente", value: statusCounts.waitlist || 0, color: "#f59e0b" },
      ]);
    }

    // Payments by method
    const { data: payments } = await supabase.from("payments").select("payment_method, amount");
    if (payments) {
      const methodTotals = payments.reduce((acc: any, p) => {
        const methodLabels: Record<string, string> = {
          bank_transfer: "Virement",
          card: "Carte",
          cash: "Espèces",
          other: "Autre",
        };
        const label = methodLabels[p.payment_method] || p.payment_method;
        acc[label] = (acc[label] || 0) + p.amount;
        return acc;
      }, {});
      setPaymentsByMethod(
        Object.entries(methodTotals).map(([name, value]) => ({ name, value }))
      );
    }

    // Age distribution
    const { data: children } = await supabase.from("children").select("date_of_birth");
    if (children) {
      const ageGroups: Record<string, number> = {
        "0-3 ans": 0,
        "4-6 ans": 0,
        "7-9 ans": 0,
        "10-12 ans": 0,
        "13+ ans": 0,
      };
      children.forEach((child) => {
        const age = Math.floor(
          (Date.now() - new Date(child.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        if (age <= 3) ageGroups["0-3 ans"]++;
        else if (age <= 6) ageGroups["4-6 ans"]++;
        else if (age <= 9) ageGroups["7-9 ans"]++;
        else if (age <= 12) ageGroups["10-12 ans"]++;
        else ageGroups["13+ ans"]++;
      });
      setAgeDistribution(
        Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
      );
    }
  };

  const statCards = [
    { title: "Enfants inscrits", value: stats.totalChildren, icon: Baby, color: "text-pink-500" },
    { title: "Parents", value: stats.totalParents, icon: Users, color: "text-blue-500" },
    { title: "Inscriptions actives", value: stats.activeEnrollments, icon: Calendar, color: "text-green-500" },
    { title: "Paiements en attente", value: stats.pendingPayments, icon: CreditCard, color: "text-orange-500" },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de Happiness Comes First</p>
        </div>

        {/* Stats Cards */}
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

        {/* Revenue Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenus totaux
              </CardTitle>
              <PoundSterling className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Dont £{stats.paidRevenue.toFixed(2)} encaissés
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Impact Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The Happiness Comes First Summer Kids Hub successfully supported children 
                and families by providing a safe, inclusive, and joyful environment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inscriptions par statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrollmentsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {enrollmentsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution par âge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paiements par méthode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentsByMethod} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                    <Tooltip formatter={(value: number) => [`£${value.toFixed(2)}`, 'Montant']} />
                    <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              <ul className="space-y-3 text-sm text-muted-foreground">
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
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Physical activity & creative engagement
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
