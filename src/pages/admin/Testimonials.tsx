import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Pencil, Trash2, Star, Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  category: string;
  content: string;
  author_name: string | null;
  is_featured: boolean;
  created_at: string;
}

const categories = [
  { value: "parent", label: "👨‍👩‍👧 Parents", color: "bg-pink-100 text-pink-700" },
  { value: "child", label: "🧒 Enfants", color: "bg-blue-100 text-blue-700" },
  { value: "community", label: "🤝 Communauté", color: "bg-green-100 text-green-700" },
  { value: "wellbeing", label: "🧠 Bien-être", color: "bg-purple-100 text-purple-700" },
  { value: "physical", label: "🏃 Activité physique", color: "bg-orange-100 text-orange-700" },
  { value: "organisation", label: "📊 Organisation", color: "bg-gray-100 text-gray-700" },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    category: "parent",
    content: "",
    author_name: "",
    is_featured: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setTestimonials(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const testimonialData = {
      ...formData,
      author_name: formData.author_name || null,
    };

    if (editingTestimonial) {
      const { error } = await supabase
        .from("testimonials")
        .update(testimonialData)
        .eq("id", editingTestimonial.id);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Témoignage mis à jour" });
        setIsDialogOpen(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from("testimonials").insert([testimonialData]);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Témoignage ajouté" });
        setIsDialogOpen(false);
        fetchTestimonials();
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce témoignage ?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Témoignage supprimé" });
      fetchTestimonials();
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_featured: !currentValue })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      fetchTestimonials();
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      category: testimonial.category,
      content: testimonial.content,
      author_name: testimonial.author_name || "",
      is_featured: testimonial.is_featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      category: "parent",
      content: "",
      author_name: "",
      is_featured: false,
    });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue) || categories[0];
  };

  const filteredTestimonials = selectedCategory === "all"
    ? testimonials
    : testimonials.filter(t => t.category === selectedCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Témoignages</h1>
            <p className="text-muted-foreground">Gérer les témoignages et retours d'expérience</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un témoignage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? "Modifier le témoignage" : "Ajouter un témoignage"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Témoignage *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Le contenu du témoignage..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auteur (optionnel)</Label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Nom de l'auteur..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                  />
                  <Label htmlFor="is_featured">Mettre en avant</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingTestimonial ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            Tous
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredTestimonials.map((testimonial) => {
            const catInfo = getCategoryInfo(testimonial.category);
            return (
              <Card key={testimonial.id} className={`relative ${testimonial.is_featured ? 'ring-2 ring-primary' : ''}`}>
                {testimonial.is_featured && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}>
                        <Star className={`w-4 h-4 ${testimonial.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(testimonial)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(testimonial.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Quote className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground italic">{testimonial.content}</p>
                  </div>
                  {testimonial.author_name && (
                    <p className="text-sm font-medium mt-3 text-right">— {testimonial.author_name}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTestimonials.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun témoignage trouvé dans cette catégorie
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Testimonials;
