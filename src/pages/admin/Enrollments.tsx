import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Enrollment {
  id: string;
  child_id: string;
  program_id: string;
  status: string;
  enrollment_date: string;
  start_date: string;
  end_date: string | null;
  days_attending: string[] | null;
  notes: string | null;
  children?: { id: string; full_name: string; parents?: { full_name: string } };
  programs?: { id: string; name: string };
}

interface Child {
  id: string;
  full_name: string;
}

interface Program {
  id: string;
  name: string;
}

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState({
    child_id: "",
    program_id: "",
    status: "active",
    start_date: "",
    end_date: "",
    days_attending: [] as string[],
    notes: "",
  });
  const { toast } = useToast();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const statuses = [
    { value: "active", label: "Actif" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
    { value: "waitlist", label: "Liste d'attente" },
  ];

  useEffect(() => {
    fetchEnrollments();
    fetchChildren();
    fetchPrograms();
  }, []);

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        *,
        children (id, full_name, parents (full_name)),
        programs (id, name)
      `)
      .order("enrollment_date", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setEnrollments(data || []);
    }
  };

  const fetchChildren = async () => {
    const { data } = await supabase.from("children").select("id, full_name").order("full_name");
    if (data) setChildren(data);
  };

  const fetchPrograms = async () => {
    const { data } = await supabase.from("programs").select("id, name").order("name");
    if (data) setPrograms(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const enrollmentData = {
      child_id: formData.child_id,
      program_id: formData.program_id,
      status: formData.status as any,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      days_attending: formData.days_attending.length > 0 ? formData.days_attending : null,
      notes: formData.notes || null,
    };

    if (editingEnrollment) {
      const { error } = await supabase
        .from("enrollments")
        .update(enrollmentData)
        .eq("id", editingEnrollment.id);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Inscription mise à jour" });
        setIsDialogOpen(false);
        fetchEnrollments();
      }
    } else {
      const { error } = await supabase.from("enrollments").insert([enrollmentData]);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Inscription ajoutée" });
        setIsDialogOpen(false);
        fetchEnrollments();
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette inscription ?")) return;

    const { error } = await supabase.from("enrollments").delete().eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Inscription supprimée" });
      fetchEnrollments();
    }
  };

  const openEditDialog = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setFormData({
      child_id: enrollment.child_id,
      program_id: enrollment.program_id,
      status: enrollment.status,
      start_date: enrollment.start_date,
      end_date: enrollment.end_date || "",
      days_attending: enrollment.days_attending || [],
      notes: enrollment.notes || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEnrollment(null);
    setFormData({
      child_id: "",
      program_id: "",
      status: "active",
      start_date: "",
      end_date: "",
      days_attending: [],
      notes: "",
    });
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days_attending: prev.days_attending.includes(day)
        ? prev.days_attending.filter((d) => d !== day)
        : [...prev.days_attending, day],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "waitlist": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.children?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.programs?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Inscriptions</h1>
            <p className="text-muted-foreground">Gérer les inscriptions aux programmes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle inscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingEnrollment ? "Modifier l'inscription" : "Nouvelle inscription"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Enfant *</Label>
                  <Select
                    value={formData.child_id}
                    onValueChange={(value) => setFormData({ ...formData, child_id: value })}
                    required
                  >
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
                </div>

                <div className="space-y-2">
                  <Label>Programme *</Label>
                  <Select
                    value={formData.program_id}
                    onValueChange={(value) => setFormData({ ...formData, program_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un programme" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de début *</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Jours de présence</Label>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={formData.days_attending.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingEnrollment ? "Mettre à jour" : "Inscrire"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enfant</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead>Jours</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">{enrollment.children?.full_name}</TableCell>
                    <TableCell>{enrollment.programs?.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(enrollment.status)}`}>
                        {statuses.find(s => s.value === enrollment.status)?.label}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(enrollment.start_date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {enrollment.days_attending?.map(d => d.slice(0, 3)).join(", ") || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(enrollment)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(enrollment.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEnrollments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucune inscription trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Enrollments;
