import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-kidshub.jpg";
import { 
  Palette, 
  Music, 
  Dumbbell, 
  Car, 
  Blocks, 
  Trophy,
  Heart,
  Camera,
  Shield,
  Clock,
  Users,
  Star,
  Sparkles,
  PartyPopper,
  CreditCard,
  Building2
} from "lucide-react";

const KidsHub = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    sessionTime: "",
    daysAttending: [] as string[],
    parentName: "",
    contactNumber: "",
    email: "",
    hasAllergies: false,
    allergiesDetails: "",
    hasMedication: false,
    medicationDetails: "",
    photoConsent: true,
  });

  const handleDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      daysAttending: checked 
        ? [...prev.daysAttending, day]
        : prev.daysAttending.filter(d => d !== day)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-consent-form', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Form Submitted Successfully! 🎉",
        description: "Thank you for registering your child. We will contact you shortly.",
      });

      // Reset form
      setFormData({
        childName: "",
        childAge: "",
        sessionTime: "",
        daysAttending: [],
        parentName: "",
        contactNumber: "",
        email: "",
        hasAllergies: false,
        allergiesDetails: "",
        hasMedication: false,
        medicationDetails: "",
        photoConsent: true,
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessions = [
    {
      number: 1,
      title: "Circus Fun World",
      color: "Pink & Blue",
      focus: "Physical Movement + Exploration",
      stations: [
        { name: "Twist Disk & Hula Spin Zone", equipment: "Twist disks, 6 hula hoops, 1,3,5kgs dumbbells", ages: "6-10" },
        { name: "Car Racetrack", equipment: "Monster Track Cars", ages: "5-6" },
        { name: "Soft Ball Dribble", equipment: "Soft balls, cones, mini goals", ages: "7-10" },
        { name: "Mega Block Builders", equipment: "Kids' building blocks", ages: "5-7" },
        { name: "Painting the Circus", equipment: "Crayons, paint, paper", ages: "Any" },
      ]
    },
    {
      number: 2,
      title: "Jungle Jam Safari",
      color: "Green & Orange",
      focus: "Creativity + Balance",
      stations: [
        { name: "Dino & Car Story Track", equipment: "Dinosaurs and cars", ages: "4-6" },
        { name: "Jungle Art Safari", equipment: "Paint and brushes", ages: "5-10" },
        { name: "Bounce & Balance Trail", equipment: "Bunny bouncing balls", ages: "5-8" },
        { name: "Jungle Jenga Tower", equipment: "Building blocks", ages: "5-10" },
        { name: "Animal Sound Mic Jam", equipment: "Microphone", ages: "5-6" },
      ]
    },
    {
      number: 3,
      title: "Superstar Stage Show",
      color: "Pink & Blue",
      focus: "Performance + Creativity",
      stations: [
        { name: "Karaoke Star Booth", equipment: "Microphone and music", ages: "8-10" },
        { name: "Fashion Fit Walk", equipment: "Runway setup", ages: "6-10" },
        { name: "Hula Hoop Challenge", equipment: "Hula hoops, soft balls", ages: "Any" },
        { name: "Block Beat Builders", equipment: "Building blocks", ages: "5-6" },
        { name: "If I Were a Star Drawing", equipment: "Art supplies", ages: "5-10" },
      ]
    },
    {
      number: 4,
      title: "Happy Olympics Carnival",
      color: "Rainbow",
      focus: "Teamwork + Celebration",
      stations: [
        { name: "Obstacle Adventure Course", equipment: "Hoops, blocks, bouncing balls", ages: "7-10" },
        { name: "Soft Ball Ring Toss", equipment: "Soft balls, hoops", ages: "5-7" },
        { name: "Friendly Boxing Tag", equipment: "Soft gloves, targets", ages: "5-10" },
        { name: "Team Tower Showdown", equipment: "Building blocks", ages: "5-7" },
        { name: "Medal Making & Bubbles", equipment: "Paper, bubble sticks", ages: "Everyone" },
      ]
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/80 via-purple-600/70 to-cyan-500/80" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            Pink & Bleu Kids' Hub
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md">
            4 Sessions Circus Games Program • Ages 5-10
          </p>
          <p className="text-lg mt-2 font-medium">
            Theme: "Happiness Comes First" – Supporting Children Through Play and Physical Activity
          </p>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
              Program Overview
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A 4-week program featuring hula hoops, building blocks, Monster Track cars, dinosaurs, 
              soft balls, dumbbells, boxing pads, art materials, bouncing bunnies, twist disks, 
              and music karaoke!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-t-4 border-pink-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <h3 className="font-bold text-lg mb-2">Time</h3>
              <p className="text-muted-foreground">2:00 PM – 4:00 PM</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-t-4 border-cyan-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
              <h3 className="font-bold text-lg mb-2">Ages</h3>
              <p className="text-muted-foreground">5-10 years old</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-t-4 border-purple-500">
              <Star className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-bold text-lg mb-2">Group Size</h3>
              <p className="text-muted-foreground">15-25 children</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-t-4 border-amber-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <h3 className="font-bold text-lg mb-2">Theme</h3>
              <p className="text-muted-foreground">Happiness Comes First</p>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h3 className="font-heading text-2xl font-bold mb-6 text-center">Daily Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-100 to-cyan-100">
                    <th className="p-4 text-left font-bold">Time</th>
                    <th className="p-4 text-left font-bold">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">2:00 – 2:10 PM</td>
                    <td className="p-4">Warm-Up Activity (Music + Movement)</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="p-4 font-medium">2:10 – 3:50 PM</td>
                    <td className="p-4">5 Rotating Stations (20 minutes each)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">3:50 – 4:00 PM</td>
                    <td className="p-4">Group Cool-Down, Stickers, High-Fives</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl font-bold text-center mb-12">
            Our 4 Exciting Sessions
          </h2>
          
          <div className="space-y-8">
            {sessions.map((session) => (
              <div 
                key={session.number}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border-l-4"
                style={{ 
                  borderColor: session.number === 1 ? '#EC4899' : 
                               session.number === 2 ? '#22C55E' : 
                               session.number === 3 ? '#8B5CF6' : '#F59E0B'
                }}
              >
                <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Session {session.number}</span>
                      <h3 className="font-heading text-2xl font-bold">{session.title}</h3>
                      <p className="text-muted-foreground">{session.color} Theme</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow">
                      <span className="font-medium">Focus: {session.focus}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    5 Rotating Stations
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {session.stations.map((station, idx) => (
                      <div key={idx} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="font-medium">{station.name}</h5>
                            <p className="text-sm text-muted-foreground mt-1">Ages: {station.ages}</p>
                            <p className="text-xs text-muted-foreground">{station.equipment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Celebration */}
          <div className="mt-12 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <PartyPopper className="w-16 h-16 mx-auto mb-4" />
            <h3 className="font-heading text-3xl font-bold mb-4">Final Celebration (Session 4)</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/20 rounded-xl p-4">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Certificate with child's name + sticker</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Group photo under "Happiness Comes First" banner</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <Music className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Bubble dance & sing-along with parents</p>
              </div>
            </div>
            <p className="mt-6 text-lg font-medium">Programme made by Coach: Sandra Pink Linda</p>
          </div>
        </div>
      </section>

      {/* Photo Consent Information */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <Camera className="w-8 h-8" />
                  <h2 className="font-heading text-2xl font-bold">
                    Parent Consent Form for Photos and Videos
                  </h2>
                </div>
                <p className="mt-2 opacity-90">Theme: "Happiness Comes First" – Supporting Children Through Play and Physical Activity</p>
              </div>
              
              <div className="p-8">
                <p className="text-lg mb-6">
                  Dear Parents and Guardians,
                </p>
                <p className="mb-6 text-muted-foreground">
                  At Kids Hub, our top priority is your child's safety, well-being, and happiness. As part of our "Happiness Comes First" program, we encourage active participation through physical play, social connection, and joyful experiences. To help celebrate and document these special moments, we occasionally take photos and videos during activities.
                </p>
                <p className="mb-6 text-muted-foreground">
                  We understand that some parents may have concerns about the use of images or recordings of their children. We want to assure you of the following:
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800 mb-2">Privacy and Safety Are Our Priorities</h4>
                      <ul className="text-green-700 space-y-1 text-sm">
                        <li>• All photos and videos are taken respectfully and with discretion.</li>
                        <li>• Children will never be photographed in compromising or inappropriate situations.</li>
                        <li>• Images are used only for educational, documentation, and promotional purposes related to Kids Hub.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Heart className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-800 mb-2">Consent is Required</h4>
                      <ul className="text-blue-700 space-y-1 text-sm">
                        <li>• We will only include your child in photos or videos if you have provided written consent.</li>
                        <li>• You have the right to withdraw consent at any time – just let us know in writing.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <Users className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-purple-800 mb-2">No Public Tagging or Identifying Without Permission</h4>
                      <ul className="text-purple-700 space-y-1 text-sm">
                        <li>• Children's names will not be tagged or identified publicly unless explicitly approved by parents.</li>
                        <li>• Media will not be shared on public platforms without prior notification and permission.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <Star className="w-8 h-8 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-amber-800 mb-2">Why We Use Media</h4>
                      <ul className="text-amber-700 space-y-1 text-sm">
                        <li>• To capture and celebrate moments of joy and learning.</li>
                        <li>• To help children build confidence seeing themselves engaged and active.</li>
                        <li>• To share progress and moments with parents in secure, private ways.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parental Consent Form */}
      <section className="py-16 bg-gradient-to-b from-cyan-50 to-pink-50" id="consent-form">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                Parental Consent Form
              </h2>
              <p className="text-lg text-muted-foreground">
                From Happiness Comes First Organisation<br />
                Kids Summer Holiday Activity
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
              {/* Child's Information */}
              <div>
                <h3 className="font-heading text-xl font-bold mb-4 text-pink-600">
                  Child's Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="childName">Full Name *</Label>
                    <Input
                      id="childName"
                      value={formData.childName}
                      onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="childAge">Age *</Label>
                    <Input
                      id="childAge"
                      type="number"
                      min="5"
                      max="10"
                      value={formData.childAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Session Time *</Label>
                  <RadioGroup
                    value={formData.sessionTime}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sessionTime: value }))}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="morning" id="morning" />
                      <Label htmlFor="morning">Morning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="afternoon" id="afternoon" />
                      <Label htmlFor="afternoon">Afternoon</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mt-4">
                  <Label>Days Attending</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {days.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.daysAttending.includes(day)}
                          onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                        />
                        <Label htmlFor={day} className="cursor-pointer">{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div>
                <h3 className="font-heading text-xl font-bold mb-4 text-cyan-600">
                  Parent/Guardian Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parentName">Full Name *</Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="font-heading text-xl font-bold mb-4 text-purple-600">
                  Medical Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Does your child have any allergies, medical conditions, or additional needs?</p>
                    <RadioGroup
                      value={formData.hasAllergies ? "yes" : "no"}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, hasAllergies: value === "yes" }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="allergies-no" />
                        <Label htmlFor="allergies-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="allergies-yes" />
                        <Label htmlFor="allergies-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                    {formData.hasAllergies && (
                      <Textarea
                        placeholder="Please specify allergies, conditions, or additional needs..."
                        value={formData.allergiesDetails}
                        onChange={(e) => setFormData(prev => ({ ...prev, allergiesDetails: e.target.value }))}
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <p className="font-medium mb-2">Is your child currently taking any medication?</p>
                    <RadioGroup
                      value={formData.hasMedication ? "yes" : "no"}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, hasMedication: value === "yes" }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="medication-no" />
                        <Label htmlFor="medication-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="medication-yes" />
                        <Label htmlFor="medication-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                    {formData.hasMedication && (
                      <Textarea
                        placeholder="Please specify medication details..."
                        value={formData.medicationDetails}
                        onChange={(e) => setFormData(prev => ({ ...prev, medicationDetails: e.target.value }))}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="bg-gradient-to-r from-pink-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="font-heading text-xl font-bold mb-4">
                  Consent
                </h3>
                <div className="text-sm text-muted-foreground mb-4 space-y-2">
                  <p>I, the undersigned, give permission for my child to participate in the Kids Summer Holiday Activity organised by From Happiness Comes First Organisation. I confirm that:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>I have read and understood the details of the activity.</li>
                    <li>I understand my child will take part in supervised creative and physical activities.</li>
                    <li>I will inform the organisers of any relevant medical or behavioural issues.</li>
                    <li>I consent to basic first aid being administered if necessary.</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <p className="font-medium mb-2">I give permission for my child to be photographed during the sessions for internal use and promotion:</p>
                  <RadioGroup
                    value={formData.photoConsent ? "yes" : "no"}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, photoConsent: value === "yes" }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="photo-yes" />
                      <Label htmlFor="photo-yes" className="text-green-600 font-medium">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="photo-no" />
                      <Label htmlFor="photo-no" className="text-red-600 font-medium">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Heart className="mr-2" />
                    Submit Consent Form
                  </>
                )}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                By submitting this form, you agree to the terms and conditions outlined above.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8" />
                  <h2 className="font-heading text-2xl font-bold">
                    Payment Information
                  </h2>
                </div>
                <p className="mt-2 opacity-90">Register your child for our activities</p>
              </div>
              
              <div className="p-8">
                <p className="text-lg mb-6 text-muted-foreground">
                  Parents can register their children for activities by making a payment via bank transfer or card.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-lg text-green-800">Bank Transfer Details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-muted-foreground">Bank Name</span>
                      <span className="font-semibold">Bank of Scotland</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-semibold">Happiness Comes First (SCIO)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-muted-foreground">Sort Code</span>
                      <span className="font-semibold font-mono">80-22-60</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-semibold font-mono">27522367</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <p className="text-blue-700">
                    <span className="font-semibold">Card payments accepted:</span> You can also pay by debit or credit card.
                  </p>
                </div>

                <p className="mt-6 text-sm text-muted-foreground text-center">
                  Please include your child's name as the payment reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KidsHub;
