import { CheckCircle, TrendingUp, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImpact from "@/assets/hero-impact.jpg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Impact = () => {
  const outcomes = [
    {
      title: "Increased Participation",
      icon: Users,
      indicators: [
        "Number of families attending sessions",
        "Participant demographics (ethnicity, disability, etc.)",
        "Repeat attendance rates",
      ],
      color: "text-primary",
    },
    {
      title: "Reduced Isolation",
      icon: TrendingUp,
      indicators: [
        "Parent self-reported stress levels",
        "Participation in parent support groups",
        "Testimonials and mood tracking",
      ],
      color: "text-secondary",
    },
    {
      title: "Improved Well-being",
      icon: CheckCircle,
      indicators: [
        "Child mood indicators (smiley faces)",
        "Engagement in group activities",
        "Parent observations",
      ],
      color: "text-accent",
    },
    {
      title: "Celebration of Culture",
      icon: Target,
      indicators: [
        "Attendance at cultural days",
        "Representation of cultures in events",
        "Positive feedback from families",
      ],
      color: "text-primary",
    },
  ];

  const monitoringActivities = [
    {
      activity: "Family Fitness & Dance Sessions",
      output: "Group sessions for all ages",
      indicators: ["Sessions held", "Attendance numbers", "Demographics", "Engagement levels"],
      collection: "Sign-in sheets, Registration forms, Observation checklists, Photos/videos",
      frequency: "After each session",
    },
    {
      activity: "Sensory Play & Calm Zones",
      output: "Sensory-friendly spaces",
      indicators: ["Children using zones", "Parent feedback", "Needs being met"],
      collection: "Parent surveys, Staff observation logs, Usage tracker",
      frequency: "During & after sessions",
    },
    {
      activity: "Music & Cultural Dance",
      output: "Interactive cultural sessions",
      indicators: ["Sessions held", "Participation rate", "Cultural inclusion feedback"],
      collection: "Photos/videos, Feedback forms, Staff reports",
      frequency: "End of each session",
    },
    {
      activity: "Celebration Days",
      output: "Themed family events",
      indicators: ["Events held", "Attendee numbers", "Community diversity", "Media coverage"],
      collection: "Event logs, Sign-in sheets, Social media metrics",
      frequency: "After each event",
    },
    {
      activity: "Parent Support Circles",
      output: "Safe space discussions",
      indicators: ["Sessions held", "Attendance", "Topics discussed", "Emotional impact"],
      collection: "Sign-in sheets, Anonymous feedback, Mood trackers",
      frequency: "After each circle",
    },
    {
      activity: "Digital Community",
      output: "WhatsApp, Facebook, Instagram, TikTok",
      indicators: ["Active members", "Engagement metrics", "Peer support activity"],
      collection: "Platform analytics, Screenshots, Member surveys",
      frequency: "Monthly",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="py-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroImpact})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in text-white">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Impact & Evaluation
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Measuring our impact and continuously improving our services
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are committed to understanding and documenting the positive changes our programs
              bring to families. Our monitoring and evaluation framework ensures we track outcomes,
              gather feedback, and continuously improve our services.
            </p>
          </div>
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-12 text-center">
            Key Outcomes We Track
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {outcomes.map((outcome, index) => (
              <Card
                key={index}
                className="shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <outcome.icon className={`w-10 h-10 ${outcome.color}`} />
                    <CardTitle className="text-2xl">{outcome.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3">Key Indicators:</h4>
                  <ul className="space-y-2">
                    {outcome.indicators.map((indicator, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring Framework */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-8 text-center">
            Monitoring & Evaluation Framework
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Our comprehensive framework tracks activities, outputs, indicators, and collection
            methods to ensure transparency and effectiveness.
          </p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Activity</TableHead>
                  <TableHead className="font-semibold">Output</TableHead>
                  <TableHead className="font-semibold">Key Indicators</TableHead>
                  <TableHead className="font-semibold">Collection Method</TableHead>
                  <TableHead className="font-semibold">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monitoringActivities.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.activity}</TableCell>
                    <TableCell>{item.output}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {item.indicators.map((indicator, i) => (
                          <li key={i}>{indicator}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-sm">{item.collection}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.frequency}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Collection Methods */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-12 text-center">
            How We Collect Data
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Quantitative Methods</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Sign-in sheets and attendance logs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Registration forms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Social media analytics</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Usage trackers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Qualitative Methods</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Parent feedback forms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Testimonials and interviews</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Staff observation reports</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Anonymous surveys</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Creative Methods</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Child smiley-face feedback</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Drawings and artwork</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Photos and videos (with consent)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground text-sm">Mood trackers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Responsibility */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-primary/5 border-primary max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-heading font-bold mb-6 text-center">
                Who is Responsible?
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Project Staff & Facilitators</p>
                  <p className="text-sm text-muted-foreground">
                    Collect attendance data, observations, and session feedback
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Mental Health Advisors</p>
                  <p className="text-sm text-muted-foreground">
                    Track parent support group outcomes and emotional impact
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Digital Media Coordinator</p>
                  <p className="text-sm text-muted-foreground">
                    Monitor online engagement and community interaction
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Evaluation Officer</p>
                  <p className="text-sm text-muted-foreground">
                    Oversee data collection, analysis, and reporting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Impact;
