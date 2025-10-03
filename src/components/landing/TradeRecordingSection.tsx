
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PenLine, Image, Tags, Calendar, Bot, FileText } from 'lucide-react';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

const TradeRecordingSection = () => {
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  return <section className="py-16 sm:py-24 md:py-32 px-6 sm:px-8 bg-gradient-to-b from-background to-card/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left content */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7
        }} viewport={{
          once: true
        }} className="order-1 lg:order-1">
            <div className="space-y-6 sm:space-y-8 lg:max-w-lg">
              <div className="space-y-3 mb-8">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <PenLine className="mr-2 h-4 w-4" />
                  Trade Journal
                </div>
                {/* Updated for better SEO - proper heading structure */}
                <h2 className={`${isXSmall ? "text-3xl" : isMobile ? "text-4xl" : "text-5xl md:text-6xl"} font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent`}>
                  Record Your Trades with <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">Precision</span>
                </h2>
              </div>
              
              <p className={`${isXSmall ? "text-base" : isMobile ? "text-lg" : "text-xl"} text-muted-foreground leading-relaxed mb-8`}>
                Document every aspect of your trades with our comprehensive journal. Capture screenshots, notes, emotions, and detailed analytics in one place.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Image className={`${isXSmall ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                  </div>
                  <div>
                    <h3 className={`${isXSmall ? "text-base" : "text-lg"} font-semibold mb-1`}>Multi-screenshot Support</h3>
                    <p className={`${isXSmall ? "text-sm" : "text-base"} text-muted-foreground`}>Upload multiple chart images for complete trade documentation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tags className={`${isXSmall ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                  </div>
                  <div>
                    <h3 className={`${isXSmall ? "text-base" : "text-lg"} font-semibold mb-1`}>Trade Tagging</h3>
                    <p className={`${isXSmall ? "text-sm" : "text-base"} text-muted-foreground`}>Organize trades with custom tags for better analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className={`${isXSmall ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                  </div>
                  <div>
                    <h3 className={`${isXSmall ? "text-base" : "text-lg"} font-semibold mb-1`}>Trade Calendar</h3>
                    <p className={`${isXSmall ? "text-sm" : "text-base"} text-muted-foreground`}>Visualize your trading frequency and performance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className={`${isXSmall ? "h-4 w-4" : "h-5 w-5"} text-primary`} />
                  </div>
                  <div>
                    <h3 className={`${isXSmall ? "text-base" : "text-lg"} font-semibold mb-1`}>AI Analysis</h3>
                    <p className={`${isXSmall ? "text-sm" : "text-base"} text-muted-foreground`}>Get AI-powered insights on your trading patterns</p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Start Journaling
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right content - Trade form preview */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="order-2 lg:order-2 relative mx-auto lg:mx-0 max-w-[360px] sm:max-w-[420px] lg:max-w-none w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-20 blur-xl"></div>
            <div className="relative bg-card/30 backdrop-blur-sm border border-primary/10 shadow-xl rounded-xl overflow-hidden">
              {/* Form header */}
              <div className="border-b border-border/20 bg-background/70 backdrop-blur-sm p-3 sm:p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 sm:h-3 sm:w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 sm:h-3 sm:w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-muted-foreground">Trade Journal</div>
                <div className="w-12 sm:w-16"></div>
              </div>
              
              <div className="p-5 sm:p-6">
                {/* Form fields with improved spacing */}
                <div className="grid grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="col-span-2">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Symbol</div>
                    <div className="text-sm sm:text-base font-medium bg-background/70 border border-border/30 rounded-md p-2 sm:p-2.5">RELIANCE</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Type</div>
                    <div className="text-xs sm:text-sm font-medium bg-green-500/10 text-green-500 border border-green-500/20 rounded-md p-2 sm:p-2.5 text-center">Long</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Date</div>
                    <div className="text-sm sm:text-base font-medium bg-background/70 border border-border/30 rounded-md p-2 sm:p-2.5">24 Apr, 2025</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Entry Price</div>
                    <div className="text-sm sm:text-base font-medium bg-background/70 border border-border/30 rounded-md p-2 sm:p-2.5">₹2,846.50</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Exit Price</div>
                    <div className="text-sm sm:text-base font-medium bg-background/70 border border-border/30 rounded-md p-2 sm:p-2.5">₹2,891.25</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">P&L</div>
                    <div className="text-sm sm:text-base font-medium bg-green-500/10 text-green-500 border border-green-500/20 rounded-md p-2 sm:p-2.5">+₹44,750.00</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">ROI</div>
                    <div className="text-sm sm:text-base font-medium bg-green-500/10 text-green-500 border border-green-500/20 rounded-md p-2 sm:p-2.5">+1.57%</div>
                  </div>
                </div>
                
                {/* Screenshots section with better spacing */}
                <div className="mb-4 sm:mb-5">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Screenshots</div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="aspect-[16/9] bg-background/70 rounded-md border border-border/30 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10"></div>
                    </div>
                    <div className="aspect-[16/9] bg-background/70 rounded-md border border-border/30 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5"></div>
                    </div>
                    <div className="aspect-[16/9] bg-background/70 rounded-md border border-border/30 flex items-center justify-center">
                      <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                        <div className="text-sm">+</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes section with improved spacing */}
                <div className="mb-4 sm:mb-5">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Notes</div>
                  <div className="text-xs sm:text-sm bg-background/70 border border-border/30 rounded-md p-3 sm:p-4 h-16 sm:h-20 overflow-hidden">
                    Entered long position after confirming bullish trend on 15min chart. Strong support at 2840 level with increasing volume. Exited at resistance level with profit target hit...
                  </div>
                </div>
                
                {/* Save button with better padding */}
                <div className="flex justify-end space-x-2 mt-5">
                  <div className="rounded-md bg-primary px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white font-medium">Save</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Replace the duplicate buttons with a single button for "Explore Trade Entry" */}
        <div className="col-span-1 lg:col-span-2 flex justify-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-primary/30 hover:border-primary hover:bg-primary/5 group">
            <Link to="/features/trade-entry" className="flex items-center gap-2">
              Explore Trade Entry
              <FileText className="h-4 w-4 text-primary" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};

export default TradeRecordingSection;
