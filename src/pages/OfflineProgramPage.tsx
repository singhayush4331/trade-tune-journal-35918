import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Award, Clock, CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OfflineProgramPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Face-to-Face Learning",
      description: "Direct interaction with expert instructors and fellow traders"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Prime Locations",
      description: "Training centers in major financial districts across India"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Intensive Sessions",
      description: "4-week comprehensive program with hands-on practice"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Certification",
      description: "Industry-recognized certificate upon successful completion"
    }
  ];

  const locations = [
    { city: "Mumbai", address: "Bandra Kurla Complex", status: "Active" },
    { city: "Delhi", address: "Connaught Place", status: "Active" },
    { city: "Bangalore", address: "Koramangala", status: "Coming Soon" },
    { city: "Pune", address: "Baner", status: "Coming Soon" }
  ];

  const curriculum = [
    "Market Fundamentals & Analysis",
    "Risk Management Strategies",
    "Technical Analysis Mastery",
    "Options & Derivatives Trading",
    "Psychology of Trading",
    "Live Trading Sessions",
    "Portfolio Management",
    "Post-Program Mentorship"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Offline Trading Program | Haven Ark Trading Academy</title>
        <meta name="description" content="Join our intensive offline trading program with hands-on learning, expert mentorship, and industry certification in major Indian cities." />
        <meta name="keywords" content="offline trading course, trading academy, face-to-face trading education, trading certification, Mumbai trading course, Delhi trading course" />
        <link rel="canonical" href="https://wiggly.lovable.dev/offline-program" />
      </Helmet>

      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-lg font-bold text-primary hover:text-primary/80"
              >
                Haven Ark
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/haven-ark/signup')}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-500 text-white hover:bg-green-600">
              India's #1 Offline Trading Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Master Trading with Expert Mentors
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our intensive offline trading program featuring face-to-face learning, 
              live trading sessions, and personalized mentorship from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate('/haven-ark/signup')}
              >
                Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Offline Learning?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the power of face-to-face learning with immediate feedback and real-time collaboration
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Curriculum</h2>
              <p className="text-muted-foreground">
                Our comprehensive 4-week program covers everything you need to become a successful trader
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {curriculum.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-background rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Training Locations</h2>
            <p className="text-muted-foreground">
              Find a training center near you across major Indian cities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{location.city}</CardTitle>
                    <Badge 
                      variant={location.status === 'Active' ? 'default' : 'secondary'}
                      className={location.status === 'Active' ? 'bg-green-500 text-white' : ''}
                    >
                      {location.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful traders who started with our offline program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/haven-ark/signup')}
              className="hover:bg-background/90"
            >
              Enroll Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfflineProgramPage;