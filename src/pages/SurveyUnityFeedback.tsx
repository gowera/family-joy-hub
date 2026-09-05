import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, CheckCircle2, Send, Loader2 } from "lucide-react";

const formSchema = z.object({
  sessionDate: z.string().max(30).optional(),
  enjoyment: z.string().min(1, "Please select an option"),
  activities: z.array(z.string()).optional(),
  activitiesOther: z.string().max(200).optional(),
  feelHappier: z.string().min(1, "Please select an option"),
  feelConnected: z.string().min(1, "Please select an option"),
  feelActive: z.string().min(1, "Please select an option"),
  feelWelcome: z.string().min(1, "Please select an option"),
  wouldReturn: z.string().min(1, "Please select an option"),
  enjoyedMost: z.string().max(1000).optional(),
  improvements: z.string().max(1000).optional(),
  anythingElse: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

const ENJOYMENT = ["Excellent", "Good", "Okay", "Not very good"];
const ACTIVITIES = [
  "Fitness / Movement",
  "Dance / Music",
  "Arts & Crafts",
  "Cultural Activities",
  "Family Activities",
  "Wellbeing / Social Connection",
  "Other",
];
const YES_SCALE = ["Yes", "A little", "No"];
const RETURN = ["Yes", "Maybe", "No"];

const SurveyUnityFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionDate: "",
      enjoyment: "",
      activities: [],
      activitiesOther: "",
      feelHappier: "",
      feelConnected: "",
      feelActive: "",
      feelWelcome: "",
      wouldReturn: "",
      enjoyedMost: "",
      improvements: "",
      anythingElse: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-survey", {
        body: { surveyType: "unity_feedback", answers: data },
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast({ title: "Feedback submitted!", description: "Thank you for helping us improve The Unity Circle." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not submit.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (field: any, value: string) => {
    const current: string[] = field.value || [];
    field.onChange(current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value]);
  };

  const RadioRow = ({ name, label, options }: { name: any; label: string; options: string[] }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-2">
              {options.map((o) => (
                <label key={o} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border border-border hover:bg-accent/50">
                  <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                </label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-lg text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-[#FF1493] mx-auto" />
            <h1 className="text-3xl font-heading font-bold">Thank you for your feedback!</h1>
            <p className="text-muted-foreground">
              Happiness Comes First – Building Stronger Communities, Inspiring Happier Lives.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => (window.location.href = "/survey-stats")} variant="outline">View Survey Statistics</Button>
              <Button onClick={() => (window.location.href = "/")} className="bg-[#FF1493] hover:bg-[#FF1493]/90">Return Home</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#FF1493]/10 via-background to-[#FF69B4]/10 py-14 px-4">
          <div className="container mx-auto max-w-3xl text-center space-y-3">
            <Users className="w-12 h-12 text-[#FF1493] mx-auto" />
            <h1 className="text-2xl md:text-4xl font-heading font-bold">The Unity Circle – Quick Feedback Survey</h1>
            <p className="text-sm text-muted-foreground">Happiness Comes First (HCF)</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thank you for joining us today. Your feedback helps us improve our activities and make The Unity Circle
              better for families and our community.
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="sessionDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                  </FormItem>
                )} />

                <RadioRow name="enjoyment" label="1. How did you enjoy today's session?" options={ENJOYMENT} />

                <FormField control={form.control} name="activities" render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Which activities did you enjoy today?</FormLabel>
                    <div className="space-y-2">
                      {ACTIVITIES.map((opt) => (
                        <label key={opt} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50 transition-colors">
                          <Checkbox checked={(field.value || []).includes(opt)} onCheckedChange={() => toggleArrayValue(field, opt)} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </FormItem>
                )} />
                {(form.watch("activities") || []).includes("Other") && (
                  <FormField control={form.control} name="activitiesOther" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Please specify..." {...field} /></FormControl></FormItem>
                  )} />
                )}

                <div className="space-y-5">
                  <h2 className="text-lg font-heading font-bold border-b-2 border-[#FF1493] pb-2">
                    3. After today's session, do you feel:
                  </h2>
                  <RadioRow name="feelHappier" label="Happier?" options={YES_SCALE} />
                  <RadioRow name="feelConnected" label="More connected to others?" options={YES_SCALE} />
                  <RadioRow name="feelActive" label="More active?" options={YES_SCALE} />
                  <RadioRow name="feelWelcome" label="Welcome and included?" options={YES_SCALE} />
                </div>

                <RadioRow name="wouldReturn" label="4. Would you come to another Unity Circle session?" options={RETURN} />

                <FormField control={form.control} name="enjoyedMost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>5. What did you enjoy most today?</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="improvements" render={({ field }) => (
                  <FormItem>
                    <FormLabel>6. Is there anything you would like us to improve or offer in future sessions?</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="anythingElse" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optional: Is there anything else you would like to tell us?</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                  </FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF1493] hover:bg-[#FF1493]/90">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Submit feedback
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Happiness Comes First – Building Stronger Communities, Inspiring Happier Lives.
                </p>
              </form>
            </Form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SurveyUnityFeedback;
