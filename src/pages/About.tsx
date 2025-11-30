import { Target, Heart, Users, Sparkles, Globe, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import activity4 from "@/assets/activity-4.jpeg";
import activity5 from "@/assets/activity-5.jpeg";
import communityBg from "@/assets/community-bg.jpg";

const About = () => {
  const specificAims = [
    {
      icon: Users,
      title: "Increase Participation",
      description: "To increase participation of underserved families from all ethnic, cultural, and migrant backgrounds, including those raising children with disabilities.",
    },
    {
      icon: Heart,
      title: "Reduce Isolation",
      description: "To reduce emotional stress, loneliness, and social isolation among parents, carers, and grandparents by building a support network.",
    },
    {
      icon: Sparkles,
      title: "Improve Well-being",
      description: "To improve emotional well-being, self-esteem, and confidence through shared physical activities and creative expression.",
    },
    {
      icon: Globe,
      title: "Celebrate Diversity",
      description: "To uplift and celebrate cultural identity, particularly among black, African, and migrant families through music, dance, and celebration.",
    },
    {
      icon: Shield,
      title: "Autism Awareness",
      description: "To increase understanding and visibility of autism and other additional needs through inclusive programming and neurodiverse-friendly spaces.",
    },
    {
      icon: Target,
      title: "Build Community",
      description: "To create safe, non-judgmental environments where families feel they belong, feel proud of who they are, and are empowered to grow together.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        className="py-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${communityBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              About Our Family Hub
            </h1>
            <p className="text-xl md:text-2xl">
              Where everyone belongs and happiness comes first
            </p>
          </div>
        </div>
      </section>

      {/* Overall Aim */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-8 text-center">Overall Aim</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To improve the physical health, emotional well-being, and sense of belonging among
                families from all ethnic and cultural backgrounds, particularly those raising
                children with disabilities, by providing inclusive, joyful, and culturally relevant
                activities that strengthen family bonds and build resilient communities.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                As physical activity is medicine, this project can have profound and positive impact
                on the NHS, both in terms of health outcomes and cost savings, reducing pressure on
                NHS services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-8 text-center">
              Why This Aim is Powerful
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-semibold mb-4">
                    Recognizing Invisible Struggles
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We speak directly to the heart of social inequality, acknowledging that families
                    from minority backgrounds and those with special needs are often excluded from
                    mainstream services.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-semibold mb-4">
                    Building Inclusive Spaces
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We commit to building joyful, safe, and inclusive spaces not just for children,
                    but also for parents, carers, and grandparents who may be carrying invisible
                    emotional burdens.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <img
                src={activity4}
                alt="Community activities"
                className="rounded-2xl shadow-card mb-8 w-full max-w-3xl mx-auto"
              />
              <blockquote className="text-2xl font-heading italic text-primary mb-4">
                "Children can laugh without being judged, parents can rest without feeling alone,
                and everyone can move, dance, and heal together"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Specific Aims */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-12 text-center">Specific Aims</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specificAims.map((aim, index) => (
              <Card
                key={index}
                className="shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <aim.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-3">{aim.title}</h3>
                  <p className="text-muted-foreground">{aim.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Values */}
      <section className="py-20 bg-hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-heading font-bold mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Heart className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold mb-3">Inclusion</h3>
                <p className="text-white/90">
                  Everyone belongs here, regardless of background, ability, or circumstance
                </p>
              </div>
              <div>
                <Users className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold mb-3">Community</h3>
                <p className="text-white/90">
                  Building strong connections and support networks for all families
                </p>
              </div>
              <div>
                <Sparkles className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold mb-3">Joy</h3>
                <p className="text-white/90">
                  Happiness and well-being are at the heart of everything we do
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Image */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <img
            src={activity5}
            alt="Community together"
            className="rounded-2xl shadow-card w-full max-w-5xl mx-auto"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
