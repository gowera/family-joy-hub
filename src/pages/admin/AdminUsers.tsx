import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Shield, UserPlus, Trash2, Crown, User, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  user_email?: string;
}

const roleLabels: Record<AppRole, { label: string; icon: typeof Crown; color: string }> = {
  admin: { label: "Administrateur", icon: Crown, color: "text-yellow-600" },
  staff: { label: "Staff", icon: User, color: "text-blue-600" },
  viewer: { label: "Lecteur", icon: Eye, color: "text-gray-600" },
};

const AdminUsers = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("staff");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("role");

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setUserRoles(data || []);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create the user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add the role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{ user_id: authData.user.id, role: newUserRole }]);

        if (roleError) throw roleError;

        toast({
          title: "Succès",
          description: `Utilisateur ${newUserEmail} créé avec le rôle ${roleLabels[newUserRole].label}`,
        });

        setIsDialogOpen(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("staff");
        fetchUserRoles();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string, userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas supprimer votre propre rôle",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Voulez-vous vraiment supprimer ce rôle ?")) return;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Rôle supprimé" });
      fetchUserRoles();
    }
  };

  const handleUpdateRole = async (roleId: string, newRole: AppRole, userId: string) => {
    if (userId === user?.id && newRole !== "admin") {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas rétrograder votre propre rôle",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("id", roleId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Rôle mis à jour" });
      fetchUserRoles();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Administrateurs</h1>
            <p className="text-muted-foreground">Gérer les utilisateurs et leurs rôles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="utilisateur@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rôle *</Label>
                  <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as AppRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, { label, icon: Icon, color }]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${color}`} />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p><strong>Admin:</strong> Accès complet, peut gérer les utilisateurs</p>
                  <p><strong>Staff:</strong> Peut gérer les enfants, parents, inscriptions</p>
                  <p><strong>Lecteur:</strong> Peut uniquement consulter les données</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer l'utilisateur"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Utilisateurs avec accès
            </CardTitle>
            <CardDescription>
              Liste des utilisateurs ayant accès au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.map((userRole) => {
                  const roleInfo = roleLabels[userRole.role];
                  const Icon = roleInfo.icon;
                  const isCurrentUser = userRole.user_id === user?.id;
                  
                  return (
                    <TableRow key={userRole.id}>
                      <TableCell className="font-mono text-sm">
                        {userRole.user_id.slice(0, 8)}...
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Vous
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={userRole.role}
                          onValueChange={(v) => handleUpdateRole(userRole.id, v as AppRole, userRole.user_id)}
                          disabled={isCurrentUser}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${roleInfo.color}`} />
                                {roleInfo.label}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roleLabels).map(([value, { label, icon: RoleIcon, color }]) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <RoleIcon className={`w-4 h-4 ${color}`} />
                                  {label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRole(userRole.id, userRole.user_id)}
                          disabled={isCurrentUser}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {userRoles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Aucun utilisateur trouvé
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

export default AdminUsers;
