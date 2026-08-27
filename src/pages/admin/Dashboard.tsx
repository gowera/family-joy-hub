import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Users, Calendar, CreditCard, TrendingUp, Heart, PoundSterling, ClipboardList } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
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
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalParents: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    paidRevenue: 0,
    unityCircleRegistrations: 0,
  });
  const [recentUnityCircle, setRecentUnityCircle] = useState<Array<{ id: string; created_at: string; answers: Record<string, unknown> }>>([]);
  const [enrollmentsByStatus, setEnrollmentsByStatus] = useState<any[]>([]);
  const [paymentsByMethod, setPaymentsByMethod] = useState<any[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  // Re-translate chart data when language changes
  useEffect(() => {
    fetchChartData();
  }, [language]);

  const fetchStats = async () => {
    const [childrenRes, parentsRes, enrollmentsRes, paymentsRes, paidPaymentsRes, unityCircleRes] = await Promise.all([
      supabase.from("children").select("id", { count: "exact" }),
      supabase.from("parents").select("id", { count: "exact" }),
      supabase.from("enrollments").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("payments").select("amount").eq("payment_status", "pending"),
      supabase.from("payments").select("amount").eq("payment_status", "paid"),
      supabase.from("survey_responses").select("id, created_at, answers").eq("survey_type", "unity_circle").order("created_at", { ascending: false }),
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
      unityCircleRegistrations: unityCircleRes.count || unityCircleRes.data?.length || 0,
    });
    if (unityCircleRes.data) setRecentUnityCircle(unityCircleRes.data as Array<{ id: string; created_at: string; answers: Record<string, unknown> }>);
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
        { name: t("status.active"), value: statusCounts.active || 0, color: "#22c55e" },
        { name: t("status.completed"), value: statusCounts.completed || 0, color: "#3b82f6" },
        { name: t("status.cancelled"), value: statusCounts.cancelled || 0, color: "#ef4444" },
        { name: t("status.waitlist"), value: statusCounts.waitlist || 0, color: "#f59e0b" },
      ]);
    }

    // Payments by method
    const { data: payments } = await supabase.from("payments").select("payment_method, amount");
    if (payments) {
      const methodTotals = payments.reduce((acc: any, p) => {
        const methodLabels: Record<string, string> = {
          bank_transfer: t("payment.bankTransfer"),
          card: t("payment.card"),
          cash: t("payment.cash"),
          other: t("payment.other"),
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
        [t("age.0-3")]: 0,
        [t("age.4-6")]: 0,
        [t("age.7-9")]: 0,
        [t("age.10-12")]: 0,
        [t("age.13+")]: 0,
      };
      const ageKeys = [t("age.0-3"), t("age.4-6"), t("age.7-9"), t("age.10-12"), t("age.13+")];
      children.forEach((child) => {
        const age = Math.floor(
          (Date.now() - new Date(child.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        if (age <= 3) ageGroups[ageKeys[0]]++;
        else if (age <= 6) ageGroups[ageKeys[1]]++;
        else if (age <= 9) ageGroups[ageKeys[2]]++;
        else if (age <= 12) ageGroups[ageKeys[3]]++;
        else ageGroups[ageKeys[4]]++;
      });
      setAgeDistribution(
        Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
      );
    }
  };

  const statCards = [
    { title: t("dashboard.children"), value: stats.totalChildren, icon: Baby, color: "text-pink-500" },
    { title: t("dashboard.parents"), value: stats.totalParents, icon: Users, color: "text-blue-500" },
    { title: t("dashboard.activeEnrollments"), value: stats.activeEnrollments, icon: Calendar, color: "text-green-500" },
    { title: t("dashboard.pendingPayments"), value: stats.pendingPayments, icon: CreditCard, color: "text-orange-500" },
    { title: "Unity Circle", value: stats.unityCircleRegistrations, icon: ClipboardList, color: "text-primary" },
  ];

  const highlights = [
    { text: t("dashboard.highlight1"), color: "bg-green-500" },
    { text: t("dashboard.highlight2"), color: "bg-blue-500" },
    { text: t("dashboard.highlight3"), color: "bg-pink-500" },
    { text: t("dashboard.highlight4"), color: "bg-purple-500" },
    { text: t("dashboard.highlight5"), color: "bg-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header with language toggle */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">{t("dashboard.title")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("dashboard.subtitle")}</p>
          </div>
          <LanguageToggle />
        </div>

        {/* Stats Cards - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6 md:pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground line-clamp-2">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color} flex-shrink-0`} />
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue Cards - Stack on mobile */}
        <div className="grid gap-3 md:gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {t("dashboard.totalRevenue")}
              </CardTitle>
              <PoundSterling className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-2xl md:text-3xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {t("dashboard.collected").replace("{amount}", `£${stats.paidRevenue.toFixed(2)}`)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3 md:p-6 md:pb-2">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                {t("dashboard.impactStatement")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <p className="text-xs md:text-sm text-muted-foreground">
                {t("dashboard.impactText")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 - Stack on mobile */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">{t("dashboard.enrollmentsByStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrollmentsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
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
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">{t("dashboard.ageDistribution")}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} tick={{ fontSize: 10 }} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 - Stack on mobile */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">{t("dashboard.paymentsByMethod")}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentsByMethod} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={10} />
                    <YAxis dataKey="name" type="category" width={60} fontSize={10} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value: number) => [`£${value.toFixed(2)}`, t("payment.amount")]} />
                    <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                {t("dashboard.programHighlights")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${highlight.color} flex-shrink-0`}></div>
                    {highlight.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 p-3 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Unity Circle registrations
            </CardTitle>
            <Link to="/admin/survey-stats" className="text-xs md:text-sm text-primary hover:underline whitespace-nowrap">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            {recentUnityCircle.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Unity Circle registrations yet.</p>
            ) : (
              <div className="space-y-3">
                {recentUnityCircle.slice(0, 5).map((registration) => (
                  <div key={registration.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{String(registration.answers.fullName || "Unnamed participant")}</p>
                      <p className="text-xs text-muted-foreground truncate">{String(registration.answers.email || "No email")} {registration.answers.phone ? `- ${String(registration.answers.phone)}` : ""}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(registration.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
