import { useState } from "react";
import { CheckCircle, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type FormState = {
  fullName: string; dateOfBirthAge: string; address: string; postcode: string; phone: string; email: string;
  gender: string; preferredLanguage: string; ethnicBackground: string; parentCarer: string; howHeard: string; firstSessionDate: string;
  familyParticipants: string; emergencyName: string; emergencyRelationship: string; emergencyPhone: string; alternativePhone: string;
  emergencyEmail: string; importantInformation: string; accessibilityNeeds: string; allergiesMedical: string; sensoryAdaptation: string; otherSupport: string;
  desiredActivities: string[]; consents: string[]; photoConsent: string; communicationConsent: string[]; declarationName: string; signature: string;
  declarationDate: string; staffMember: string; participantId: string; registrationNotes: string; sessionDate: string; activityAttended: string;
  feelingBefore: string; feelingAfter: string; enjoyedMost: string; improvements: string; attendAgain: string; recommend: string;
};

const initialForm: FormState = {
  fullName: "", dateOfBirthAge: "", address: "", postcode: "", phone: "", email: "", gender: "", preferredLanguage: "", ethnicBackground: "", parentCarer: "", howHeard: "", firstSessionDate: "",
  familyParticipants: "", emergencyName: "", emergencyRelationship: "", emergencyPhone: "", alternativePhone: "", emergencyEmail: "", importantInformation: "",
  accessibilityNeeds: "", allergiesMedical: "", sensoryAdaptation: "", otherSupport: "", desiredActivities: [], consents: [], photoConsent: "", communicationConsent: [], declarationName: "", signature: "", declarationDate: "", staffMember: "", participantId: "", registrationNotes: "", sessionDate: "", activityAttended: "", feelingBefore: "", feelingAfter: "", enjoyedMost: "", improvements: "", attendAgain: "", recommend: "",
};

const consentOptions = [
  "I understand that participation is voluntary and I can stop taking part at any time.",
  "I agree to follow reasonable safety instructions given by staff and facilitators.",
  "I give permission for Happiness Comes First to record attendance and basic monitoring information for project reporting and evaluation.",
  "I understand that personal information will be used only for project delivery, safeguarding, monitoring and legitimate organisational purposes, and will be handled confidentially.",
  "For any child under 18 listed on this form, I confirm that I am their parent/legal guardian or have authority to give consent for participation.",
];
const activityOptions = ["Family fitness / movement", "Afrobeat dance / Zumba", "African music / cultural activities", "Storytelling / heritage", "Arts & crafts / creative wellbeing", "Family connection / peer support", "Activities for neurodivergent children", "Community events / celebrations"];

type TextFieldProps = {
  label: string;
  name: keyof FormState;
  value: string;
  type?: string;
  required?: boolean;
  onValueChange: (name: keyof FormState, value: string) => void;
};

const TextField = ({ label, name, value, type = "text", required = false, onValueChange }: TextFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>
      {label}{required && <span className="text-primary"> *</span>}
    </Label>
    <Input id={name} name={name} type={type} value={value} onChange={(event) => onValueChange(name, event.target.value)} required={required} />
  </div>
);

const TextAreaField = ({ label, name, value, onValueChange }: Omit<TextFieldProps, "type" | "required">) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Textarea id={name} name={name} value={value} onChange={(event) => onValueChange(name, event.target.value)} rows={3} />
  </div>
);

