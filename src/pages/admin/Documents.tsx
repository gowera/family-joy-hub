import { useEffect, useState, useRef } from "react";
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
import { FileText, Download, Users, Baby, Calendar, CreditCard, ClipboardCheck, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInYears } from "date-fns";

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

interface Program {
  id: string;
  name: string;
}

const Documents = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [childrenRes, enrollmentsRes, programsRes] = await Promise.all([
      supabase.from("children").select(`*, parents (*)`).order("full_name"),
      supabase.from("enrollments").select(`*, children (full_name), programs (name)`).order("start_date"),
      supabase.from("programs").select("id, name"),
    ]);

    if (childrenRes.data) setChildren(childrenRes.data);
    if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data);
    if (programsRes.data) setPrograms(programsRes.data);
  };

  const calculateAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  const generateChildrenList = () => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Liste des Enfants - Happiness Comes First</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #DB2777; text-align: center; }
    h2 { color: #333; border-bottom: 2px solid #DB2777; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #FDF2F8; color: #DB2777; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #DB2777; }
    .date { color: #666; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">❤ Happiness Comes First</div>
    <div class="date">Généré le ${format(new Date(), "dd/MM/yyyy")}</div>
  </div>
  <h1>Liste des Enfants Inscrits</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Nom de l'Enfant</th>
        <th>Âge</th>
        <th>Parent/Tuteur</th>
        <th>Contact</th>
        <th>Urgence</th>
        <th>Photo Consent</th>
      </tr>
    </thead>
    <tbody>
      ${children.map((child, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${child.full_name}</strong></td>
          <td>${calculateAge(child.date_of_birth)} ans</td>
          <td>${child.parents?.full_name || '-'}</td>
          <td>
            ${child.parents?.email || ''}<br/>
            ${child.parents?.phone || ''}
          </td>
          <td>
            ${child.parents?.emergency_contact || '-'}<br/>
            ${child.parents?.emergency_phone || ''}
          </td>
          <td>${child.photo_consent ? '✓ Oui' : '✗ Non'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="footer">
    <p>Happiness Comes First - Where Everyone Belongs</p>
    <p>Document confidentiel - Ne pas partager</p>
  </div>
</body>
</html>`;

    downloadDocument(content, "liste-enfants.html");
  };

  const generateEnrollmentContract = (child: Child) => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Contrat d'Inscription - ${child.full_name}</title>
  <style>
    body { font-family: Georgia, serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #DB2777; text-align: center; border-bottom: 3px solid #DB2777; padding-bottom: 20px; }
    h2 { color: #333; margin-top: 30px; }
    .section { margin: 20px 0; padding: 20px; background: #FDF2F8; border-radius: 8px; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .value { margin-left: 10px; }
    .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; border-top: 1px solid #333; padding-top: 10px; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo-text { font-size: 28px; color: #DB2777; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="logo">
    <div class="logo-text">❤ Happiness Comes First</div>
    <p>Where Everyone Belongs</p>
  </div>

  <h1>CONTRAT D'INSCRIPTION</h1>

  <div class="section">
    <h2>Informations de l'Enfant</h2>
    <div class="field"><span class="label">Nom complet:</span><span class="value">${child.full_name}</span></div>
    <div class="field"><span class="label">Date de naissance:</span><span class="value">${format(new Date(child.date_of_birth), "dd/MM/yyyy")}</span></div>
    <div class="field"><span class="label">Âge:</span><span class="value">${calculateAge(child.date_of_birth)} ans</span></div>
  </div>

  <div class="section">
    <h2>Informations du Parent/Tuteur</h2>
    <div class="field"><span class="label">Nom:</span><span class="value">${child.parents?.full_name || '-'}</span></div>
    <div class="field"><span class="label">Email:</span><span class="value">${child.parents?.email || '-'}</span></div>
    <div class="field"><span class="label">Téléphone:</span><span class="value">${child.parents?.phone || '-'}</span></div>
    <div class="field"><span class="label">Adresse:</span><span class="value">${child.parents?.address || '-'}</span></div>
    <div class="field"><span class="label">Contact d'urgence:</span><span class="value">${child.parents?.emergency_contact || '-'} - ${child.parents?.emergency_phone || '-'}</span></div>
  </div>

  <div class="section">
    <h2>Informations Médicales</h2>
    <div class="field"><span class="label">Allergies:</span><span class="value">${child.allergies || 'Aucune signalée'}</span></div>
    <div class="field"><span class="label">Conditions médicales:</span><span class="value">${child.medical_conditions || 'Aucune signalée'}</span></div>
    <div class="field"><span class="label">Médicaments:</span><span class="value">${child.medication || 'Aucun'}</span></div>
    <div class="field"><span class="label">Besoins spéciaux:</span><span class="value">${child.special_needs || 'Aucun'}</span></div>
  </div>

  <div class="section">
    <h2>Consentements</h2>
    <div class="field"><span class="label">Consentement Photo/Vidéo:</span><span class="value">${child.photo_consent ? '✓ Accordé' : '✗ Non accordé'}</span></div>
  </div>

  <div class="section">
    <h2>Conditions Générales</h2>
    <p>En signant ce contrat, je confirme que:</p>
    <ul>
      <li>Les informations fournies sont exactes et complètes</li>
      <li>J'autorise Happiness Comes First à prendre soin de mon enfant</li>
      <li>Je m'engage à respecter les règles du programme</li>
      <li>Je comprends et accepte la politique de safeguarding</li>
    </ul>
  </div>

  <div class="signature-area">
    <div class="signature-box">
      <p>Signature du Parent/Tuteur</p>
      <p>Date: _______________</p>
    </div>
    <div class="signature-box">
      <p>Pour Happiness Comes First</p>
      <p>Date: _______________</p>
    </div>
  </div>

  <div class="footer">
    <p>Happiness Comes First - Summer Kids Hub</p>
    <p>Document généré le ${format(new Date(), "dd/MM/yyyy à HH:mm")}</p>
  </div>
</body>
</html>`;

    downloadDocument(content, `contrat-${child.full_name.replace(/\s+/g, '-').toLowerCase()}.html`);
  };

  const generateImpactReport = () => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Impact Report - Happiness Comes First Summer Kids Hub</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #DB2777; text-align: center; }
    h2 { color: #DB2777; border-left: 4px solid #DB2777; padding-left: 15px; margin-top: 40px; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
    .stat-box { background: #FDF2F8; padding: 20px; border-radius: 10px; text-align: center; }
    .stat-number { font-size: 36px; font-weight: bold; color: #DB2777; }
    .stat-label { color: #666; font-size: 14px; }
    .quote { background: #f5f5f5; padding: 20px; border-left: 4px solid #DB2777; margin: 20px 0; font-style: italic; }
    .quote-author { text-align: right; color: #666; margin-top: 10px; }
    .highlight { background: linear-gradient(to right, #FDF2F8, white); padding: 20px; border-radius: 10px; margin: 20px 0; }
    .logo { text-align: center; margin-bottom: 40px; }
    .logo-text { font-size: 32px; color: #DB2777; }
    ul { list-style-type: none; padding: 0; }
    ul li { padding: 10px 0; padding-left: 30px; position: relative; }
    ul li:before { content: "❤"; position: absolute; left: 0; color: #DB2777; }
    @media print { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
  </style>
</head>
<body>
  <div class="logo">
    <div class="logo-text">❤ Happiness Comes First</div>
    <p>Summer Kids Hub - Impact Report</p>
  </div>

  <h1>Summer Kids Hub Impact & Testimonials</h1>

  <div class="stat-grid">
    <div class="stat-box">
      <div class="stat-number">${children.length}</div>
      <div class="stat-label">Children Registered</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${new Set(children.map(c => c.parents?.full_name)).size}</div>
      <div class="stat-label">Families Supported</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${enrollments.filter(e => e.status === 'active').length}</div>
      <div class="stat-label">Active Enrollments</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">100%</div>
      <div class="stat-label">Satisfaction Rate</div>
    </div>
  </div>

  <h2>👨‍👩‍👧 Parent Feedback</h2>
  <div class="quote">
    "My child looked forward to every session. The activities were inclusive, well organised, and made my child feel confident and happy."
  </div>
  <div class="quote">
    "As a parent, I felt reassured knowing my child was in a safe, caring, and structured environment. The staff were approachable and supportive."
  </div>
  <div class="quote">
    "The Pink and Bleu Kids Hub was a lifeline during the summer holidays. It gave my child routine, social interaction, and joy. Although there were only three sessions this summer due to limited funding, Pink Linda reassured us that with more funding, future summer programmes will offer more sessions."
  </div>
  <div class="quote">
    "I appreciated how welcoming the space was for families from different backgrounds. My child felt included and valued."
  </div>

  <h2>🧒 Children's Feedback</h2>
  <p>Children were grouped by age to ensure activities were suitable and enjoyable for everyone. Game instructions were clearly explained, and children were supported to understand the rules before taking part.</p>
  <div class="highlight">
    <ul>
      <li>"I liked the games and playing with new friends."</li>
      <li>"The music and movement were my favourite parts."</li>
      <li>"I felt happy coming here every day."</li>
      <li>"I liked that everyone was kind and helped each other."</li>
    </ul>
  </div>

  <h2>🤝 Community Feedback</h2>
  <div class="quote">
    "The Summer Pink and Bleu Kids Hub provided a much-needed safe and positive space for children during the school holidays. More sessions like this are needed every summer."
  </div>
  <div class="quote">
    "The programme supported community cohesion by bringing together families from different cultures and backgrounds."
  </div>

  <h2>🧠 Wellbeing & Inclusion</h2>
  <div class="highlight">
    <p><strong>Happiness Comes First Observations:</strong></p>
    <ul>
      <li>Children showed improved confidence, communication, and emotional expression over the course of the programme.</li>
      <li>The hub was inclusive of neurodiverse children and children with additional needs.</li>
      <li>The relaxed and supportive environment helped children feel calm, safe, and able to participate at their own pace.</li>
    </ul>
  </div>

  <h2>🏃 Physical Activity & Engagement</h2>
  <ul>
    <li>Children were active, engaged, and motivated throughout the sessions.</li>
    <li>Activities were adapted for different age groups, supported by a structured game booklet.</li>
    <li>The mix of physical play, creative activities, and music kept children focused and excited.</li>
    <li>Parents noticed improved energy levels and positive behaviour at home.</li>
  </ul>

  <h2>📊 Delivery & Organisation</h2>
  <ul>
    <li>Attendance records and safeguarding procedures were clearly in place.</li>
    <li>Emergency contact details were collected and stored appropriately.</li>
    <li>Sessions were well structured, with flexibility to meet children's individual needs.</li>
  </ul>

  <div class="highlight" style="margin-top: 40px; text-align: center;">
    <h2>Overall Impact Statement</h2>
    <p>The Happiness Comes First Summer Kids Hub, delivered at St Francis Community Hall, successfully supported children and families during the school holidays by providing a safe, inclusive, and joyful environment. The programme promoted wellbeing, physical activity, creativity, and social connection. Families reported high satisfaction, and children demonstrated increased confidence, happiness, and engagement. With additional funding, the programme has strong potential to expand and deliver more sessions during future school holidays.</p>
  </div>

  <div style="text-align: center; margin-top: 50px; color: #666;">
    <p>Report generated on ${format(new Date(), "dd MMMM yyyy")}</p>
    <p>❤ Happiness Comes First - Where Everyone Belongs</p>
  </div>
</body>
</html>`;

    downloadDocument(content, "impact-report.html");
  };

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Téléchargement", description: `${filename} téléchargé` });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Documents</h1>
          <p className="text-muted-foreground">Générer et télécharger les documents de l'organisation</p>
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
              <Button onClick={generateChildrenList} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
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
              <Button onClick={generateImpactReport} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
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
              <Select onValueChange={(value) => {
                const child = children.find(c => c.id === value);
                if (child) generateEnrollmentContract(child);
              }}>
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
