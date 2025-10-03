
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const ContactPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${isMobile ? "text-3xl" : "text-4xl"} font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4`}
          >
            Contact Us
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <p className="text-muted-foreground mb-8">
              We're here to help! Whether you have questions about our services, need technical support,
              or want to provide feedback, our team is ready to assist you.
            </p>

            <section className="mb-8 grid gap-6 md:grid-cols-3">
              <Card className="p-6 border border-border/40 bg-card/50 transition-all hover:shadow-md hover:border-border/80">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                    <p className="text-muted-foreground mb-3">
                      For general inquiries, support requests, or any questions about our services:
                    </p>
                    <a 
                      href="mailto:support@wiggly.co.in" 
                      className="text-primary hover:underline font-medium"
                    >
                      support@wiggly.co.in
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border/40 bg-card/50 transition-all hover:shadow-md hover:border-border/80">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                    <p className="text-muted-foreground mb-3">
                      Available Monday to Friday, 9:00 AM - 5:00 PM EST.
                      Our support team is ready to assist you in real-time.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-primary/50 hover:border-primary text-primary"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border/40 bg-card/50 transition-all hover:shadow-md hover:border-border/80">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Company Address</h3>
                    <p className="text-muted-foreground">
                      Finloop Tech Pvt Ltd<br />
                      13/470, VINI NIVAS, THOTTICHAL, KUNIYAN,<br />
                      Taliparamba, Karivellur, Kannur,<br />
                      Kerala, 670521
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
              <p className="text-foreground/80 mb-2">
                Our customer support team is available at the following times:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                <li>Monday to Friday: 9:00 AM - 6:00 PM IST</li>
                <li>Saturday: 10:00 AM - 2:00 PM IST</li>
                <li>Sunday: Closed</li>
              </ul>
              <p className="text-foreground/80 mt-4">
                We strive to respond to all email inquiries within 24 business hours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
              <p className="text-foreground/80">
                We value your feedback! If you have suggestions on how we can improve our platform
                or any features you'd like to see in future updates, please let us know at{" "}
                <a href="mailto:support@wiggly.co.in" className="text-primary hover:underline">
                  support@wiggly.co.in
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
