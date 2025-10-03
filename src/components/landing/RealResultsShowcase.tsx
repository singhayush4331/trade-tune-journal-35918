import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, MessageSquare, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealResult } from '@/types/gallery';
import { loadRealResultsData } from '@/utils/real-results-utils';
const RealResultsShowcase = () => {
  const [realResults, setRealResults] = useState<RealResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    const loadResults = async () => {
      try {
        const results = await loadRealResultsData();
        setRealResults(results);
      } catch (error) {
        console.error('Error loading real results:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
    const handleUpdate = () => {
      loadResults();
    };
    window.addEventListener('real-results-updated', handleUpdate);
    return () => window.removeEventListener('real-results-updated', handleUpdate);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPlaying || isPaused || realResults.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % realResults.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, realResults.length]);

  // Auto-scroll for mobile horizontal view
  useEffect(() => {
    const mobileContainer = document.getElementById('mobile-scroll-container');
    if (!mobileContainer || !isPlaying || isPaused || realResults.length === 0) return;
    const interval = setInterval(() => {
      const cardWidth = 256 + 16; // w-64 + gap-4
      const maxScroll = mobileContainer.scrollWidth - mobileContainer.clientWidth;
      const currentScroll = mobileContainer.scrollLeft;
      const nextScroll = currentScroll + cardWidth;
      if (nextScroll >= maxScroll) {
        // Reset to beginning for infinite loop
        mobileContainer.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        mobileContainer.scrollTo({
          left: nextScroll,
          behavior: 'smooth'
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, realResults.length]);
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % realResults.length);
  };
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + realResults.length) % realResults.length);
  };

  // Calculate visible slides (4 images at once)
  const getVisibleSlides = () => {
    if (realResults.length === 0) return [];
    const visibleSlides = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % realResults.length;
      visibleSlides.push({
        ...realResults[index],
        displayIndex: i
      });
    }
    return visibleSlides;
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  if (loading || realResults.length === 0) {
    return <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-950/20 dark:via-green-950/15 dark:to-teal-950/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 max-w-md mx-auto"></div>
            <div className="h-16 bg-muted rounded mb-8 max-w-2xl mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-muted rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </section>;
  }
  const visibleSlides = getVisibleSlides();
  return <section className="relative py-10 md:py-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-950/20 dark:via-green-950/15 dark:to-teal-950/20" />
      
      {/* Floating Orbs - Hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="hidden md:block absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400/15 to-teal-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.3
      }} className="text-center">
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-2 md:mb-3">
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold shadow-lg shadow-emerald-500/25">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Real Student Results
            </Badge>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl lg:text-7xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Proof That It Works
          </motion.h2>
          
          
          
          
        </motion.div>

        {/* Results Gallery */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.2
      }} className="relative mb-8 md:mb-16" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Controls - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevSlide} className="bg-card/80 backdrop-blur-sm border-2 hover:bg-card/90 transition-all duration-300">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextSlide} className="bg-card/80 backdrop-blur-sm border-2 hover:bg-card/90 transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={togglePlayPause} className="bg-card/80 backdrop-blur-sm border-2 hover:bg-card/90 transition-all duration-300">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {visibleSlides.map((result, index) => <motion.div key={`${result.id}-${currentIndex}-${index}`} initial={{
            opacity: 0,
            scale: 0.8,
            y: 20
          }} animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }} className="group">
                <Card className="h-96 overflow-hidden bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-2 border-emerald-200/30 dark:border-emerald-800/30 hover:border-emerald-400/50 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/50 dark:to-green-950/50">
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      
                      <motion.img src={result.image} alt="Real trading result from Discord community" className="max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-105" whileHover={{
                    scale: 1.02
                  }} loading="lazy" onError={e => {
                    console.error('Image failed to load:', result.image);
                    e.currentTarget.style.display = 'none';
                  }} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>

          {/* Mobile & Tablet: Horizontal Scroll */}
          <div className="lg:hidden">
            <div id="mobile-scroll-container" className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {/* Duplicate results for seamless looping */}
              {[...realResults, ...realResults].map((result, index) => <motion.div key={`mobile-${result.id}-${index}`} initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.5,
              delay: index % realResults.length * 0.1
            }} className="flex-none w-64 md:w-80 snap-start group">
                  <Card className="h-80 md:h-96 overflow-hidden bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-2 border-emerald-200/30 dark:border-emerald-800/30 hover:border-emerald-400/50 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/25">
                    <CardContent className="p-0 h-full">
                      <div className="relative h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/50 dark:to-green-950/50">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        
                        <motion.img src={result.image} alt="Real trading result from Discord community" className="max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-105" whileHover={{
                      scale: 1.02
                    }} loading="lazy" onError={e => {
                      console.error('Image failed to load:', result.image);
                      e.currentTarget.style.display = 'none';
                    }} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>
            
            {/* Mobile controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex justify-center text-xs text-muted-foreground">
                <span>← Swipe to see more results →</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={togglePlayPause} className="bg-card/80 backdrop-blur-sm border-2 hover:bg-card/90 transition-all duration-300">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Indicators - Desktop only */}
          <div className="hidden lg:flex justify-center mt-8 gap-2">
            {realResults.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/50' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />)}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{
        once: true
      }} className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 md:gap-6">
            <Link to="/haven-ark-signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105">
                Join Our Community
                <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
            <Link to="/academy">
              
            </Link>
          </div>
          
          
        </motion.div>
      </div>
    </section>;
};
export default RealResultsShowcase;