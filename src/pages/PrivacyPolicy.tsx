import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, Database, Cookie, Share2 } from 'lucide-react';
import { useContact } from '../context/ContactContext';

export default function PrivacyPolicy() {
  const { contactInfo } = useContact();

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-black py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] mb-6"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 logo-font"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg"
          >
            Your privacy is important to us. Learn how we protect your data.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-gray max-w-none">
          
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-600 text-lg leading-relaxed">
              At <strong>{contactInfo.businessName}</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          {/* Information Collection */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <p className="text-gray-600 mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you choose to participate in various activities related to the Site.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span><strong>Financial Data:</strong> Financial information, such as data related to your payment method, that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Use of Information */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Use of Your Information</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-600">
              {[
                'Create and manage your account',
                'Email you regarding your account or order',
                'Fulfill and manage purchases, orders, payments',
                'Improve our website and offerings',
                'Send you marketing communications',
                'Respond to customer service requests',
                'Prevent fraudulent transactions',
                'Deliver targeted advertising',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cookies and Web Beacons</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <p className="text-gray-600 mb-4">
                We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
              </p>
              <p className="text-gray-600">
                Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
              </p>
            </div>
          </section>

          {/* Third-Party Websites */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Websites</h2>
            </div>
            <p className="text-gray-600">
              The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
            </p>
          </section>

          {/* Security */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Security of Your Information</h2>
            </div>
            <p className="text-gray-600">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="bg-gradient-to-br from-[#d4af37]/5 to-[#b8860b]/5 rounded-2xl p-6 sm:p-8">
              <p className="text-gray-600 mb-4">
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{contactInfo.businessName}</p>
                <p className="text-gray-600">{contactInfo.address}</p>
                <p className="text-gray-600">Email: {contactInfo.email}</p>
                <p className="text-gray-600">Phone: {contactInfo.phone}</p>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-gray-200 pt-8 mt-10">
            <p className="text-gray-500 text-sm text-center">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
