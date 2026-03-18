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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Mail, Phone, CheckCircle2, Send } from "lucide-react";

const formSchema = z.object({
  ageGroup: z.string().min(1, "Veuillez sélectionner votre tranche d'âge"),
  describes: z.string().min(1, "Veuillez sélectionner une option"),
  describesOther: z.string().optional(),
  fitnessLevel: z.string().min(1, "Veuillez sélectionner une option"),
  barriers: z.array(z.string()).optional(),
  comfortFactors: z.array(z.string()).optional(),
  fitnessImprovesWellbeing: z.string().min(1, "Veuillez sélectionner une option"),
  challenges: z.array(z.string()).optional(),
  desiredActivities: z.array(z.string()).optional(),
  preferredTime: z.array(z.string()).optional(),
  preferredLocation: z.array(z.string()).optional(),
  interestedInProgramme: z.string().min(1, "Veuillez sélectionner une option"),
  attendanceFactors: z.array(z.string()).optional(),
  enoughOpportunities: z.string().min(1, "Veuillez sélectionner une option"),
  communityBenefit: z.string().optional(),
  contactName: z.string().optional(),
  contactInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const SurveyCommunity = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageGroup: "",
      describes: "",
      describesOther: "",
      fitnessLevel: "",
      barriers: [],
      comfortFactors: [],
      fitnessImprovesWellbeing: "",
      challenges: [],
      desiredActivities: [],
      preferredTime: [],
      preferredLocation: [],
      interestedInProgramme: "",
      attendanceFactors: [],
      enoughOpportunities: "",
      communityBenefit: "",
      contactName: "",
      contactInfo: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-survey", {
        body: { surveyType: "community", answers: data },
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast({ title: "Survey submitted!", description: "Thank you for sharing your voice." });
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

  const CheckboxGroup = ({ name, options }: { name: any; options: string[] }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="space-y-2">
            {options.map((opt) => (
              <label key={opt} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <Checkbox checked={(field.value || []).includes(opt)} onCheckedChange={() => toggleArrayValue(field, opt)} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
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
            <h1 className="text-3xl font-heading font-bold">Thank You!</h1>
            <p className="text-muted-foreground">Your responses will help us design inclusive programmes for women in the community.</p>
            <Button onClick={() => window.location.href = "/"} className="bg-[#FF1493] hover:bg-[#FF1493]/90">Return Home</Button>
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
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#FF1493]/10 via-background to-[#FF69B4]/10 py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center space-y-4">
            <Heart className="w-12 h-12 text-[#FF1493] mx-auto" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold">Voices of Happiness</h1>
            <p className="text-lg text-[#FF1493] font-semibold">Women's Wellbeing & Fitness Programme</p>
            <p className="text-sm text-muted-foreground">Delivered by: Happiness Comes First (SCIO)</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This short survey aims to understand the challenges women face in accessing fitness, wellbeing, and confidence-building activities. Your responses will help us design inclusive programmes supporting women's physical health, confidence, and mental wellbeing in the Gorbals community.
            </p>
            <p className="text-xs text-muted-foreground">The survey takes 3–5 minutes and responses are anonymous.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-[#FF1493]" />Happynesscome01@gmail.com</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-[#FF1493]" />07774 734000</span>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {/* Section 1 */}
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-bold border-b-2 border-[#FF1493] pb-2">Section 1: About You</h2>

                  <FormField control={form.control} name="ageGroup" render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. What age group are you in?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {["18–25", "26–35", "36–45", "46–55", "56+"].map((o) => (
                            <label key={o} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="describes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Which best describes you?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {["Student", "Working full time", "Working part time", "Stay-at-home parent", "Unemployed", "Other"].map((o) => (
                            <label key={o} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {form.watch("describes") === "Other" && (
                    <FormField control={form.control} name="describesOther" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="Please specify..." {...field} /></FormControl></FormItem>
                    )} />
                  )}

                  <FormField control={form.control} name="fitnessLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>3. Do you currently take part in any fitness or physical activity?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {["Yes regularly", "Sometimes", "Rarely", "Not at all"].map((o) => (
                            <label key={o} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Section 2 */}
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-bold border-b-2 border-[#FF1493] pb-2">Section 2: Barriers to Fitness</h2>

                  <div>
                    <Label className="text-sm font-medium">4. What prevents you from taking part in fitness activities? (Select all that apply)</Label>
                    <CheckboxGroup name="barriers" options={[
                      "Lack of time", "Cost of classes or gym", "Lack of childcare", "Lack of confidence",
                      "Cultural or religious barriers", "Feeling judged in gyms", "Health issues",
                      "Lack of women-only spaces", "Not knowing where to go", "Safety concerns"
                    ]} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">5. What would help you feel more comfortable joining fitness activities?</Label>
                    <CheckboxGroup name="comfortFactors" options={[
                      "Women-only sessions", "Beginner-friendly classes", "Child-friendly sessions",
                      "Affordable or free sessions", "Sessions in local community centres",
                      "Supportive and non-judgmental environment"
                    ]} />
                  </div>
                </div>

                {/* Section 3 */}
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-bold border-b-2 border-[#FF1493] pb-2">Section 3: Mental Wellbeing</h2>

                  <FormField control={form.control} name="fitnessImprovesWellbeing" render={({ field }) => (
                    <FormItem>
                      <FormLabel>6. Do you think physical activity can improve mental wellbeing?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {["Yes", "No", "Not sure"].map((o) => (
                            <label key={o} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div>
                    <Label className="text-sm font-medium">7. Which of these challenges do you sometimes experience?</Label>
                    <CheckboxGroup name="challenges" options={[
                      "Stress", "Anxiety", "Low confidence", "Isolation or loneliness",
                      "Lack of motivation", "None of the above"
                    ]} />
                  </div>
                </div>

                {/* Section 4 */}
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-bold border-b-2 border-[#FF1493] pb-2">Section 4: What Women Want</h2>

                  <div>
                    <Label className="text-sm font-medium">8. What types of activities would you like to see in the community?</Label>
                    <CheckboxGroup name="desiredActivities" options={[
                      "Women's fitness classes", "Dance fitness", "Yoga / relaxation",
                      "Confidence-building workshops", "Mental wellbeing support",
                      "Social meetups for women", "Creative activities (music, art, expression)"
                    ]} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">9. When would you prefer activities to take place?</Label>
                    <CheckboxGroup name="preferredTime" options={["Morning", "Afternoon", "Evening", "Weekends"]} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">10. Where would you prefer these activities?</Label>
                    <CheckboxGroup name="preferredLocation" options={[
                      "Local community centre", "Outdoor parks", "Gym facilities",
                      "School halls", "Online sessions"
                    ]} />
                  </div>
                </div>

                {/* Section 5 */}
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-bold border-b-2 border-[#FF1493] pb-2">Section 5: Voices of Happiness Programme</h2>

                  <FormField control={form.control} name="interestedInProgramme" render={({ field }) => (
                    <FormItem>
                      <FormLabel>11. Would you be interested in attending a programme that combines women's fitness, confidence building, creative self-expression, and mental wellbeing support?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {["Yes", "Maybe", "No"].map((o) => (
                            <label key={o} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div>
                    <Label className="text-sm font-medium">12. What would make you more likely to attend?</Label>
                    <CheckboxGroup name="attendanceFactors" options={[
                      "Free or low-cost sessions", "Child-friendly environment",
                      "Women-only safe space", "Friendly community atmosphere"
                    ]} />
                  </div>

                  <FormField control={form.control} name="enoughOpportunities" render={({ field }) => (
                    <FormItem>
                      <FormLabel>13. Do you feel there are enough safe and accessible fitness opportunities for women in your community?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {["Yes", "No", "Not sure"].map((o) => (
                            <label key={o} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/50">
                              <RadioGroupItem value={o} /><span className="text-sm">{o}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="communityBenefit" render={({ field }) => (
                    <FormItem>
                      <FormLabel>14. How do you think programmes like this could benefit women in your community?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share your thoughts..." className="min-h-[100px]" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                {/* Optional contact */}
                <div className="space-y-4 bg-accent/30 p-6 rounded-xl">
                  <h3 className="font-heading font-semibold">Optional – Stay Informed</h3>
                  <p className="text-sm text-muted-foreground">If you would like to hear about future Voices of Happiness activities:</p>
                  <FormField control={form.control} name="contactName" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="contactInfo" render={({ field }) => (
                    <FormItem><FormLabel>Email / Phone</FormLabel><FormControl><Input placeholder="Email or phone number" {...field} /></FormControl></FormItem>
                  )} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF1493] hover:bg-[#FF1493]/90 text-white py-6 text-lg">
                  {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-2" />Submit Survey</>}
                </Button>
              </form>
            </Form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SurveyCommunity;