const UnityCircle = () => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (key: "desiredActivities" | "consents" | "communicationConsent", value: string) => setForm((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.emergencyName.trim() || form.consents.length !== consentOptions.length || !form.photoConsent || !form.declarationName.trim() || !form.signature.trim() || !form.declarationDate) {
      toast({ title: "Please complete the required fields", description: "Participant details, emergency contact, consent and declaration are required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-survey", { body: { surveyType: "unity_circle", answers: form } });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Registration submitted", description: "Thank you for joining Unity Circle." });
    } catch (error: unknown) {
      toast({ title: "Unable to submit", description: error instanceof Error ? error.message : "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Field = ({ label, name, type = "text", required = false }: { label: string; name: keyof FormState; type?: string; required?: boolean }) => <TextField label={label} name={name} type={type} required={required} value={form[name] as string} onValueChange={set} />;
  const Area = ({ label, name }: { label: string; name: keyof FormState }) => <TextAreaField label={label} name={name} value={form[name] as string} onValueChange={set} />;
  const Choice = ({ label, name, options }: { label: string; name: "parentCarer" | "photoConsent" | "attendAgain" | "recommend"; options: string[] }) => <div className="space-y-3"><Label>{label}</Label><RadioGroup value={form[name]} onValueChange={(value) => set(name, value)} className="grid gap-2 sm:grid-cols-2">{options.map((option) => <div className="flex items-center gap-2" key={option}><RadioGroupItem value={option} id={`${name}-${option}`} /><Label htmlFor={`${name}-${option}`} className="font-normal">{option}</Label></div>)}</RadioGroup></div>;
  const Checks = ({ options, name }: { options: string[]; name: "desiredActivities" | "consents" | "communicationConsent" }) => <div className="grid gap-3 sm:grid-cols-2">{options.map((option) => <label key={option} className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/40"><Checkbox checked={form[name].includes(option)} onCheckedChange={() => toggle(name, option)} /><span className="text-sm leading-5">{option}</span></label>)}</div>;

  if (submitted) return <div className="min-h-screen flex flex-col"><Navigation /><main className="flex-1 flex items-center justify-center px-4 py-20"><div className="max-w-lg text-center space-y-5"><CheckCircle className="w-20 h-20 text-primary mx-auto" /><h1 className="font-heading text-3xl font-bold">Thank you for joining Unity Circle</h1><p className="text-muted-foreground">Your registration and consent form has been received. We will be in touch with you soon.</p><Button onClick={() => window.location.href = "/"}>Return home</Button></div></main><Footer /></div>;

  return <div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1"><section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-14 px-4"><div className="container mx-auto max-w-4xl text-center space-y-4"><Heart className="w-12 h-12 text-primary mx-auto" /><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Happiness Comes First</p><h1 className="font-heading text-3xl md:text-5xl font-bold">Unity Circle: Where Families Heal & Connect</h1><p className="text-lg text-muted-foreground">Participant Registration & Consent Form</p><p className="max-w-2xl mx-auto text-sm text-muted-foreground">20 September 2026 - 19 September 2027 | Weekly community wellbeing sessions</p><p className="max-w-3xl mx-auto text-muted-foreground">Unity Circle provides culturally sensitive family wellbeing activities including family fitness, Afrobeat dance, music, storytelling, creative activities, community connection and inclusive activities for neurodivergent children and families.</p></div></section>
    <section className="container mx-auto max-w-4xl px-4 py-10"><form onSubmit={handleSubmit} className="space-y-8">
      <Card><CardHeader><CardTitle>1. Participant Details</CardTitle></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><Field label="Full name" name="fullName" required /><Field label="Date of birth / Age" name="dateOfBirthAge" /><div className="md:col-span-2"><Area label="Address" name="address" /></div><Field label="Postcode" name="postcode" /><Field label="Phone number" name="phone" required /><Field label="Email address" name="email" type="email" required /><Field label="Gender (optional)" name="gender" /><Field label="Preferred language" name="preferredLanguage" /><Field label="Ethnic / cultural background (optional)" name="ethnicBackground" /><Choice label="Are you a parent / carer?" name="parentCarer" options={["Yes", "No"]} /><Field label="How did you hear about Unity Circle?" name="howHeard" /><Field label="First session date" name="firstSessionDate" type="date" /></CardContent></Card>
      <Card><CardHeader><CardTitle>2. Family / Child Participants</CardTitle><p className="text-sm text-muted-foreground">Complete if attending as a family. Add one participant per line: name | age | relationship | support or accessibility needs.</p></CardHeader><CardContent><Area label="Family / child participant details" name="familyParticipants" /></CardContent></Card>
      <Card><CardHeader><CardTitle>3. Emergency Contact</CardTitle></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><Field label="Name" name="emergencyName" required /><Field label="Relationship" name="emergencyRelationship" /><Field label="Phone number" name="emergencyPhone" /><Field label="Alternative phone" name="alternativePhone" /><Field label="Email (optional)" name="emergencyEmail" type="email" /><div className="md:col-span-2"><Area label="Any important information" name="importantInformation" /></div></CardContent></Card>
      <Card><CardHeader><CardTitle>4. Health, Accessibility & Support</CardTitle><p className="text-sm text-muted-foreground">Please tell us anything we should reasonably know to help you or your family participate safely and comfortably. You do not need to disclose more than is necessary.</p></CardHeader><CardContent className="space-y-5"><Area label="Any mobility, sensory, communication or accessibility needs?" name="accessibilityNeeds" /><Area label="Any allergies or relevant medical information that staff should know during sessions?" name="allergiesMedical" /><Area label="Does anyone attending benefit from sensory-friendly or adapted participation?" name="sensoryAdaptation" /><Area label="Any other support that would help you take part?" name="otherSupport" /></CardContent></Card>
      <Card><CardHeader><CardTitle>5. What Would You Like From Unity Circle?</CardTitle></CardHeader><CardContent><Checks name="desiredActivities" options={activityOptions} /></CardContent></Card>
      <Card><CardHeader><CardTitle>6. Consent & Permissions</CardTitle><p className="text-sm text-muted-foreground">Please confirm each statement to submit this registration.</p></CardHeader><CardContent><Checks name="consents" options={consentOptions} /></CardContent></Card>
      <Card><CardHeader><CardTitle>7. Photo / Video Consent (optional)</CardTitle><p className="text-sm text-muted-foreground">Please select one choice.</p></CardHeader><CardContent><Choice label="Permission for photographs/videos of me and/or my children to be used for project promotion, reports, social media, website and funding evidence." name="photoConsent" options={["YES - I give permission", "NO - I do not give permission"]} /></CardContent></Card>
      <Card><CardHeader><CardTitle>8. Communication Consent (optional)</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-4">I am happy to receive Unity Circle session reminders, updates and event information by:</p><Checks name="communicationConsent" options={["Phone", "Text / WhatsApp", "Email"]} /></CardContent></Card>
      <Card><CardHeader><CardTitle>9. Participant Declaration</CardTitle></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><Field label="Participant / Parent-Carer name" name="declarationName" required /><Field label="Signature (type your full name)" name="signature" required /><Field label="Date" name="declarationDate" type="date" required /><Field label="Staff member receiving form" name="staffMember" /><Field label="For office use: Participant ID" name="participantId" /><Field label="Registration status / notes" name="registrationNotes" /></CardContent></Card>
      <Card><CardHeader><CardTitle>10. Session Feedback (optional)</CardTitle><p className="text-sm text-muted-foreground">This section can be completed after attending.</p></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><Field label="Date of session" name="sessionDate" type="date" /><Field label="Activity attended" name="activityAttended" /><Field label="How did you feel before the session?" name="feelingBefore" /><Field label="How did you feel after the session?" name="feelingAfter" /><div className="md:col-span-2"><Area label="What did you enjoy most?" name="enjoyedMost" /></div><div className="md:col-span-2"><Area label="What could we improve?" name="improvements" /></div><Choice label="Would you attend again?" name="attendAgain" options={["Yes", "No"]} /><Choice label="Would you recommend Unity Circle?" name="recommend" options={["Yes", "No"]} /></CardContent></Card>
      <div className="flex justify-end"><Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">{isSubmitting ? "Submitting..." : "Submit registration"}<Send className="w-4 h-4" /></Button></div>
    </form></section></main><Footer /></div>;
};

export default UnityCircle;
