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

interface Payment {
  id: string;
  enrollment_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date: string | null;
  reference: string | null;
  notes: string | null;
  enrollments?: {
    children?: { full_name: string };
    programs?: { name: string };
  };
}

interface Enrollment {
  id: string;
  children?: { full_name: string };
  programs?: { name: string };
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    enrollment_id: "",
    amount: "",
    payment_method: "bank_transfer",
    payment_status: "pending",
    payment_date: "",
    reference: "",
    notes: "",
  });
  const { toast } = useToast();

  const paymentMethods = [
    { value: "bank_transfer", label: "Virement bancaire" },
    { value: "card", label: "Carte" },
    { value: "cash", label: "Espèces" },
    { value: "other", label: "Autre" },
  ];

  const paymentStatuses = [
    { value: "pending", label: "En attente" },
    { value: "paid", label: "Payé" },
    { value: "partial", label: "Partiel" },
    { value: "refunded", label: "Remboursé" },
  ];

  useEffect(() => {
    fetchPayments();
    fetchEnrollments();
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        enrollments (
          children (full_name),
          programs (name)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setPayments(data || []);
    }
  };

  const fetchEnrollments = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select(`
        id,
        children (full_name),
        programs (name)
      `)
      .eq("status", "active");
    if (data) setEnrollments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData = {
      enrollment_id: formData.enrollment_id,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method as any,
      payment_status: formData.payment_status as any,
      payment_date: formData.payment_date || null,
      reference: formData.reference || null,
      notes: formData.notes || null,
    };

    if (editingPayment) {
      const { error } = await supabase
        .from("payments")
        .update(paymentData)
        .eq("id", editingPayment.id);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Paiement mis à jour" });
        setIsDialogOpen(false);
        fetchPayments();
      }
    } else {
      const { error } = await supabase.from("payments").insert([paymentData]);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Paiement ajouté" });
        setIsDialogOpen(false);
        fetchPayments();
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce paiement ?")) return;

    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Paiement supprimé" });
      fetchPayments();
    }
  };

  const openEditDialog = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      enrollment_id: payment.enrollment_id,
      amount: payment.amount.toString(),
      payment_method: payment.payment_method,
      payment_status: payment.payment_status,
      payment_date: payment.payment_date || "",
      reference: payment.reference || "",
      notes: payment.notes || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPayment(null);
    setFormData({
      enrollment_id: "",
      amount: "",
      payment_method: "bank_transfer",
      payment_status: "pending",
      payment_date: "",
      reference: "",
      notes: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "partial": return "bg-orange-100 text-orange-700";
      case "refunded": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.enrollments?.children?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = payments
    .filter(p => p.payment_status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.payment_status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Paiements</h1>
            <p className="text-muted-foreground">Gérer les paiements des inscriptions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingPayment ? "Modifier le paiement" : "Nouveau paiement"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Inscription *</Label>
                  <Select
                    value={formData.enrollment_id}
                    onValueChange={(value) => setFormData({ ...formData, enrollment_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une inscription" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollments.map((enrollment) => (
                        <SelectItem key={enrollment.id} value={enrollment.id}>
                          {enrollment.children?.full_name} - {enrollment.programs?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant (£) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de paiement</Label>
                    <Input
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Méthode</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select
                      value={formData.payment_status}
                      onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Référence</Label>
                  <Input
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Numéro de transaction..."
                  />
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
                    {editingPayment ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">£{totalPaid.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Total payé</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">£{totalPending.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
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
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.enrollments?.children?.full_name}
                    </TableCell>
                    <TableCell>{payment.enrollments?.programs?.name}</TableCell>
                    <TableCell>£{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {paymentMethods.find(m => m.value === payment.payment_method)?.label}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.payment_status)}`}>
                        {paymentStatuses.find(s => s.value === payment.payment_status)?.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.payment_date ? format(new Date(payment.payment_date), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(payment)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(payment.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Aucun paiement trouvé
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

export default Payments;
