import { PhotoSection, GalleryPhoto } from "@/components/GalleryPhoto";
import { Activity, Music, Palette, Heart, Calendar, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Programs = () => {
  const mainPrograms = [{
    icon: Activity,
    title: "Family Fitness & Dance Sessions",
    description: "Inclusive co-participation sessions combining movement, laughter, and bonding for all ages.",
    details: ["Cardio, Pilates, and dance routines adapted for all abilities", "Parent-child participation encouraged", "Autism and sensory-friendly adaptations", "Motivational music including 'Fitness Barbie' by Sandra Pink Linda and 'Hakuna Matata'"],
    image: "programFitness" as const,
    frequency: "Weekly",
    ageGroup: "All Ages"
  }, {
    icon: Palette,
    title: "Sensory Play & Calm Zones",
    description: "Specially designed spaces and activities for children with additional needs.",
    details: ["Water play and tactile exploration stations", "Soft blocks and textured fabrics", "Calm corners with dim lighting and cushions", "Non-verbal interactive play opportunities"],
    image: "programSensory" as const,
    frequency: "Every Session",
    ageGroup: "0-12 years"
  }, {
    icon: Music,
    title: "Music & Cultural Dance",
    description: "Celebrating culture and togetherness through rhythm, movement, and tradition.",
    details: ["Live drumming and Afrobeat sessions", "Traditional lullabies and global rhythms", "Gospel-house celebrations (e.g., 'Jerusalem')", "Multicultural playlists (Congolese, Caribbean, Afrobeat)"],
    image: "programMusic" as const,
    frequency: "Weekly",
    ageGroup: "All Ages"
  }];
  const celebrations = [{
    title: "African Pride Day",
    description: "Celebrating African heritage, culture, music, and traditional dress.",
    icon: Globe
  }, {
    title: "Autism Awareness Fun Day",
    description: "Raising awareness through inclusive games, activities, and education.",
    icon: Heart
  }, {
    title: "Grandparents' Day",
    description: "Honoring the wisdom and love of grandparents in our community.",
    icon: Users
  }, {
    title: "Sibling Celebration & Birthdays",
    description: "Special events recognizing the bonds between siblings and celebrating birthdays.",
    icon: Calendar
  }];
  return <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <PhotoSection photo="programsHero" backdrop priority 
        className="py-32 bg-cover bg-center relative"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in text-white">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Our Programs
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Inclusive activities designed for every family, every ability, every culture
            </p>
          </div>
        </div>
      </PhotoSection>

      {/* Main Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-12 text-center">
            Core Activities
          </h2>
          <div className="space-y-12">
            {mainPrograms.map((program, index) => <Card key={index} className="overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{
            animationDelay: `${index * 150}ms`
          }}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`order-2 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <CardContent className="p-8 h-full flex flex-col justify-center">
                      <program.icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-3xl font-heading font-semibold mb-4">
                        {program.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {program.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {program.details.map((detail, i) => <li key={i} className="flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{detail}</span>
                          </li>)}
                      </ul>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{program.frequency}</Badge>
                        <Badge variant="outline">{program.ageGroup}</Badge>
                      </div>
                    </CardContent>
                  </div>
                  <div className={`order-1 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="h-full min-h-[300px] md:min-h-[400px]">
                      <GalleryPhoto photo={program.image} alt={program.title} className="w-full h-full aspect-[4/3] object-cover" />
                    </div>
                  </div>
                </div>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Parent Support */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <GalleryPhoto photo="programParents" alt="Parent support circle" className="aspect-[4/3] rounded-lg shadow-card" />
              </div>
              <div className="animate-slide-up">
                <Heart className="w-12 h-12 text-primary mb-4" />
                <h2 className="text-4xl font-heading font-bold mb-6">
                  Circle of Support for Parents
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Safe space discussions led by trained well-being advisors for carers and parents
                  to share experiences and receive emotional support.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-muted-foreground">Parenting stress management</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-muted-foreground">Mental health and resilience</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-muted-foreground">
                      Navigating special needs support systems
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p className="text-muted-foreground">Peer support and community building</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Celebrations */}
      <PhotoSection photo="programCelebrations" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Monthly Themed Celebration Days
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Special events that reflect inclusion, diversity, and bring our community together
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {celebrations.map((celebration, index) => <Card key={index} className="shadow-card hover:shadow-warm transition-all duration-300 animate-scale-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <celebration.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">
                    {celebration.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{celebration.description}</p>
                </CardContent>
              </Card>)}
          </div>

          <Card className="bg-accent/10 border-accent">
            <CardContent className="p-8">
              <h3 className="text-2xl font-heading font-semibold mb-4 text-center">
                What to Expect at Celebration Days
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="font-semibold mb-2">Cultural Activities</p>
                  <p className="text-sm text-muted-foreground">
                    Dressing up, storytelling, and traditional customs
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-2">Fun & Games</p>
                  <p className="text-sm text-muted-foreground">
                    Dance-offs, inclusive games, and karaoke
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-2">Food Sharing</p>
                  <p className="text-sm text-muted-foreground">
                    Cultural food sharing and community meals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PhotoSection>

      {/* Digital Community */}
      <PhotoSection photo="programOnline" backdrop className="py-20  text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-heading font-bold mb-6">
              Stay Connected Online
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our digital community for updates, reminders, peer support, and event recaps
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-2">WhatsApp Group</h3>
                  <p className="text-sm text-white/80">Real-time updates and reminders</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-2">Facebook Group</h3>
                  <p className="text-sm text-white/80">Share experiences and support</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-2">Instagram</h3>
                  <p className="text-sm text-white/80">Event highlights and reels</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PhotoSection>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <GalleryPhoto photo="programJoin" alt="Community activities" className="aspect-[4/3] rounded-lg shadow-card mb-8" />
            <div className="text-center bg-muted/30 rounded-2xl p-8">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Ready to Join?
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Pre-booking is essential!
              </p>
              <p className="text-lg mb-6">
                Email your child's name & age to:{" "}
                <a className="text-primary hover:underline font-semibold" href="mailto:contact@happynesscomefirst.com">
                  contact@happynesscomefirst.com
                </a>
              </p>
              <p className="text-lg font-semibold text-primary">
                Contact: +44 7774 134000
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Programs;