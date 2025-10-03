
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const RefundPolicyPage = () => {
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
            Cancellation & Refund Policy
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <p className="text-muted-foreground mb-8">Last updated: April 29, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Subscription Cancellation</h2>
              <p className="text-foreground/80">
                You can cancel your subscription at any time through your account settings. Once canceled, your subscription will remain active until the end of your current billing period. After that, your account will be downgraded to the free tier with limited features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Refund Policy</h2>
              <p className="text-foreground/80">
                We offer a 14-day money-back guarantee for all new subscriptions. If you are not satisfied with our services within the first 14 days of your subscription, you can request a full refund by contacting our support team at support@wiggly.co.in.
              </p>
              <p className="text-foreground/80 mt-4">
                After the 14-day period, refunds are generally not provided for the following reasons:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>Cancellation of a subscription after the refund period</li>
                <li>Dissatisfaction with the service after the refund period</li>
                <li>Non-usage of the service</li>
                <li>Duplicate subscriptions or accidental purchases (these may be eligible for refund at our discretion)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Exceptional Refund Circumstances</h2>
              <p className="text-foreground/80">
                In certain exceptional circumstances, we may consider offering refunds outside of the standard policy:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>Technical issues that severely impact service usage and cannot be resolved</li>
                <li>Billing errors resulting in overcharges</li>
                <li>Service unavailability for extended periods</li>
              </ul>
              <p className="text-foreground/80 mt-4">
                Such refunds are evaluated on a case-by-case basis and are provided at the sole discretion of Wiggly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. How to Request a Refund</h2>
              <p className="text-foreground/80">
                If you believe you are eligible for a refund, please contact our customer support team at refunds@wiggly.co.in with the following information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>Your account email address</li>
                <li>Date of purchase</li>
                <li>Reason for requesting a refund</li>
                <li>Any relevant details or screenshots</li>
              </ul>
              <p className="text-foreground/80 mt-4">
                We aim to respond to all refund requests within 2 business days.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
              <p className="text-foreground/80">
                If you have any questions about our Cancellation and Refund Policy, please contact our customer support team at support@wiggly.co.in.
              </p>
            </section>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
