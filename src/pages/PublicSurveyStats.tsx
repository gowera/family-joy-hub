import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BarChart3, Users, Shield, Heart, TrendingUp, Download } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { generateSurveyStatsPdf } from "@/lib/surveyPdfGenerator";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = ["#FF1493", "#FF69B4", "#DB2777", "#EC4899", "#F472B6", "#FB923C", "#A855F7", "#6366F1", "#14B8A6", "#22C55E"];

type SurveyResponse = {
  id: string;
  survey_type: string;
  answers: Record<string, any>;
  created_at: string;
};

const PieChartCard = ({ title, data, noDataText }: { title: string; data: { name: string; value: number }[]; noDataText: string }) => (
  <Card>
    <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
    <CardContent>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">{noDataText}</p>
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

const BarChartCard = ({ title, data, noDataText }: { title: string; data: { name: string; value: number }[]; noDataText: string }) => (
  <Card>
    <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
    <CardContent>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">{noDataText}</p>
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

const PublicSurveyStats = () => {
  const { language } = useLanguage();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (fr: string, en: string) => language === "fr" ? fr : en;

  const CACHE_KEY = "hcf:survey-stats:cache:v1";

  useEffect(() => {
    // Hydrate from cache immediately so data is available even if backend is offline
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { data: SurveyResponse[] };
        if (Array.isArray(parsed.data) && parsed.data.length) {
          setResponses(parsed.data);
          setLoading(false);
        }
      }
    } catch {
      // ignore cache parse errors
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase.rpc("get_public_survey_responses");
        if (!error && data) {
          setResponses(data as SurveyResponse[]);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ data, cachedAt: Date.now() })
            );
          } catch {
            // storage full — ignore
          }
        }
      } catch {
        // network/backend offline — keep cached data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const childrenResponses = useMemo(() => responses.filter(r => r.survey_type === "children"), [responses]);
  const parentResponses = useMemo(() => responses.filter(r => r.survey_type === "parent"), [responses]);
  const communityResponses = useMemo(() => responses.filter(r => r.survey_type === "community"), [responses]);

  const countField = (data: SurveyResponse[], field: string) => {
    const counts: Record<string, number> = {};
    data.forEach(r => {
      const val = r.answers?.[field];
      if (typeof val === "string" && val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const countArrayField = (data: SurveyResponse[], field: string) => {
    const counts: Record<string, number> = {};
    data.forEach(r => {
      const val = r.answers?.[field];
      if (Array.isArray(val)) val.forEach((item: string) => { counts[item] = (counts[item] || 0) + 1; });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  const submissionsOverTime = (data: SurveyResponse[]) => {
    const byDate: Record<string, number> = {};
    data.forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      byDate[date] = (byDate[date] || 0) + 1;
    });
    return Object.entries(byDate).map(([date, count]) => ({ date, count }));
  };

  const noData = t("Aucune donnée", "No data");

  const handleDownloadPdf = () => {
    generateSurveyStatsPdf({
      language,
      totalResponses: responses.length,
      childrenCount: childrenResponses.length,
      parentCount: parentResponses.length,
      communityCount: communityResponses.length,
      sections: [
        {
          title: "Digital Safety Survey",
          charts: [
            { title: t("Tranches d'âge", "Age groups"), data: countField(childrenResponses, "age") },
            { title: t("Genre", "Gender"), data: countField(childrenResponses, "gender") },
            { title: t("Plateformes utilisées", "Platforms used"), data: countArrayField(childrenResponses, "platforms") },
            { title: t("Heures par jour", "Hours per day"), data: countField(childrenResponses, "hoursPerDay") },
            { title: t("Moment d'utilisation", "Peak usage time"), data: countField(childrenResponses, "peakUsage") },
            { title: t("Expérience négative en ligne", "Negative experience online"), data: countField(childrenResponses, "negativeExperience") },
            { title: t("Types de comportements négatifs", "Types of negative behaviour"), data: countArrayField(childrenResponses, "negativeTypes") },
            { title: t("Se sent en sécurité en ligne", "Feels safe online"), data: countField(childrenResponses, "feelsSafe") },
            { title: t("Sait à qui parler", "Knows who to talk to"), data: countField(childrenResponses, "knowsWhoToTalkTo") },
            { title: t("Veut apprendre la sécurité en ligne", "Wants to learn online safety"), data: countField(childrenResponses, "wantsToLearn") },
          ],
        },
        {
          title: t("Questionnaire Parents", "Parent Questionnaire"),
          charts: [
            { title: t("Âge de l'enfant", "Child's age"), data: countField(parentResponses, "childAge") },
            { title: t("Remplisseur", "Completing as"), data: countField(parentResponses, "completingAs") },
            { title: t("Plateformes utilisées", "Platforms used"), data: countArrayField(parentResponses, "platforms") },
            { title: t("Heures par jour", "Hours per day"), data: countField(parentResponses, "hoursPerDay") },
            { title: t("Expérience négative", "Negative experience"), data: countField(parentResponses, "negativeExperience") },
            { title: t("Types négatifs", "Negative types"), data: countArrayField(parentResponses, "negativeTypes") },
            { title: t("Impact sur le bien-être", "Wellbeing impact"), data: countField(parentResponses, "wellbeingImpact") },
            { title: t("Signes observés", "Signs noticed"), data: countArrayField(parentResponses, "wellbeingSigns") },
            { title: t("Niveau de confiance", "Confidence level"), data: countField(parentResponses, "confidenceLevel") },
            { title: t("Outils utilisés", "Tools used"), data: countArrayField(parentResponses, "toolsUsed") },
            { title: t("Besoins de soutien", "Support needs"), data: countArrayField(parentResponses, "supportNeeds") },
            { title: t("Intéressé par les ateliers", "Interested in workshops"), data: countField(parentResponses, "interestedInWorkshops") },
            { title: t("Bénéficiaires", "Beneficiaries"), data: countArrayField(parentResponses, "beneficiaries") },
          ],
        },
        {
          title: t("Sondage Communautaire", "Community Survey"),
          charts: [
            { title: t("Tranche d'âge", "Age group"), data: countField(communityResponses, "ageGroup") },
            { title: t("Profil", "Describes as"), data: countField(communityResponses, "describes") },
            { title: t("Niveau de forme", "Fitness level"), data: countField(communityResponses, "fitnessLevel") },
            { title: t("Obstacles", "Barriers"), data: countArrayField(communityResponses, "barriers") },
            { title: t("Facteurs de confort", "Comfort factors"), data: countArrayField(communityResponses, "comfortFactors") },
            { title: t("Le fitness améliore le bien-être", "Fitness improves wellbeing"), data: countField(communityResponses, "fitnessImprovesWellbeing") },
            { title: t("Défis rencontrés", "Challenges"), data: countArrayField(communityResponses, "challenges") },
            { title: t("Activités souhaitées", "Desired activities"), data: countArrayField(communityResponses, "desiredActivities") },
            { title: t("Horaires préférés", "Preferred time"), data: countArrayField(communityResponses, "preferredTime") },
            { title: t("Lieux préférés", "Preferred location"), data: countArrayField(communityResponses, "preferredLocation") },
            { title: t("Intéressé par le programme", "Interested in programme"), data: countField(communityResponses, "interestedInProgramme") },
            { title: t("Facteurs de participation", "Attendance factors"), data: countArrayField(communityResponses, "attendanceFactors") },
            { title: t("Assez d'opportunités", "Enough opportunities"), data: countField(communityResponses, "enoughOpportunities") },
          ],
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="w-full px-4 md:px-8 lg:px-16 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">
              {t("Statistiques des Sondages", "Survey Statistics")}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              {t("Données en temps réel des formulaires soumis", "Real-time data from submitted forms")}
            </p>
            <p className="text-muted-foreground text-xs mt-1">Happiness Comes First</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="gap-1.5 text-xs sm:text-sm">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <LanguageToggle />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg"><BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /></div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{responses.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{t("Total réponses", "Total responses")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-500/10 p-1.5 sm:p-2 rounded-lg"><Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" /></div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{childrenResponses.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Digital Safety</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="bg-green-500/10 p-1.5 sm:p-2 rounded-lg"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{parentResponses.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{t("Parents", "Parents")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="bg-pink-500/10 p-1.5 sm:p-2 rounded-lg"><Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" /></div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{communityResponses.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{t("Communauté", "Community")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions over time */}
        {responses.length > 0 && (
          <Card>
            <CardHeader className="pb-2 sm:pb-4"><CardTitle className="text-xs sm:text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" />{t("Soumissions au fil du temps", "Submissions over time")}</CardTitle></CardHeader>
            <CardContent className="px-1 sm:px-6">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={submissionsOverTime(responses)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#FF1493" strokeWidth={2} dot={{ fill: "#FF1493" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="children" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1">
            <TabsTrigger value="children" className="flex-1 min-w-[90px] text-[10px] sm:text-xs md:text-sm px-2 py-1.5">
              <Shield className="w-3 h-3 mr-1 hidden sm:inline" />Digital Safety
            </TabsTrigger>
            <TabsTrigger value="parent" className="flex-1 min-w-[90px] text-[10px] sm:text-xs md:text-sm px-2 py-1.5">
              <Users className="w-3 h-3 mr-1 hidden sm:inline" />{t("Parents", "Parents")}
            </TabsTrigger>
            <TabsTrigger value="community" className="flex-1 min-w-[90px] text-[10px] sm:text-xs md:text-sm px-2 py-1.5">
              <Heart className="w-3 h-3 mr-1 hidden sm:inline" />{t("Communauté", "Community")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="space-y-4 mt-4">
            {childrenResponses.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{t("Aucune réponse pour le moment", "No responses yet")}</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <PieChartCard title={t("Tranches d'âge", "Age groups")} data={countField(childrenResponses, "age")} noDataText={noData} />
                <PieChartCard title={t("Genre", "Gender")} data={countField(childrenResponses, "gender")} noDataText={noData} />
                <BarChartCard title={t("Plateformes utilisées", "Platforms used")} data={countArrayField(childrenResponses, "platforms")} noDataText={noData} />
                <PieChartCard title={t("Heures par jour", "Hours per day")} data={countField(childrenResponses, "hoursPerDay")} noDataText={noData} />
                <PieChartCard title={t("Moment d'utilisation", "Peak usage time")} data={countField(childrenResponses, "peakUsage")} noDataText={noData} />
                <PieChartCard title={t("Expérience négative en ligne", "Negative experience online")} data={countField(childrenResponses, "negativeExperience")} noDataText={noData} />
                <BarChartCard title={t("Types de comportements négatifs", "Types of negative behaviour")} data={countArrayField(childrenResponses, "negativeTypes")} noDataText={noData} />
                <PieChartCard title={t("Se sent en sécurité en ligne", "Feels safe online")} data={countField(childrenResponses, "feelsSafe")} noDataText={noData} />
                <PieChartCard title={t("Sait à qui parler", "Knows who to talk to")} data={countField(childrenResponses, "knowsWhoToTalkTo")} noDataText={noData} />
                <PieChartCard title={t("Veut apprendre la sécurité en ligne", "Wants to learn online safety")} data={countField(childrenResponses, "wantsToLearn")} noDataText={noData} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="parent" className="space-y-4 mt-4">
            {parentResponses.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{t("Aucune réponse pour le moment", "No responses yet")}</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <PieChartCard title={t("Âge de l'enfant", "Child's age")} data={countField(parentResponses, "childAge")} noDataText={noData} />
                <PieChartCard title={t("Remplisseur", "Completing as")} data={countField(parentResponses, "completingAs")} noDataText={noData} />
                <BarChartCard title={t("Plateformes utilisées", "Platforms used")} data={countArrayField(parentResponses, "platforms")} noDataText={noData} />
                <PieChartCard title={t("Heures par jour", "Hours per day")} data={countField(parentResponses, "hoursPerDay")} noDataText={noData} />
                <PieChartCard title={t("Expérience négative", "Negative experience")} data={countField(parentResponses, "negativeExperience")} noDataText={noData} />
                <BarChartCard title={t("Types négatifs", "Negative types")} data={countArrayField(parentResponses, "negativeTypes")} noDataText={noData} />
                <PieChartCard title={t("Impact sur le bien-être", "Wellbeing impact")} data={countField(parentResponses, "wellbeingImpact")} noDataText={noData} />
                <BarChartCard title={t("Signes observés", "Signs noticed")} data={countArrayField(parentResponses, "wellbeingSigns")} noDataText={noData} />
                <PieChartCard title={t("Niveau de confiance", "Confidence level")} data={countField(parentResponses, "confidenceLevel")} noDataText={noData} />
                <BarChartCard title={t("Outils utilisés", "Tools used")} data={countArrayField(parentResponses, "toolsUsed")} noDataText={noData} />
                <BarChartCard title={t("Besoins de soutien", "Support needs")} data={countArrayField(parentResponses, "supportNeeds")} noDataText={noData} />
                <PieChartCard title={t("Intéressé par les ateliers", "Interested in workshops")} data={countField(parentResponses, "interestedInWorkshops")} noDataText={noData} />
                <BarChartCard title={t("Bénéficiaires", "Beneficiaries")} data={countArrayField(parentResponses, "beneficiaries")} noDataText={noData} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-4 mt-4">
            {communityResponses.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{t("Aucune réponse pour le moment", "No responses yet")}</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <PieChartCard title={t("Tranche d'âge", "Age group")} data={countField(communityResponses, "ageGroup")} noDataText={noData} />
                <PieChartCard title={t("Profil", "Describes as")} data={countField(communityResponses, "describes")} noDataText={noData} />
                <PieChartCard title={t("Niveau de forme", "Fitness level")} data={countField(communityResponses, "fitnessLevel")} noDataText={noData} />
                <BarChartCard title={t("Obstacles", "Barriers")} data={countArrayField(communityResponses, "barriers")} noDataText={noData} />
                <BarChartCard title={t("Facteurs de confort", "Comfort factors")} data={countArrayField(communityResponses, "comfortFactors")} noDataText={noData} />
                <PieChartCard title={t("Le fitness améliore le bien-être", "Fitness improves wellbeing")} data={countField(communityResponses, "fitnessImprovesWellbeing")} noDataText={noData} />
                <BarChartCard title={t("Défis rencontrés", "Challenges")} data={countArrayField(communityResponses, "challenges")} noDataText={noData} />
                <BarChartCard title={t("Activités souhaitées", "Desired activities")} data={countArrayField(communityResponses, "desiredActivities")} noDataText={noData} />
                <BarChartCard title={t("Horaires préférés", "Preferred time")} data={countArrayField(communityResponses, "preferredTime")} noDataText={noData} />
                <BarChartCard title={t("Lieux préférés", "Preferred location")} data={countArrayField(communityResponses, "preferredLocation")} noDataText={noData} />
                <PieChartCard title={t("Intéressé par le programme", "Interested in programme")} data={countField(communityResponses, "interestedInProgramme")} noDataText={noData} />
                <BarChartCard title={t("Facteurs de participation", "Attendance factors")} data={countArrayField(communityResponses, "attendanceFactors")} noDataText={noData} />
                <PieChartCard title={t("Assez d'opportunités", "Enough opportunities")} data={countField(communityResponses, "enoughOpportunities")} noDataText={noData} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default PublicSurveyStats;
