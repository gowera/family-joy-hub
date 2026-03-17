import { useState } from "react";
import { Users, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SurveyParent = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [a, setA] = useState({
    childAge: "",
    completingAs: "",
    completingAsOther: "",
    childGender: "",
    childGenderOther: "",
    platforms: [] as string[],
    platformsOther: "",
    hoursPerDay: "",
    peakUsage: "",
    negativeExperience: "",
    negativeTypes: [] as string[],
    wellbeingImpact: "",
    wellbeingSigns: [] as string[],
    confidenceLevel: "",
    toolsUsed: [] as string[],
    supportNeeds: [] as string[],
    interestedInWorkshops: "",
    beneficiaries: [] as string[],
    contactName: "",
    contactInfo: "",
  });

  const set = (key: string, value: any) => setA((p) => ({ ...p, [key]: value }));
  const toggle = (key: string, val: string) => {
    setA((p) => {
      const arr = (p as any)[key] as string[];
      return { ...p, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!a.childAge) {
      toast({ title: "Please select your child's age group", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-survey", {
        body: { surveyType: "parent", answers: a },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Thank you!", description: "Your questionnaire has been submitted." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Could not submit. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <CheckCircle className="w-20 h-20 text-primary mb-6" />
          <h1 className="font-heading text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground max-w-md">Your responses will help us design better community programmes for families. We truly appreciate your time.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const CheckboxGroup = ({ items, stateKey }: { items: string[]; stateKey: string }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox checked={(a as any)[stateKey]?.includes(item)} onCheckedChange={() => toggle(stateKey, item)} id={`${stateKey}-${item}`} />
          <Label htmlFor={`${stateKey}-${item}`} className="text-sm">{item}</Label>
        </div>
      ))}
    </div>
  );

  const RadioQuestion = ({ stateKey, options }: { stateKey: string; options: string[] }) => (
    <RadioGroup value={(a as any)[stateKey]} onValueChange={(v) => set(stateKey, v)} className="space-y-2">
      {options.map((o) => (
        <div key={o} className="flex items-center space-x-2">
          <RadioGroupItem value={o} id={`${stateKey}-${o}`} />
          <Label htmlFor={`${stateKey}-${o}`}>{o}</Label>
        </div>
      ))}
    </RadioGroup>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Parent Questionnaire</h1>
          <p className="text-lg text-muted-foreground mb-1">Digital Wise Futures – Community Digital Safety Project</p>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm">
            This short survey helps us understand how children and families use social media and what support parents may need. 
            All responses are anonymous and will only be used to improve community programmes.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 1: About Your Child</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">1. What age is your child?</CardTitle></CardHeader>
              <CardContent><RadioQuestion stateKey="childAge" options={["8–10", "11–13", "14–16", "17–18"]} /></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">2. Are you completing this questionnaire as:</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <RadioQuestion stateKey="completingAs" options={["Parent / Carer", "Teacher / Youth worker", "Other"]} />
                {a.completingAs === "Other" && <Input placeholder="Please specify..." value={a.completingAsOther} onChange={(e) => set("completingAsOther", e.target.value)} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">3. Gender of the child (optional)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <RadioQuestion stateKey="childGender" options={["Female", "Male", "Prefer not to say", "Other"]} />
                {a.childGender === "Other" && <Input placeholder="Please specify..." value={a.childGenderOther} onChange={(e) => set("childGenderOther", e.target.value)} />}
              </CardContent>
            </Card>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 2: Social Media Use</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">4. Which social media platforms does your child use?</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <CheckboxGroup items={["TikTok", "Instagram", "Snapchat", "YouTube", "WhatsApp", "Facebook", "Gaming chats (Roblox, Fortnite etc.)"]} stateKey="platforms" />
                <div className="flex items-center space-x-2">
                  <Checkbox checked={a.platformsOther !== ""} onCheckedChange={(c) => { if (!c) set("platformsOther", ""); }} id="plat-other" />
                  <Label htmlFor="plat-other">Other:</Label>
                  <Input className="flex-1" placeholder="Specify..." value={a.platformsOther} onChange={(e) => set("platformsOther", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">5. How many hours per day does your child spend on social media?</CardTitle></CardHeader>
              <CardContent><RadioQuestion stateKey="hoursPerDay" options={["Less than 1 hour", "1–2 hours", "3–4 hours", "5+ hours"]} /></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">6. When does your child use social media the most?</CardTitle></CardHeader>
              <CardContent><RadioQuestion stateKey="peakUsage" options={["After school", "Late evening", "During school hours", "Throughout the day"]} /></CardContent>
            </Card>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 3: Online Experiences</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">7. Has your child ever experienced negative behaviour online?</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <RadioQuestion stateKey="negativeExperience" options={["Yes", "No", "Not sure"]} />
                {a.negativeExperience === "Yes" && (
                  <div className="pl-4 border-l-2 border-primary/30 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">If yes, what type?</p>
                    <CheckboxGroup items={["Mean or hurtful comments", "Cyberbullying", "Pressure to share photos or personal information", "Being excluded from online groups", "Harassment in gaming chats", "Fake accounts or impersonation"]} stateKey="negativeTypes" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 4: Impact on Wellbeing</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">8. Do you think social media affects your child's mental wellbeing?</CardTitle></CardHeader>
              <CardContent><RadioQuestion stateKey="wellbeingImpact" options={["Yes, positively", "Yes, negatively", "Both positive and negative", "Not sure"]} /></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">9. Have you noticed any of the following in your child?</CardTitle></CardHeader>
              <CardContent><CheckboxGroup items={["Lower confidence", "Anxiety about likes or followers", "Difficulty focusing on schoolwork", "Phone or screen addiction", "Sleep problems", "None of the above"]} stateKey="wellbeingSigns" /></CardContent>
            </Card>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 5: Parental Confidence</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">10. How confident do you feel helping your child stay safe online?</CardTitle></CardHeader>
              <CardContent><RadioQuestion stateKey="confidenceLevel" options={["Very confident", "Somewhat confident", "Not confident", "Not sure how to use parental controls"]} /></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">11. Do you currently use any of the following tools?</CardTitle></CardHeader>
              <CardContent><CheckboxGroup items={["Screen time limits", "Parental control apps", "Privacy settings", "Child-safe apps (YouTube Kids etc.)", "None"]} stateKey="toolsUsed" /></CardContent>
            </Card>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 6: Education & Support Needs</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">12. Would you like support or workshops on:</CardTitle></CardHeader>
              <CardContent><CheckboxGroup items={["Online safety for children", "Managing cyberbullying", "Reducing screen addiction", "Helping children build confidence online", "Using social media for learning and creativity", "Parent digital safety training"]} stateKey="supportNeeds" /></CardContent>
            </Card>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Section 7: Community Programmes</h2>

            <Card>
              <CardHeader><CardTitle className="text-lg">13. Would you be interested in attending Digital Wise Futures workshops?</CardTitle></CardHeader>
              <CardContent><RadioQuestion stateKey="interestedInWorkshops" options={["Yes", "Maybe", "No"]} /></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">14. Who would benefit most from this programme?</CardTitle></CardHeader>
              <CardContent><CheckboxGroup items={["Children (8–12)", "Teenagers (13–18)", "Parents", "Whole families"]} stateKey="beneficiaries" /></CardContent>
            </Card>
          </div>

          {/* Optional contact */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary border-b border-primary/20 pb-2">Optional – Stay in Touch</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">If you would like to hear about upcoming workshops or community sessions:</p>
                <div>
                  <Label htmlFor="contactName">Name</Label>
                  <Input id="contactName" value={a.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="contactInfo">Email / Phone</Label>
                  <Input id="contactInfo" value={a.contactInfo} onChange={(e) => set("contactInfo", e.target.value)} placeholder="Email or phone number" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Questionnaire</>}
          </Button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default SurveyParent;
