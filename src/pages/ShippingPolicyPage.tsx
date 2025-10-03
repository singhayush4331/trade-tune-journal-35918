
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const ShippingPolicyPage = () => {
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
            Shipping Policy
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <p className="text-muted-foreground mb-8">Last updated: April 29, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Digital Products</h2>
              <p className="text-foreground/80">
                Wiggly is a digital platform that provides trading journal and analytics services. As our products are entirely digital and delivered electronically, traditional shipping policies do not apply to our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Service Delivery</h2>
              <p className="text-foreground/80">
                Upon successful subscription registration and payment, you will receive immediate access to our platform's features according to your chosen subscription plan. There is no physical shipping involved in the delivery of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Access Methods</h2>
              <p className="text-foreground/80">
                Our platform can be accessed through web browsers on desktop computers, laptops, tablets, and mobile devices with an internet connection. No special shipping arrangements are required to access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. System Requirements</h2>
              <p className="text-foreground/80">
                To ensure optimal performance of our platform, we recommend:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>A modern web browser (latest versions of Chrome, Firefox, Safari, or Edge)</li>
                <li>Stable internet connection</li>
                <li>Screen resolution of at least 1280 x 800</li>
                <li>JavaScript enabled in your browser</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
              <p className="text-foreground/80">
                If you have any questions about accessing our platform or services, please contact our customer support team at support@wiggly.com.
              </p>
            </section>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicyPage;
