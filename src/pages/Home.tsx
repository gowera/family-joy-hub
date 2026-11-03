import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Target, TrendingUp, Music, Palette, Activity, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSlider from "@/components/HeroSlider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import activity1 from "@/assets/activity-1.jpeg";
import activity2 from "@/assets/activity-2.jpeg";
import activity3 from "@/assets/activity-3.jpeg";
import inclusionIllustration from "@/assets/inclusion-illustration.jpg";
const Home = () => {
  const stats = [{
    icon: Users,
    value: "500+",
    label: "Families Supported"
  }, {
    icon: Activity,
    value: "100+",
    label: "Weekly Sessions"
  }, {
    icon: Heart,
    value: "95%",
    label: "Satisfaction Rate"
  }, {
    icon: TrendingUp,
    value: "85%",
    label: "Return Attendance"
  }];
  const programs = [{
    icon: Activity,
    title: "Fitness & Movement",
    description: "Family fitness sessions with dance, cardio, and Pilates designed for all ages and abilities.",
    image: activity1
  }, {
    icon: Music,
    title: "Cultural Celebration",
    description: "Music, dance, and celebration days honoring diverse cultures and traditions.",
    image: activity2
  }, {
    icon: Palette,
    title: "Creative Activities",
    description: "Arts, crafts, and sensory play stations for children with additional needs.",
    image: activity3
  }];
  return <div className="min-h-screen">
      <Navigation />
      <HeroSlider />

      {/* Mission Section */}
      <section className="py-20 bg-warm-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              To improve the physical health, emotional well-being, and sense of belonging among
              families from all ethnic and cultural backgrounds, particularly those raising children
              with disabilities.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We provide inclusive, joyful, and culturally relevant activities that strengthen
              family bonds and build resilient communities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center animate-scale-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-white" />
                <div className="text-4xl font-heading font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/90">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Inclusive activities designed to bring families together, celebrate diversity, and
              promote health and happiness.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => <Card key={index} className="overflow-hidden hover:shadow-warm transition-all duration-300 animate-slide-up" style={{
            animationDelay: `${index * 150}ms`
          }}>
                <div className="h-48 overflow-hidden">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <CardContent className="p-6">
                  <program.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-2xl font-heading font-semibold mb-3">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  <Link to="/programs">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center mt-12">
            <Link to="/programs">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Inclusion Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img src={inclusionIllustration} alt="Inclusive community" className="rounded-2xl shadow-card" />
            </div>
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                A Space for Everyone
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We recognize that families from minority backgrounds and those with special needs
                are often excluded from mainstream services. Our hub commits to building joyful,
                safe, and inclusive spaces where:
              </p>
              <ul className="space-y-4 mb-8">
                {["Children can laugh without being judged", "Parents can rest without feeling alone", "Everyone can move, dance, and heal together", "Cultural identity is celebrated and uplifted", "Additional needs are understood and accommodated"].map((item, index) => <li key={index} className="flex items-start space-x-3">
                    <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>)}
              </ul>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Join Our Community Today
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Pre-booking is essential. Email your child's name and age to get started!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Contact Us
                </Button>
              </Link>
              <Link to="/programs">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10 text-primary">
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Home;