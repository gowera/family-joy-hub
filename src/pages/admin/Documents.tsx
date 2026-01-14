import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Users, Baby, Calendar, ClipboardCheck, Heart, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { differenceInYears } from "date-fns";
import {
  generateChildrenListPDF,
  generateContractPDF,
  generateImpactReportPDF,
} from "@/lib/pdfGenerator";

interface Child {
  id: string;
  full_name: string;
  date_of_birth: string;
  allergies: string | null;
  medical_conditions: string | null;
  medication: string | null;
  special_needs: string | null;
  photo_consent: boolean;
  parents?: {
    full_name: string;
    email: string;
    phone: string;
    address: string | null;
    emergency_contact: string | null;
    emergency_phone: string | null;
  };
}

interface Enrollment {
  id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  days_attending: string[] | null;
  children?: { full_name: string };
  programs?: { name: string };
}

const Documents = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [childrenRes, enrollmentsRes] = await Promise.all([
      supabase.from("children").select(`*, parents (*)`).order("full_name"),
      supabase.from("enrollments").select(`*, children (full_name), programs (name)`).order("start_date"),
    ]);

    if (childrenRes.data) setChildren(childrenRes.data);
    if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data);
  };

  const handleGenerateChildrenList = () => {
    generateChildrenListPDF(children);
    toast({ title: "PDF généré", description: "Liste des enfants téléchargée" });
  };

  const handleGenerateContract = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      generateContractPDF(child);
      toast({ title: "PDF généré", description: `Contrat pour ${child.full_name} téléchargé` });
    }
  };

  const handleGenerateImpactReport = () => {
    generateImpactReportPDF(children, enrollments);
    toast({ title: "PDF généré", description: "Rapport d'impact téléchargé" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Documents</h1>
          <p className="text-muted-foreground">Générer et télécharger les documents PDF de l'organisation</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-primary" />
                Liste des Enfants
              </CardTitle>
              <CardDescription>
                Liste complète de tous les enfants inscrits avec leurs informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateChildrenList} className="w-full">
                <FileDown className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Rapport d'Impact
              </CardTitle>
              <CardDescription>
                Rapport complet avec témoignages et statistiques du programme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateImpactReport} className="w-full">
                <FileDown className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Contrats Individuels
              </CardTitle>
              <CardDescription>
                Générer un contrat d'inscription pour un enfant spécifique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={handleGenerateContract}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un enfant" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Baby className="w-8 h-8 text-pink-500" />
                <div>
                  <div className="text-2xl font-bold">{children.length}</div>
                  <div className="text-sm text-muted-foreground">Enfants</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{new Set(children.map(c => c.parents?.full_name)).size}</div>
                  <div className="text-sm text-muted-foreground">Familles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{enrollments.filter(e => e.status === 'active').length}</div>
                  <div className="text-sm text-muted-foreground">Inscriptions actives</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <ClipboardCheck className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{children.filter(c => c.photo_consent).length}</div>
                  <div className="text-sm text-muted-foreground">Consentements photo</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Documents;
