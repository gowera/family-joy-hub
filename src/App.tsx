import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/hooks/useLanguage";
import useWakeBackend from "@/hooks/useWakeBackend";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import KidsHub from "./pages/KidsHub";
import Impact from "./pages/Impact";
import Safeguarding from "./pages/Safeguarding";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Contact from "./pages/Contact";
import SurveyChildren from "./pages/SurveyChildren";
import SurveyParent from "./pages/SurveyParent";
import SurveyCommunity from "./pages/SurveyCommunity";
import SurveyUnityFeedback from "./pages/SurveyUnityFeedback";
import UnityCircle from "./pages/UnityCircle";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Children from "./pages/admin/Children";
import Parents from "./pages/admin/Parents";
import Enrollments from "./pages/admin/Enrollments";
import Payments from "./pages/admin/Payments";
import Attendance from "./pages/admin/Attendance";
import Documents from "./pages/admin/Documents";
import Testimonials from "./pages/admin/Testimonials";
import AdminUsers from "./pages/admin/AdminUsers";
import SurveyStats from "./pages/admin/SurveyStats";
import PublicSurveyStats from "./pages/PublicSurveyStats";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import JobOffers from "./pages/JobOffers";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useWakeBackend();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/kids-hub" element={<KidsHub />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/safeguarding" element={<Safeguarding />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/survey/children" element={<SurveyChildren />} />
        <Route path="/survey/parents" element={<SurveyParent />} />
        <Route path="/survey/community" element={<SurveyCommunity />} />
        <Route path="/unity-circle" element={<UnityCircle />} />
        <Route path="/survey-stats" element={<PublicSurveyStats />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/offers" element={<JobOffers />} />
        <Route path="/offers/:slug" element={<NewsArticle />} />
        <Route path="/poste/:slug" element={<NewsArticle />} />
        <Route path="/jobs" element={<JobOffers />} />
        <Route path="/jobs/:slug" element={<NewsArticle />} />
        <Route path="/v/:videoId" element={<Videos />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/children" element={<Children />} />
        <Route path="/admin/parents" element={<Parents />} />
        <Route path="/admin/enrollments" element={<Enrollments />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/documents" element={<Documents />} />
        <Route path="/admin/testimonials" element={<Testimonials />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/survey-stats" element={<SurveyStats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
