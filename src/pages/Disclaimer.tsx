import { motion } from 'framer-motion';
import { FileText, ExternalLink, DollarSign, AlertTriangle, Scale, Package } from 'lucide-react';
import { useContact } from '../context/ContactContext';

export default function Disclaimer() {
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
            <FileText className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 logo-font"
          >
            Affiliate Disclosure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg"
          >
            Transparency about our partnerships and how we operate
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Notice Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6 mb-10"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Important Notice</h3>
              <p className="text-amber-800">
                <strong>{contactInfo.businessName}</strong> is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="prose prose-gray max-w-none">
          
          {/* Affiliate Relationships */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Affiliate Relationships</h2>
            </div>
            <p className="text-gray-600 mb-4">
              {contactInfo.businessName} engages in affiliate marketing, which is done by embedding tracking links into the website. If you click on a link for an affiliate partnership, a cookie will be placed on your browser to track any sales for purposes of commissions.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="font-semibold text-gray-900 mb-3">Our Affiliate Partners Include:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <strong>Amazon Associates</strong> - We earn commissions from qualifying purchases
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  Various retail partners through affiliate networks
                </li>
              </ul>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How Affiliate Links Work</h2>
            </div>
            <p className="text-gray-600 mb-4">
              When you click on an affiliate link on our website and make a purchase, we may receive a small commission at no additional cost to you. These commissions help support our website and allow us to continue providing valuable content and recommendations.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-5">
                <h4 className="font-semibold text-green-900 mb-2">For You</h4>
                <p className="text-green-800 text-sm">
                  You pay the same price whether you use our affiliate link or go directly to the retailer. There is no additional cost to you.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-2">For Us</h4>
                <p className="text-blue-800 text-sm">
                  We receive a small percentage as a commission for referring you to the product. This helps keep our website running.
                </p>
              </div>
            </div>
          </section>

          {/* Product Reviews */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Product Reviews & Recommendations</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <p className="text-gray-600 mb-4">
                We take pride in providing honest and unbiased product reviews and recommendations. Our editorial opinions remain our own and are not influenced by any affiliate partnerships.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span>We only recommend products we genuinely believe in and would use ourselves</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span>Product ratings and reviews are based on thorough research and analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span>We do not accept payment for positive reviews or product placement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 flex-shrink-0" />
                  <span>Product prices and availability are subject to change without notice</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Accuracy */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Accuracy of Information</h2>
            </div>
            <p className="text-gray-600">
              We make every effort to ensure that the product information, prices, and availability displayed on our website are accurate and up-to-date. However, we cannot guarantee that all information is always current, complete, or error-free. Product images, descriptions, and specifications are provided by manufacturers and retailers, and may change without our knowledge.
            </p>
          </section>

          {/* Liability */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#b8860b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <p className="text-gray-600">
              {contactInfo.businessName} shall not be liable for any damages arising from the use or inability to use our website or from any products purchased through affiliate links. All purchases are subject to the terms and conditions of the respective retailer. We encourage you to review the retailer's policies before making any purchase.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Disclosure</h2>
            <p className="text-gray-600">
              We may update this Affiliate Disclosure from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this disclosure periodically to stay informed about our affiliate relationships.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <div className="bg-gradient-to-br from-[#d4af37]/5 to-[#b8860b]/5 rounded-2xl p-6 sm:p-8">
              <p className="text-gray-600 mb-4">
                If you have any questions about our affiliate relationships or this disclosure, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{contactInfo.businessName}</p>
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
