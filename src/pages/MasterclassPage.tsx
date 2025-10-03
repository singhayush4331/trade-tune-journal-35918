import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ModernHeroSection from '@/components/landing/ModernHeroSection';
import CommunityShowcase from '@/components/landing/CommunityShowcase';
import CreativeFeaturesShowcase from '@/components/landing/CreativeFeaturesShowcase';
import DualMasterclassShowcase from '@/components/landing/DualMasterclassShowcase';
import TradersGallery from '@/components/landing/TradersGallery';
import SuccessStories from '@/components/landing/SuccessStories';
import Footer from '@/components/landing/Footer';
import RealResultsShowcase from '@/components/landing/RealResultsShowcase';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { MapPin, Monitor, Menu, GraduationCap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const MasterclassPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 60 : 80,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: isMobile ? 0.2 : 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 40 : 50,
      rotateX: isMobile ? 10 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Wiggly Trading Platform | AI-Powered Trading Analytics</title>
        <meta name="description" content="Transform your trading with AI-powered analytics, institutional-grade tools, and real-time insights. Join thousands of successful traders on Wiggly." />
        <meta name="keywords" content="trading platform, AI trading, market analytics, trading tools, institutional trading, financial technology" />
        <link rel="canonical" href="https://wiggly.lovable.dev/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiggly.lovable.dev/" />
        <meta property="og:title" content="Wiggly Trading Platform | AI-Powered Trading Analytics" />
        <meta property="og:description" content="Transform your trading with AI-powered analytics, institutional-grade tools, and real-time insights." />
        <meta property="og:image" content="https://wiggly.lovable.dev/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://wiggly.lovable.dev/" />
        <meta property="twitter:title" content="Wiggly Trading Platform | AI-Powered Trading Analytics" />
        <meta property="twitter:description" content="Transform your trading with AI-powered analytics, institutional-grade tools, and real-time insights." />
        <meta property="twitter:image" content="https://wiggly.lovable.dev/og-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Wiggly Trading Platform",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "description": "AI-powered trading analytics platform with institutional-grade tools and real-time insights",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1247"
            }
          })}
        </script>
      </Helmet>

      {/* Navigation Header */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>Haven Ark</h1>
              <span className="text-sm text-muted-foreground hidden sm:block">Trading Academy</span>
            </div>
            
            {!isMobile ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground hover:text-primary">
                      Programs
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px] lg:w-[500px]">
                        <NavigationMenuLink asChild>
                          <div 
                            className="group grid h-auto w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            onClick={() => navigate('/offline-program')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-md bg-primary/10 text-primary">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none">Offline Program</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Face-to-face learning with expert mentors in major cities
                                </p>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <div 
                            className="group grid h-auto w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            onClick={() => navigate('/online-program')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Monitor className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none">Online Program</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Learn from anywhere with live sessions and interactive content
                                </p>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                      onClick={() => navigate('/academy')}
                    >
                      Academy
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                      onClick={() => navigate('/wiggly')}
                    >
                      <div className="flex items-center space-x-2">
                        <img 
                          src={resolvedTheme === 'dark' ? 
                            "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png" : 
                            "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
                          } 
                          alt="Wiggly Logo" 
                          className="w-5 h-5 object-contain"
                        />
                        <span>Wiggly</span>
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col space-y-4 pt-4">
                    <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                    
                    {/* Programs Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Programs</h3>
                      
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/offline-program');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-primary/10 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Offline Program</div>
                            <div className="text-xs text-muted-foreground">Face-to-face learning in major cities</div>
                          </div>
                        </div>
                      </button>
                      
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/online-program');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Monitor className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Online Program</div>
                            <div className="text-xs text-muted-foreground">Learn from anywhere with live sessions</div>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Other Navigation Items */}
                    <div className="space-y-3">
                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/academy');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Academy</div>
                            <div className="text-xs text-muted-foreground">Trading courses and resources</div>
                          </div>
                        </div>
                      </button>

                      <button 
                        className="w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          navigate('/wiggly');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <img 
                              src={resolvedTheme === 'dark' ? 
                                "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png" : 
                                "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
                              } 
                              alt="Wiggly Logo" 
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Wiggly AI</div>
                            <div className="text-xs text-muted-foreground">AI-powered trading analytics</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
              <Button 
                variant="ghost" 
                onClick={() => window.open('https://havenark.exlyapp.com/eud/login/email', '_blank')}
                className="hover:text-primary"
                size={isMobile ? "sm" : "default"}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/haven-ark/signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size={isMobile ? "sm" : "default"}
              >
                {isMobile ? "Start" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <ModernHeroSection />
      </motion.section>
      
      {/* Creative Features Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants}>
          <CreativeFeaturesShowcase />
        </motion.div>
      </motion.section>
      
      {/* Community Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants}>
          <CommunityShowcase />
        </motion.div>
      </motion.section>
      
      {/* Real Results Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants}>
          <RealResultsShowcase />
        </motion.div>
      </motion.section>
      
      {/* Traders Gallery */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants}>
          <TradersGallery />
        </motion.div>
      </motion.section>
      
      {/* Masterclass Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants}>
          <DualMasterclassShowcase />
        </motion.div>
      </motion.section>
      
      {/* Success Stories */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants}>
          <SuccessStories />
        </motion.div>
      </motion.section>
      
      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <Footer />
      </motion.footer>
    </div>
  );
};

export default MasterclassPage;