import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  ArrowRight,
  Shield,
  Bot,
  BarChart3,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

const ModernPricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for new traders getting started",
      icon: Sparkles,
      monthlyPrice: 299,
      annualPrice: 2390, // 2 months free
      color: "from-blue-500 to-cyan-500",
      popular: false,
      features: [
        "Basic AI Analytics",
        "Real-time Market Data",
        "5 Trades per Day",
        "Email Support",
        "Mobile App Access",
        "Basic Risk Management"
      ]
    },
    {
      name: "Professional",
      description: "Advanced tools for serious traders",
      icon: Zap,
      monthlyPrice: 599,
      annualPrice: 4792, // 2 months free
      color: "from-primary to-purple-600",
      popular: true,
      features: [
        "Advanced AI Analytics",
        "Institutional Data Feed",
        "Unlimited Trades",
        "Priority Support",
        "Advanced Risk Tools",
        "Portfolio Analytics",
        "Custom Alerts",
        "API Access"
      ]
    },
    {
      name: "Enterprise",
      description: "Full suite for professional traders",
      icon: Crown,
      monthlyPrice: 999,
      annualPrice: 7992, // 2 months free
      color: "from-yellow-500 to-orange-500",
      popular: false,
      features: [
        "Everything in Professional",
        "White-label Solution",
        "Dedicated Account Manager",
        "Custom Integrations",
        "Advanced Reporting",
        "Team Management",
        "Priority Development",
        "24/7 Phone Support"
      ]
    }
  ];

  const savings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="glass-card px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Choose Your Plan
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Simple
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {" "}Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your trading journey. All plans include our core features 
            with advanced options for professional traders.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 glass-card p-2 rounded-full w-fit mx-auto"
          >
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-success/20 text-success">
                Save 20%
              </Badge>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const displayPrice = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
            const planSavings = savings(plan.monthlyPrice, plan.annualPrice);

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? 'scale-105 z-10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card className={`glass-strong p-8 rounded-3xl h-full relative overflow-hidden ${
                  plan.popular ? 'border-primary/50 shadow-floating' : 'border-border/20'
                }`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5 rounded-3xl`} />
                  
                  {/* Plan Header */}
                  <div className="relative z-10 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="relative z-10 mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-black">₹{displayPrice.toLocaleString()}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {isAnnual && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className="bg-success/20 text-success">
                          Save ₹{planSavings.amount.toLocaleString()}
                        </Badge>
                        <span className="text-muted-foreground">
                          ({planSavings.percentage}% off)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="relative z-10 mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + (featureIndex * 0.05) }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    size="lg"
                    className={`w-full relative z-10 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-floating' 
                        : 'glass-card border-primary/30 hover:border-primary hover:bg-primary/5'
                    } group`}
                  >
                    <Link to="/signup" className="flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-muted-foreground mb-8">
            All plans include our core features with 24/7 support and 30-day money-back guarantee
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Shield, label: "Secure Trading" },
              { icon: Bot, label: "AI-Powered" },
              { icon: BarChart3, label: "Real-time Data" },
              { icon: Target, label: "Precision Tools" }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                viewport={{ once: true }}
                className="glass-card p-4 rounded-xl flex flex-col items-center gap-2"
              >
                <feature.icon className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernPricing;