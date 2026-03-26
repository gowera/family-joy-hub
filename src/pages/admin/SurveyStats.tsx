import { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BarChart3, PieChart as PieChartIcon, Users, Shield, Heart, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";

const COLORS = ["#FF1493", "#FF69B4", "#DB2777", "#EC4899", "#F472B6", "#FB923C", "#A855F7", "#6366F1", "#14B8A6", "#22C55E"];

type SurveyResponse = {
  id: string;
  survey_type: string;
  answers: Record<string, any>;
  created_at: string;
};

const SurveyStats = () => {
  const { language } = useLanguage();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (fr: string, en: string) => language === "fr" ? fr : en;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setResponses(data as SurveyResponse[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const childrenResponses = useMemo(() => responses.filter(r => r.survey_type === "children"), [responses]);
  const parentResponses = useMemo(() => responses.filter(r => r.survey_type === "parent"), [responses]);
  const communityResponses = useMemo(() => responses.filter(r => r.survey_type === "community"), [responses]);

  // Helper to count occurrences of a field value
  const countField = (data: SurveyResponse[], field: string) => {
    const counts: Record<string, number> = {};
    data.forEach(r => {
      const val = r.answers?.[field];
      if (typeof val === "string" && val) {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  // Helper to count array field items
  const countArrayField = (data: SurveyResponse[], field: string) => {
    const counts: Record<string, number> = {};
    data.forEach(r => {
      const val = r.answers?.[field];
      if (Array.isArray(val)) {
        val.forEach((item: string) => {
          counts[item] = (counts[item] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Submissions over time
  const submissionsOverTime = (data: SurveyResponse[]) => {
    const byDate: Record<string, number> = {};
    data.forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      byDate[date] = (byDate[date] || 0) + 1;
    });
    return Object.entries(byDate).map(([date, count]) => ({ date, count }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const PieChartCard = ({ title, data }: { title: string; data: { name: string; value: number }[] }) => (
    <Card>
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">{t("Aucune donnée", "No data")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  const BarChartCard = ({ title, data }: { title: string; data: { name: string; value: number }[] }) => (
    <Card>
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">{t("Aucune donnée", "No data")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#FF1493" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">{t("Statistiques des Sondages", "Survey Statistics")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("Données en temps réel des formulaires soumis", "Real-time data from submitted forms")}</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg"><BarChart3 className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{responses.length}</p>
                <p className="text-xs text-muted-foreground">{t("Total réponses", "Total responses")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg"><Shield className="w-5 h-5 text-blue-500" /></div>
              <div>
                <p className="text-2xl font-bold">{childrenResponses.length}</p>
                <p className="text-xs text-muted-foreground">Digital Safety</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-lg"><Users className="w-5 h-5 text-green-500" /></div>
              <div>
                <p className="text-2xl font-bold">{parentResponses.length}</p>
                <p className="text-xs text-muted-foreground">{t("Parents", "Parents")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-pink-500/10 p-2 rounded-lg"><Heart className="w-5 h-5 text-pink-500" /></div>
              <div>
                <p className="text-2xl font-bold">{communityResponses.length}</p>
                <p className="text-xs text-muted-foreground">{t("Communauté", "Community")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions over time */}
        {responses.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" />{t("Soumissions au fil du temps", "Submissions over time")}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={submissionsOverTime(responses)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#FF1493" strokeWidth={2} dot={{ fill: "#FF1493" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabs for each survey */}
        <Tabs defaultValue="children" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1">
            <TabsTrigger value="children" className="flex-1 min-w-[120px] text-xs md:text-sm">
              <Shield className="w-3 h-3 mr-1 hidden md:inline" />
              Digital Safety
            </TabsTrigger>
            <TabsTrigger value="parent" className="flex-1 min-w-[120px] text-xs md:text-sm">
              <Users className="w-3 h-3 mr-1 hidden md:inline" />
              {t("Parents", "Parents")}
            </TabsTrigger>
            <TabsTrigger value="community" className="flex-1 min-w-[120px] text-xs md:text-sm">
              <Heart className="w-3 h-3 mr-1 hidden md:inline" />
              {t("Communauté", "Community")}
            </TabsTrigger>
          </TabsList>

          {/* CHILDREN SURVEY */}
          <TabsContent value="children" className="space-y-4 mt-4">
            {childrenResponses.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{t("Aucune réponse pour le moment", "No responses yet")}</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PieChartCard title={t("Tranches d'âge", "Age groups")} data={countField(childrenResponses, "age")} />
                <PieChartCard title={t("Genre", "Gender")} data={countField(childrenResponses, "gender")} />
                <BarChartCard title={t("Plateformes utilisées", "Platforms used")} data={countArrayField(childrenResponses, "platforms")} />
                <PieChartCard title={t("Heures par jour", "Hours per day")} data={countField(childrenResponses, "hoursPerDay")} />
                <PieChartCard title={t("Moment d'utilisation", "Peak usage time")} data={countField(childrenResponses, "peakUsage")} />
                <PieChartCard title={t("Expérience négative en ligne", "Negative experience online")} data={countField(childrenResponses, "negativeExperience")} />
                <BarChartCard title={t("Types de comportements négatifs", "Types of negative behaviour")} data={countArrayField(childrenResponses, "negativeTypes")} />
                <PieChartCard title={t("Se sent en sécurité en ligne", "Feels safe online")} data={countField(childrenResponses, "feelsSafe")} />
                <PieChartCard title={t("Sait à qui parler", "Knows who to talk to")} data={countField(childrenResponses, "knowsWhoToTalkTo")} />
                <PieChartCard title={t("Veut apprendre la sécurité en ligne", "Wants to learn online safety")} data={countField(childrenResponses, "wantsToLearn")} />
              </div>
            )}
          </TabsContent>

          {/* PARENT SURVEY */}
          <TabsContent value="parent" className="space-y-4 mt-4">
            {parentResponses.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{t("Aucune réponse pour le moment", "No responses yet")}</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PieChartCard title={t("Âge de l'enfant", "Child's age")} data={countField(parentResponses, "childAge")} />
                <PieChartCard title={t("Remplisseur", "Completing as")} data={countField(parentResponses, "completingAs")} />
                <BarChartCard title={t("Plateformes utilisées", "Platforms used")} data={countArrayField(parentResponses, "platforms")} />
                <PieChartCard title={t("Heures par jour", "Hours per day")} data={countField(parentResponses, "hoursPerDay")} />
                <PieChartCard title={t("Expérience négative", "Negative experience")} data={countField(parentResponses, "negativeExperience")} />
                <BarChartCard title={t("Types négatifs", "Negative types")} data={countArrayField(parentResponses, "negativeTypes")} />
                <PieChartCard title={t("Impact sur le bien-être", "Wellbeing impact")} data={countField(parentResponses, "wellbeingImpact")} />
                <BarChartCard title={t("Signes observés", "Signs noticed")} data={countArrayField(parentResponses, "wellbeingSigns")} />
                <PieChartCard title={t("Niveau de confiance", "Confidence level")} data={countField(parentResponses, "confidenceLevel")} />
                <BarChartCard title={t("Outils utilisés", "Tools used")} data={countArrayField(parentResponses, "toolsUsed")} />
                <BarChartCard title={t("Besoins de soutien", "Support needs")} data={countArrayField(parentResponses, "supportNeeds")} />
                <PieChartCard title={t("Intéressé par les ateliers", "Interested in workshops")} data={countField(parentResponses, "interestedInWorkshops")} />
                <BarChartCard title={t("Bénéficiaires", "Beneficiaries")} data={countArrayField(parentResponses, "beneficiaries")} />
              </div>
            )}
          </TabsContent>

          {/* COMMUNITY SURVEY */}
          <TabsContent value="community" className="space-y-4 mt-4">
            {communityResponses.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{t("Aucune réponse pour le moment", "No responses yet")}</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PieChartCard title={t("Tranche d'âge", "Age group")} data={countField(communityResponses, "ageGroup")} />
                <PieChartCard title={t("Profil", "Describes as")} data={countField(communityResponses, "describes")} />
                <PieChartCard title={t("Niveau de forme", "Fitness level")} data={countField(communityResponses, "fitnessLevel")} />
                <BarChartCard title={t("Obstacles", "Barriers")} data={countArrayField(communityResponses, "barriers")} />
                <BarChartCard title={t("Facteurs de confort", "Comfort factors")} data={countArrayField(communityResponses, "comfortFactors")} />
                <PieChartCard title={t("Le fitness améliore le bien-être", "Fitness improves wellbeing")} data={countField(communityResponses, "fitnessImprovesWellbeing")} />
                <BarChartCard title={t("Défis rencontrés", "Challenges")} data={countArrayField(communityResponses, "challenges")} />
                <BarChartCard title={t("Activités souhaitées", "Desired activities")} data={countArrayField(communityResponses, "desiredActivities")} />
                <BarChartCard title={t("Horaires préférés", "Preferred time")} data={countArrayField(communityResponses, "preferredTime")} />
                <BarChartCard title={t("Lieux préférés", "Preferred location")} data={countArrayField(communityResponses, "preferredLocation")} />
                <PieChartCard title={t("Intéressé par le programme", "Interested in programme")} data={countField(communityResponses, "interestedInProgramme")} />
                <BarChartCard title={t("Facteurs de participation", "Attendance factors")} data={countArrayField(communityResponses, "attendanceFactors")} />
                <PieChartCard title={t("Assez d'opportunités", "Enough opportunities")} data={countField(communityResponses, "enoughOpportunities")} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SurveyStats;
