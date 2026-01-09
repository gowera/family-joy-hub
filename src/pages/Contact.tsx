import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroContact from "@/assets/hero-contact.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    childName: "",
    childAge: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-form', {
        body: formData
      });
      
      if (error) throw error;
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        childName: "",
        childAge: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="py-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroContact})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in text-white">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              We'd love to hear from you. Pre-booking is essential for all sessions!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-heading font-bold mb-8">Contact Information</h2>
              <div className="space-y-6 mb-8">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <a
                          href="tel:+447774134000"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          +44 7774 134000
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a
                          href="mailto:contactsandrapink@gmail.com"
                          className="text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          contactsandrapink@gmail.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          Glasgow Community Centre
                          <br />
                          Glasgow, UK
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-accent/10 border-accent">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-3">
                    Important: Pre-booking Required
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    To ensure we can accommodate your family and provide the best experience, please
                    pre-book by emailing your child's name and age to the email address above.
                  </p>
                  <p className="text-sm font-semibold">
                    Cost: £5-£10 per family (sliding scale)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-heading font-bold mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+44 ..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium mb-2">
                      Child's Name
                    </label>
                    <Input
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleChange}
                      placeholder="If pre-booking"
                    />
                  </div>
                  <div>
                    <label htmlFor="childAge" className="block text-sm font-medium mb-2">
                      Child's Age
                    </label>
                    <Input
                      id="childAge"
                      name="childAge"
                      type="number"
                      value={formData.childAge}
                      onChange={handleChange}
                      placeholder="Age"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your interest in our programs, any questions, or special needs we should be aware of..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-8">Session Times</h2>
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <p className="font-semibold text-left">Day</p>
                    <p className="font-semibold text-left">Time</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                    <p>Saturdays</p>
                    <p className="text-muted-foreground">10:00 AM - 12:00 PM</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                    <p>Sundays</p>
                    <p className="text-muted-foreground">2:00 PM - 4:00 PM</p>
                  </div>
                  <p className="text-sm text-muted-foreground pt-4 border-t">
                    * Session times may vary. Please contact us to confirm before visiting.
                  </p>
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

export default Contact;
