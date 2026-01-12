import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  parent_id: string;
  parents?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
}

interface Parent {
  id: string;
  full_name: string;
  email: string;
}

const Children = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    allergies: "",
    medical_conditions: "",
    medication: "",
    special_needs: "",
    photo_consent: false,
    parent_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchChildren();
    fetchParents();
  }, []);

  const fetchChildren = async () => {
    const { data, error } = await supabase
      .from("children")
      .select(`
        *,
        parents (id, full_name, email, phone)
      `)
      .order("full_name");

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setChildren(data || []);
    }
  };

  const fetchParents = async () => {
    const { data, error } = await supabase
      .from("parents")
      .select("id, full_name, email")
      .order("full_name");

    if (!error && data) {
      setParents(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const childData = {
      ...formData,
      allergies: formData.allergies || null,
      medical_conditions: formData.medical_conditions || null,
      medication: formData.medication || null,
      special_needs: formData.special_needs || null,
    };

    if (editingChild) {
      const { error } = await supabase
        .from("children")
        .update(childData)
        .eq("id", editingChild.id);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Enfant mis à jour" });
        setIsDialogOpen(false);
        fetchChildren();
      }
    } else {
      const { error } = await supabase.from("children").insert([childData]);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Enfant ajouté" });
        setIsDialogOpen(false);
        fetchChildren();
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet enfant ?")) return;

    const { error } = await supabase.from("children").delete().eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Enfant supprimé" });
      fetchChildren();
    }
  };

  const openEditDialog = (child: Child) => {
    setEditingChild(child);
    setFormData({
      full_name: child.full_name,
      date_of_birth: child.date_of_birth,
      allergies: child.allergies || "",
      medical_conditions: child.medical_conditions || "",
      medication: child.medication || "",
      special_needs: child.special_needs || "",
      photo_consent: child.photo_consent,
      parent_id: child.parent_id,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingChild(null);
    setFormData({
      full_name: "",
      date_of_birth: "",
      allergies: "",
      medical_conditions: "",
      medication: "",
      special_needs: "",
      photo_consent: false,
      parent_id: "",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  const filteredChildren = children.filter(
    (child) =>
      child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parents?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Enfants</h1>
            <p className="text-muted-foreground">Gérer les enfants inscrits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un enfant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingChild ? "Modifier l'enfant" : "Ajouter un enfant"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date de naissance *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent *</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.full_name} ({parent.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Listez les allergies connues..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical_conditions">Conditions médicales</Label>
                  <Textarea
                    id="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                    placeholder="Conditions médicales à signaler..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medication">Médicaments</Label>
                  <Textarea
                    id="medication"
                    value={formData.medication}
                    onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                    placeholder="Médicaments pris régulièrement..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_needs">Besoins spéciaux</Label>
                  <Textarea
                    id="special_needs"
                    value={formData.special_needs}
                    onChange={(e) => setFormData({ ...formData, special_needs: e.target.value })}
                    placeholder="Besoins spéciaux ou adaptations nécessaires..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="photo_consent"
                    checked={formData.photo_consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, photo_consent: checked as boolean })}
                  />
                  <Label htmlFor="photo_consent">Consentement photo/vidéo</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingChild ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Photo Consent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell className="font-medium">{child.full_name}</TableCell>
                    <TableCell>{calculateAge(child.date_of_birth)} ans</TableCell>
                    <TableCell>{child.parents?.full_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{child.parents?.email}</div>
                        <div className="text-muted-foreground">{child.parents?.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${child.photo_consent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {child.photo_consent ? "Oui" : "Non"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(child)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(child.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredChildren.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucun enfant trouvé
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

export default Children;
