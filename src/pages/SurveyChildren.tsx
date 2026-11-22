import { PhotoSection } from "@/components/GalleryPhoto";
import { useState } from "react";
import { Shield, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const platformOptions = ["TikTok", "Instagram", "Snapchat", "YouTube", "WhatsApp", "Facebook", "Gaming chats (Roblox, Fortnite etc.)"];
const negativeTypeOptions = [
  "Mean or hurtful comments",
  "Cyberbullying",
  "Pressure to share photos or personal information",
  "Being excluded from online groups",
  "Harassment in gaming chats",
  "Fake accounts or impersonation",
];

const SurveyChildren = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    platforms: [] as string[],
    hoursPerDay: "",
    peakUsage: "",
    negativeExperience: "",
    negativeTypes: [] as string[],
    feelsSafe: "",
    knowsWhoToTalkTo: "",
    wantsToLearn: "",
    additionalComments: "",
  });

  const set = (key: string, value: any) => setAnswers((p) => ({ ...p, [key]: value }));

  const toggleArray = (key: string, val: string) => {
    setAnswers((p) => {
      const arr = (p as any)[key] as string[];
      return { ...p, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.age) {
      toast({ title: "Please select your age group", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-survey", {
        body: { surveyType: "children", answers },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Thank you!", description: "Your survey has been submitted successfully." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Could not submit the survey. Please try again.", variant: "destructive" });
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
          <p className="text-muted-foreground max-w-md">Your answers will help us create safer online experiences for young people. We really appreciate your time!</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <PhotoSection photo="childrenHero" backdrop priority className="    py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-primary-foreground mx-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Digital Safety Survey</h1>
          <p className="text-lg text-muted-foreground mb-2">For Children &amp; Young People Aged 8–17</p>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Happiness Comes First is running a short survey to understand how young people use social media and the internet.
            Your answers will help us create workshops, activities, and support programmes to help children and teenagers stay safe, confident, and positive online.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <span className="bg-background/10 text-primary-foreground px-4 py-2 rounded-full">✔ Share your experiences</span>
            <span className="bg-background/10 text-primary-foreground px-4 py-2 rounded-full">✔ Improve digital safety education</span>
            <span className="bg-background/10 text-primary-foreground px-4 py-2 rounded-full">✔ Support safer communities</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">The survey only takes 2–3 minutes to complete.</p>
        </div>
      </PhotoSection>

      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Age */}
          <Card>
            <CardHeader><CardTitle className="text-lg">1. What age are you?</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.age} onValueChange={(v) => set("age", v)} className="space-y-2">
                {["8–10", "11–13", "14–16", "17"].map((a) => (
                  <div key={a} className="flex items-center space-x-2">
                    <RadioGroupItem value={a} id={`age-${a}`} />
                    <Label htmlFor={`age-${a}`}>{a}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Gender */}
          <Card>
            <CardHeader><CardTitle className="text-lg">2. Gender (optional)</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.gender} onValueChange={(v) => set("gender", v)} className="space-y-2">
                {["Female", "Male", "Prefer not to say", "Other"].map((g) => (
                  <div key={g} className="flex items-center space-x-2">
                    <RadioGroupItem value={g} id={`gender-${g}`} />
                    <Label htmlFor={`gender-${g}`}>{g}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Platforms */}
          <Card>
            <CardHeader><CardTitle className="text-lg">3. Which social media platforms do you use?</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {platformOptions.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox checked={answers.platforms.includes(p)} onCheckedChange={() => toggleArray("platforms", p)} id={`plat-${p}`} />
                  <Label htmlFor={`plat-${p}`}>{p}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Hours */}
          <Card>
            <CardHeader><CardTitle className="text-lg">4. How many hours per day do you spend on social media?</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.hoursPerDay} onValueChange={(v) => set("hoursPerDay", v)} className="space-y-2">
                {["Less than 1 hour", "1–2 hours", "3–4 hours", "5+ hours"].map((h) => (
                  <div key={h} className="flex items-center space-x-2">
                    <RadioGroupItem value={h} id={`hours-${h}`} />
                    <Label htmlFor={`hours-${h}`}>{h}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Peak usage */}
          <Card>
            <CardHeader><CardTitle className="text-lg">5. When do you use social media the most?</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.peakUsage} onValueChange={(v) => set("peakUsage", v)} className="space-y-2">
                {["After school", "Late evening", "During school hours", "Throughout the day"].map((t) => (
                  <div key={t} className="flex items-center space-x-2">
                    <RadioGroupItem value={t} id={`peak-${t}`} />
                    <Label htmlFor={`peak-${t}`}>{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Negative experience */}
          <Card>
            <CardHeader><CardTitle className="text-lg">6. Have you ever experienced negative behaviour online?</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={answers.negativeExperience} onValueChange={(v) => set("negativeExperience", v)} className="space-y-2">
                {["Yes", "No", "Not sure"].map((o) => (
                  <div key={o} className="flex items-center space-x-2">
                    <RadioGroupItem value={o} id={`neg-${o}`} />
                    <Label htmlFor={`neg-${o}`}>{o}</Label>
                  </div>
                ))}
              </RadioGroup>
              {answers.negativeExperience === "Yes" && (
                <div className="pl-4 border-l-2 border-primary/30 space-y-2 mt-2">
                  <p className="text-sm font-medium text-muted-foreground">If yes, what type?</p>
                  {negativeTypeOptions.map((n) => (
                    <div key={n} className="flex items-center space-x-2">
                      <Checkbox checked={answers.negativeTypes.includes(n)} onCheckedChange={() => toggleArray("negativeTypes", n)} id={`negtype-${n}`} />
                      <Label htmlFor={`negtype-${n}`} className="text-sm">{n}</Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feels safe */}
          <Card>
            <CardHeader><CardTitle className="text-lg">7. Do you feel safe online?</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.feelsSafe} onValueChange={(v) => set("feelsSafe", v)} className="space-y-2">
                {["Yes, always", "Most of the time", "Sometimes", "Not really"].map((o) => (
                  <div key={o} className="flex items-center space-x-2">
                    <RadioGroupItem value={o} id={`safe-${o}`} />
                    <Label htmlFor={`safe-${o}`}>{o}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Knows who to talk to */}
          <Card>
            <CardHeader><CardTitle className="text-lg">8. Do you know who to talk to if something bad happens online?</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.knowsWhoToTalkTo} onValueChange={(v) => set("knowsWhoToTalkTo", v)} className="space-y-2">
                {["Yes", "No", "Not sure"].map((o) => (
                  <div key={o} className="flex items-center space-x-2">
                    <RadioGroupItem value={o} id={`talk-${o}`} />
                    <Label htmlFor={`talk-${o}`}>{o}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Wants to learn */}
          <Card>
            <CardHeader><CardTitle className="text-lg">9. Would you like to learn more about staying safe online?</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={answers.wantsToLearn} onValueChange={(v) => set("wantsToLearn", v)} className="space-y-2">
                {["Yes", "Maybe", "No"].map((o) => (
                  <div key={o} className="flex items-center space-x-2">
                    <RadioGroupItem value={o} id={`learn-${o}`} />
                    <Label htmlFor={`learn-${o}`}>{o}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader><CardTitle className="text-lg">10. Anything else you'd like to tell us? (optional)</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={answers.additionalComments} onChange={(e) => set("additionalComments", e.target.value)} placeholder="Write here..." />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Survey</>}
          </Button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default SurveyChildren;
