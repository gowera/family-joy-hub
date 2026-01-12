import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Check, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Enrollment {
  id: string;
  children?: { full_name: string };
  programs?: { id: string; name: string };
}

interface AttendanceRecord {
  enrollment_id: string;
  present: boolean;
}

interface Program {
  id: string;
  name: string;
}

const Attendance = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [existingRecords, setExistingRecords] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchEnrollments();
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgram && selectedDate) {
      fetchAttendance();
    }
  }, [selectedProgram, selectedDate]);

  const fetchPrograms = async () => {
    const { data } = await supabase.from("programs").select("id, name").order("name");
    if (data) {
      setPrograms(data);
      if (data.length > 0) setSelectedProgram(data[0].id);
    }
  };

  const fetchEnrollments = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select(`
        id,
        children (full_name),
        programs (id, name)
      `)
      .eq("program_id", selectedProgram)
      .eq("status", "active")
      .order("created_at");

    if (data) setEnrollments(data);
  };

  const fetchAttendance = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("id, enrollment_id, present")
      .eq("session_date", selectedDate);

    if (data) {
      const attendanceMap: Record<string, boolean> = {};
      const recordsMap: Record<string, string> = {};
      data.forEach((record) => {
        attendanceMap[record.enrollment_id] = record.present;
        recordsMap[record.enrollment_id] = record.id;
      });
      setAttendance(attendanceMap);
      setExistingRecords(recordsMap);
    }
  };

  const handleAttendanceChange = (enrollmentId: string, present: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [enrollmentId]: present,
    }));
  };

  const saveAttendance = async () => {
    const operations = enrollments.map(async (enrollment) => {
      const present = attendance[enrollment.id] ?? false;
      const existingId = existingRecords[enrollment.id];

      if (existingId) {
        return supabase
          .from("attendance")
          .update({ present })
          .eq("id", existingId);
      } else {
        return supabase.from("attendance").insert({
          enrollment_id: enrollment.id,
          session_date: selectedDate,
          present,
        });
      }
    });

    const results = await Promise.all(operations);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      toast({ title: "Erreur", description: "Erreur lors de la sauvegarde", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Présences enregistrées" });
      fetchAttendance();
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = enrollments.length - presentCount;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Présences</h1>
          <p className="text-muted-foreground">Enregistrer les présences quotidiennes</p>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Programme</label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-64">
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
            <label className="text-sm font-medium">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
          </div>

          <Button onClick={saveAttendance}>
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-sm text-muted-foreground">Total inscrits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-sm text-muted-foreground">Présents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-sm text-muted-foreground">Absents</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste de présence - {format(new Date(selectedDate), "dd/MM/yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nom de l'enfant</TableHead>
                  <TableHead className="text-center w-32">Présent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment, index) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{enrollment.children?.full_name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant={attendance[enrollment.id] === true ? "default" : "outline"}
                          className={attendance[enrollment.id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleAttendanceChange(enrollment.id, true)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[enrollment.id] === false ? "default" : "outline"}
                          className={attendance[enrollment.id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                          onClick={() => handleAttendanceChange(enrollment.id, false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {enrollments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Aucun enfant inscrit à ce programme
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

export default Attendance;
