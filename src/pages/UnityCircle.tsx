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
  fullName: string;
  phone: string;
  adults: string;
  children: string;
  childrenAges: string;
  supportNeeds: string;
  photoConsent: string;
  consent: boolean;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  adults: "",
  children: "",
  childrenAges: "",
  supportNeeds: "",
  photoConsent: "",
  consent: false,
};

const numberOptions = Array.from({ length: 11 }, (_, i) => String(i));

type TextFieldProps = {
  label: string;
  hint?: string;
  name: keyof FormState;
  value: string;
  type?: string;
  required?: boolean;
  onValueChange: (name: keyof FormState, value: string) => void;
};

const TextField = ({ label, hint, name, value, type = "text", required = false, onValueChange }: TextFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>
      {label}{required && <span className="text-primary"> *</span>}
    </Label>
    {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    <Input id={name} name={name} type={type} value={value} onChange={(event) => onValueChange(name, event.target.value)} required={required} />
  </div>
);

const TextAreaField = ({ label, hint, name, value, onValueChange }: Omit<TextFieldProps, "type" | "required">) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    <Textarea id={name} name={name} value={value} onChange={(event) => onValueChange(name, event.target.value)} rows={3} />
  </div>
);

type NumberSelectProps = {
  label: string;
  name: "adults" | "children";
  value: string;
  onValueChange: (name: keyof FormState, value: string) => void;
};

const NumberSelect = ({ label, name, value, onValueChange }: NumberSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>
      {label}<span className="text-primary"> *</span>
    </Label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={(event) => onValueChange(name, event.target.value)}
      required
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="" disabled>Select number</option>
      {numberOptions.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>
);

const UnityCircle = () => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.adults || !form.children || !form.consent) {
      toast({ title: "Please complete the required fields", description: "Full name, phone number, number of people coming and consent are required.", variant: "destructive" });
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

  if (submitted) return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg text-center space-y-5">
          <CheckCircle className="w-20 h-20 text-primary mx-auto" />
          <h1 className="font-heading text-3xl font-bold">💖 Thank you for registering with Unity Circle!</h1>
          <p className="text-muted-foreground">We look forward to welcoming you and your family.</p>
          <p className="text-sm font-semibold text-primary">Happiness Comes First – Where Everyone Belongs!</p>
          <Button onClick={() => window.location.href = "/"}>Return home</Button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-14 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-4">
            <Heart className="w-12 h-12 text-primary mx-auto" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Happiness Comes First</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold">Unity Circle: Where Families Heal & Connect</h1>
            <p className="text-lg text-muted-foreground">Participant Registration Form</p>
            <p className="max-w-3xl mx-auto text-muted-foreground">Unity Circle provides culturally sensitive family wellbeing activities including family fitness, Afrobeat dance, music, storytelling, creative activities, community connection and inclusive activities for neurodivergent children and families.</p>
          </div>
        </section>
        <section className="container mx-auto max-w-3xl px-4 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader><CardTitle>1. Your Details</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <TextField label="Full Name" hint="Enter your full name." name="fullName" value={form.fullName} required onValueChange={set} />
                <TextField label="Phone / WhatsApp Number" hint="Enter your contact number." name="phone" type="tel" value={form.phone} required onValueChange={set} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>2. How Many People Are Coming? <span className="text-primary">*</span></CardTitle></CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <NumberSelect label="Adults" name="adults" value={form.adults} onValueChange={set} />
                <NumberSelect label="Children" name="children" value={form.children} onValueChange={set} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>3. Children's Ages</CardTitle></CardHeader>
              <CardContent>
                <TextField label="Children's ages" hint="If bringing children, please enter their ages. Example: 5, 8, 10." name="childrenAges" value={form.childrenAges} onValueChange={set} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>4. Any Allergies or Additional Support Needs? (Optional)</CardTitle></CardHeader>
              <CardContent>
                <TextAreaField label="Allergies or support needs" hint="Please tell us anything important that will help you or your children participate safely and comfortably." name="supportNeeds" value={form.supportNeeds} onValueChange={set} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>5. Photo / Video Permission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Can we use photographs or videos of you or your children for our charity's website, social media and project reports?</p>
                <RadioGroup value={form.photoConsent} onValueChange={(value) => set("photoConsent", value)} className="grid gap-2">
                  {["Yes, I give permission.", "No, thank you."].map((option) => (
                    <div className="flex items-center gap-2" key={option}>
                      <RadioGroupItem value={option} id={`photoConsent-${option}`} />
                      <Label htmlFor={`photoConsent-${option}`} className="font-normal">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>6. Consent <span className="text-primary">*</span></CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/40">
                  <Checkbox checked={form.consent} onCheckedChange={(checked) => set("consent", checked === true)} />
                  <span className="text-sm leading-5">I agree to follow safety guidance and confirm I have permission to register any children attending with me.</span>
                </label>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Privacy:</span> Your information will be used to organise Unity Circle activities, support participants and manage attendance. It will be kept securely in accordance with our privacy notice.</p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? "Submitting..." : "Submit registration"}
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UnityCircle;
