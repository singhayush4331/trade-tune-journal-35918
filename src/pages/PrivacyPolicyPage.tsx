import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
            Privacy Policy
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <p className="text-muted-foreground mb-8">Last updated: April 29, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-foreground/80">
                At Wiggly, we respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website and platform, and our practices for collecting, using, maintaining, protecting, and disclosing that information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-foreground/80">
                We collect several types of information from and about users of our platform, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>Personal information such as name, email address, and contact details when you register</li>
                <li>Trading data that you input into our platform, including trades, strategies, and performance metrics</li>
                <li>Financial information related to subscription payments</li>
                <li>Usage details and information collected through cookies and other tracking technologies</li>
                <li>Device and connection information including your IP address, browser type, and operating system</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground/80">
                We use information that we collect about you or that you provide to us:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>To provide you with our platform and its contents, and any other information or services that you request from us</li>
                <li>To process and manage your account, including subscriptions and payments</li>
                <li>To analyze trading patterns and provide insights based on your trading data</li>
                <li>To notify you about changes to our platform or any products or services we offer</li>
                <li>To improve our platform and user experience</li>
                <li>To communicate with you about products, services, and events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Disclosure of Your Information</h2>
              <p className="text-foreground/80">
                We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>To our subsidiaries and affiliates</li>
                <li>To contractors, service providers, and other third parties we use to support our business</li>
                <li>To fulfill the purpose for which you provide it</li>
                <li>For any other purpose disclosed by us when you provide the information</li>
                <li>With your consent</li>
                <li>To comply with any court order, law, or legal process</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-foreground/80">
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.
              </p>
              <p className="text-foreground/80 mt-4">
                Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-foreground/80">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-foreground/80">
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction or objection to processing</li>
                <li>Data portability</li>
              </ul>
              <p className="text-foreground/80 mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
              <p className="text-foreground/80">
                Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are under 18, do not use or provide any information on this platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Our Privacy Policy</h2>
              <p className="text-foreground/80">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-foreground/80">
                If you have any questions about this Privacy Policy, please contact us at support@wiggly.co.in.
              </p>
            </section>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
