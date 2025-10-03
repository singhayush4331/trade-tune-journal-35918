
import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, CalendarCheck, Check, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { formatIndianCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

const MONTHLY_PRICE = 360;
const YEARLY_DISCOUNT = 0.25;
const YEARLY_PRICE = MONTHLY_PRICE * 12 * (1 - YEARLY_DISCOUNT);

const SubscriptionSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-background/95 to-card/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <IndianRupee className="mr-1 h-4 w-4" />
            Pricing
          </span>
          <h2 className="text-4xl font-bold mt-6 mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent py-[6px]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your trading journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex"
          >
            <Card className="relative h-full w-full backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-background to-primary/5 rounded-lg opacity-50 pointer-events-none"></div>
              
              <CardHeader className="text-center pb-8 pt-6">
                <h3 className="text-2xl font-semibold">Monthly Plan</h3>
                <p className="text-4xl font-bold mt-4 flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 mr-1" />
                  {MONTHLY_PRICE}
                  <span className="text-base font-normal text-muted-foreground ml-2">/month</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">One-time payment</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {['Full access to all features', 'Real-time trade analysis', 'AI-powered insights', 'Priority support', 'Advanced analytics reports'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/subscription">
                    Pay Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Yearly Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex"
          >
            <Card className="relative h-full w-full border-primary backdrop-blur-sm bg-gradient-to-b from-primary/5 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg opacity-50 pointer-events-none"></div>
              
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  <Percent className="mr-1 h-3 w-3" />
                  Save 25%
                </span>
              </div>
              
              <CardHeader className="text-center pb-8 pt-6">
                <h3 className="text-2xl font-semibold">Yearly Plan</h3>
                <div className="mt-4">
                  <p className="text-4xl font-bold flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 mr-1" />
                    {Math.round(YEARLY_PRICE / 12)}
                    <span className="text-base font-normal text-muted-foreground ml-2">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time payment of {formatIndianCurrency(YEARLY_PRICE)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {['Full access to all features', 'Real-time trade analysis', 'AI-powered insights', 'Priority support', 'Advanced analytics reports'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button size="lg" variant="gradient" className="w-full" asChild>
                  <Link to="/subscription">
                    Pay Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
