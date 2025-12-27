import { Shield, AlertTriangle, Phone, Lock, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroSafeguarding from "@/assets/hero-safeguarding.jpg";

const Safeguarding = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="py-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroSafeguarding})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in text-white">
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Safeguarding Policy
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Protecting every person who encounters our services
            </p>
          </div>
        </div>
      </section>

      {/* Policy Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Alert className="mb-8 border-primary">
              <Shield className="h-5 w-5 text-primary" />
              <AlertTitle className="text-xl font-heading font-semibold">
                Policy Statement
              </AlertTitle>
              <AlertDescription className="mt-2 text-base">
                In the United Kingdom, safeguarding means protecting a person's right to live in
                safety, free from abuse and neglect. At Happiness Comes First SCIO, we understand
                this to mean protecting vulnerable people from any potential harm that could arise
                from encountering our staff or activities.
              </AlertDescription>
            </Alert>

            <Card className="shadow-card mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">What We Safeguard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Vulnerable Adult Safeguarding</p>
                      <p className="text-sm text-muted-foreground">
                        Protection from all forms of harm, abuse, neglect and exploitation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Protection from Sexual Exploitation and Abuse</p>
                      <p className="text-sm text-muted-foreground">
                        Zero tolerance for any form of exploitation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Happiness Comes First SCIO believes that every person we encounter has the right to be
              protected from all forms of harm, abuse, neglect and exploitation. We are committed to
              ensuring that we as an organisation take all reasonable steps to do so.
            </p>

            <p className="text-muted-foreground mb-4">
              This policy applies to anyone working on behalf of Happiness Comes First SCIO. This
              includes our Board of Trustees, paid staff and volunteers.
            </p>
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-8">Responsibilities</h2>
            <p className="text-lg text-muted-foreground mb-8">
              The ultimate responsibility for this policy rests with the Happiness Comes First SCIO
              Board of Trustees.
            </p>

            <h3 className="text-2xl font-heading font-semibold mb-6">
              Our Organisational Commitments
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "All concerns or suspicions of a safeguarding nature will be taken seriously and responded to quickly and appropriately",
                "All trustees, staff and volunteers are clear about their safeguarding responsibilities",
                "All trustees, staff and volunteers know how to respond to safeguarding concerns appropriately",
                "All personal information is stored and recorded professionally and securely",
                "All vulnerable adults have the right to protection from all types of harm and abuse",
                "All vulnerable adults have the right to be treated with respect and dignity",
                "Staff receive appropriate safeguarding training at levels corresponding with their roles",
                "All reports of safeguarding concerns are followed up promptly",
                "Effective complaints measures are in place",
              ].map((commitment, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-6 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">{commitment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staff & Volunteer Duties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-8">
              Staff & Volunteer Duties
            </h2>
            <Card className="shadow-card mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Everyone Must:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">Report immediately</span> - Any concerns with
                      respect to safeguarding must be reported to the Board of Trustees as quickly as
                      possible
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">Consider safeguarding when planning</span> - All
                      activities must be planned in a way that protects people from any risk of harm
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">Maintain appropriate boundaries</span> - Take all
                      reasonable steps to ensure no unsupervised access to vulnerable adults
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reporting Procedures */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-8">
              How to Report a Safeguarding Concern
            </h2>
            <div className="space-y-6">
              <Card className="shadow-card border-primary">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl">Step 1: Internal Reporting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Raise any concerns with the Board of Trustees as quickly as possible. If you do
                    not feel comfortable reporting to a specific member (e.g., if that person is
                    involved in the concern), report to another member.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-primary">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl">Step 2: External Location Reporting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If working in an external location (such as another organisation) and a concern
                    arises, report directly to that organisation's safeguarding lead officer AND inform
                    a member of Happiness Comes First SCIO's Board of Trustees.
                  </p>
                </CardContent>
              </Card>

              <Alert className="border-destructive">
                <Phone className="h-5 w-5 text-destructive" />
                <AlertTitle className="text-xl font-heading font-semibold text-destructive">
                  Emergency Situations
                </AlertTitle>
                <AlertDescription className="mt-2 text-base">
                  If the situation is urgent or immediately dangerous, all staff and volunteers are
                  encouraged to contact the police on <strong>999</strong>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Confidentiality */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Lock className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl">Confidentiality</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Board of Trustees will ensure that appropriate procedures are in place to
                  maintain a record of any safeguarding concerns reported, along with any outcomes.
                </p>
                <p>
                  Happiness Comes First SCIO will ensure that confidentiality is always maintained
                  when dealing with any safeguarding concerns.
                </p>
                <p className="font-semibold">
                  Any information relating to the concern and subsequent actions will be shared on a
                  need-to-know basis only, and the information will always be kept secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="space-y-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Signature of the Chair</p>
                    <p className="font-semibold">Sandra Linda Nshangalume</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Signature</p>
                    <p className="font-semibold">8/7/2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Next Review</p>
                    <p className="font-semibold">8/7/2026</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Safeguarding;
