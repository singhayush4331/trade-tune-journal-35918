
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, TrendingUp, BarChart3, Calendar, ChartLine, Filter, Image, ArrowRight, Send, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const WigglyAIFeature = () => {
  return <section className="relative py-20 px-4 bg-gradient-to-b from-background via-background/95 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.7
        }} viewport={{
          once: true
        }} className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start mb-6">
              <span className="relative inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                <Bot className="mr-2 h-4 w-4" />
                AI Assistant
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mt-6 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground my-[25px] py-[5px]">
              Your Personal Trading <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Mentor</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Get instant insights, analysis, and recommendations from our advanced AI trading assistant that continuously learns from your trading patterns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Try AI Assistant
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                <Link to="/features/ai-assistant" className="flex items-center gap-2">
                  Learn More
                  <Bot className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right chat interface */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.7
        }} viewport={{
          once: true
        }} className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-30 blur-xl animate-pulse"></div>
            <div className="relative rounded-xl border border-primary/10 bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-background/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-lg">Wiggly Assistant</h3>
                </div>
                <Button variant="outline" size="sm" className="text-xs flex gap-1.5 items-center">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </Button>
              </div>

              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {[{
                icon: TrendingUp,
                text: "Top 5 Profitable Trades"
              }, {
                icon: BarChart3,
                text: "Analysis by Symbol"
              }, {
                icon: Calendar,
                text: "Last Month Trades"
              }, {
                icon: ChartLine,
                text: "Strategy Performance"
              }, {
                icon: Filter,
                text: "All Time Statistics"
              }, {
                icon: Image,
                text: "Screenshot Data"
              }].map((item, index) => <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-2 bg-blue-500/80 text-white hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm">
                    <item.icon className="h-4 w-4" />
                    {item.text}
                  </Badge>)}
              </div>

              <div className="p-4 space-y-4 min-h-[280px] bg-background/50">
                <motion.div initial={{
                opacity: 0,
                y: 10
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.3
              }} viewport={{
                once: true
              }} className="flex gap-3 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center shadow-sm ring-2 ring-white/10">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-card shadow-md rounded-2xl rounded-tl-sm p-4 border border-border/40 backdrop-blur-sm">
                    <p className="text-sm">Hello! I'm your AI trading mentor from Wiggly. Ask me anything about your trades, strategies, or performance patterns.</p>
                  </div>
                </motion.div>

                <motion.div initial={{
                opacity: 0,
                y: 10
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.6
              }} viewport={{
                once: true
              }} className="flex gap-3 max-w-[85%] ml-auto">
                  <div className="bg-primary/10 shadow-sm rounded-2xl rounded-tr-sm p-4 border border-primary/10 backdrop-blur-sm">
                    <p className="text-sm">How was my last trade?</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-sm">
                    <span className="text-xs text-white">Me</span>
                  </div>
                </motion.div>

                <motion.div initial={{
                opacity: 0,
                y: 10
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.9
              }} viewport={{
                once: true
              }} className="flex gap-3 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center shadow-sm ring-2 ring-white/10">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-card shadow-md rounded-2xl rounded-tl-sm p-4 border border-border/40 backdrop-blur-sm">
                    <p className="text-sm">Your last trade was on GRASIM on April 18th, which resulted in a profit of ₹9.95L. It was a successful trade with a significant return. Would you like to know more details about this trade or analyze why it was so profitable?</p>
                  </div>
                </motion.div>
              </div>

              <div className="p-4 border-t bg-card/90 backdrop-blur-xl">
                <div className="relative">
                  <input type="text" placeholder="Ask about your trades, patterns, or suggestions..." className="w-full px-4 py-3 pr-12 bg-background/80 backdrop-blur-sm rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow" />
                  <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-gradient-to-r from-primary to-blue-500 shadow-md hover:shadow-lg transition-all hover:scale-105 text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

export default WigglyAIFeature;
