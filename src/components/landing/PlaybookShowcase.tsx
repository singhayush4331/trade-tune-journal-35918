
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, TrendingUp, Trash2, Edit, Target, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';

const PlaybookShowcase = () => {
  const playbooks = [
    {
      title: "Fair Value Gap Strategy",
      description: "Trade price returning to fill fair value gaps",
      tags: ["fair value gap", "supply demand", "technical"],
      winRate: 100,
      profitLoss: 260000,
      trades: "2/2",
      riskReward: "1:2",
      isLossMaking: false,
      created: "4/13/2025"
    },
    {
      title: "Order Block Strategy",
      description: "Trade from institutional order blocks and mitigation",
      tags: ["smart money", "order blocks", "mitigation"],
      winRate: 50,
      profitLoss: -220000,
      trades: "1/2",
      riskReward: "1:2",
      isLossMaking: true,
      created: "4/13/2025"
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-background/90 via-background to-background/95 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute top-1/3 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-left relative z-10"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <span className="relative inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                <BookOpen className="mr-2 h-4 w-4" />
                Trading Playbooks
              </span>
            </div>
            <h2 className="text-4xl font-bold mt-6 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground my-[25px] py-[11px] sm:text-5xl">
              Proven Trading <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Strategies</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Document and track your trading strategies with our comprehensive playbook system. Build, test, and refine your strategies for consistent results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Create Playbooks
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary shadow-sm">
                <Link to="/features/playbooks" className="flex items-center gap-2">
                  Explore Playbooks
                  <BookOpen className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right showcase cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {playbooks.map((playbook, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="relative p-6 bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
                  {/* Card gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {playbook.title}
                      </h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {playbook.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {playbook.tags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Win Rate</span>
                        <span className={`text-lg font-semibold ${playbook.winRate >= 75 ? 'text-green-500' : 'text-primary'}`}>
                          {playbook.winRate}% ({playbook.trades})
                        </span>
                      </div>
                      <Progress value={playbook.winRate} className="h-2" />
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-lg ${playbook.isLossMaking ? 'bg-destructive/10' : 'bg-success/10'}`}>
                      <span className="text-sm">R:R {playbook.riskReward}</span>
                      <div className={`flex items-center gap-1.5 text-sm font-medium ${playbook.isLossMaking ? 'text-destructive' : 'text-success'}`}>
                        {!playbook.isLossMaking && <CheckCircle className="h-4 w-4" />}
                        {playbook.isLossMaking ? 'Loss-making' : 'Profitable'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Created: {playbook.created}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlaybookShowcase;
