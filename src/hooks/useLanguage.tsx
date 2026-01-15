import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Dashboard
    "dashboard.title": "Tableau de Bord",
    "dashboard.subtitle": "Vue d'ensemble de Happiness Comes First",
    "dashboard.children": "Enfants inscrits",
    "dashboard.parents": "Parents",
    "dashboard.activeEnrollments": "Inscriptions actives",
    "dashboard.pendingPayments": "Paiements en attente",
    "dashboard.totalRevenue": "Revenus totaux",
    "dashboard.collected": "Dont {amount} encaissés",
    "dashboard.impactStatement": "Déclaration d'impact",
    "dashboard.impactText": "Le Kids Hub d'été Happiness Comes First a soutenu avec succès les enfants et les familles en offrant un environnement sûr, inclusif et joyeux.",
    "dashboard.enrollmentsByStatus": "Inscriptions par statut",
    "dashboard.ageDistribution": "Distribution par âge",
    "dashboard.paymentsByMethod": "Paiements par méthode",
    "dashboard.programHighlights": "Points forts du programme",
    "dashboard.highlight1": "Amélioration de la confiance et de la communication",
    "dashboard.highlight2": "Inclusif pour les enfants neurodivers",
    "dashboard.highlight3": "Environnement sûr, bienveillant et structuré",
    "dashboard.highlight4": "Cohésion communautaire entre les cultures",
    "dashboard.highlight5": "Activité physique et engagement créatif",
    // Enrollment statuses
    "status.active": "Actifs",
    "status.completed": "Terminés",
    "status.cancelled": "Annulés",
    "status.waitlist": "Liste d'attente",
    // Age groups
    "age.0-3": "0-3 ans",
    "age.4-6": "4-6 ans",
    "age.7-9": "7-9 ans",
    "age.10-12": "10-12 ans",
    "age.13+": "13+ ans",
    // Payment methods
    "payment.bankTransfer": "Virement",
    "payment.card": "Carte",
    "payment.cash": "Espèces",
    "payment.other": "Autre",
    "payment.amount": "Montant",
  },
  en: {
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of Happiness Comes First",
    "dashboard.children": "Enrolled Children",
    "dashboard.parents": "Parents",
    "dashboard.activeEnrollments": "Active Enrollments",
    "dashboard.pendingPayments": "Pending Payments",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.collected": "Including {amount} collected",
    "dashboard.impactStatement": "Impact Statement",
    "dashboard.impactText": "The Happiness Comes First Summer Kids Hub successfully supported children and families by providing a safe, inclusive, and joyful environment.",
    "dashboard.enrollmentsByStatus": "Enrollments by Status",
    "dashboard.ageDistribution": "Age Distribution",
    "dashboard.paymentsByMethod": "Payments by Method",
    "dashboard.programHighlights": "Program Highlights",
    "dashboard.highlight1": "Improved confidence & communication",
    "dashboard.highlight2": "Inclusive of neurodiverse children",
    "dashboard.highlight3": "Safe, caring & structured environment",
    "dashboard.highlight4": "Community cohesion across cultures",
    "dashboard.highlight5": "Physical activity & creative engagement",
    // Enrollment statuses
    "status.active": "Active",
    "status.completed": "Completed",
    "status.cancelled": "Cancelled",
    "status.waitlist": "Waitlist",
    // Age groups
    "age.0-3": "0-3 years",
    "age.4-6": "4-6 years",
    "age.7-9": "7-9 years",
    "age.10-12": "10-12 years",
    "age.13+": "13+ years",
    // Payment methods
    "payment.bankTransfer": "Bank Transfer",
    "payment.card": "Card",
    "payment.cash": "Cash",
    "payment.other": "Other",
    "payment.amount": "Amount",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
