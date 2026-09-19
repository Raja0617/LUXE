import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useContact } from '../context/ContactContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { categories } = useProducts();
  const { contactInfo } = useContact();

  const socialLinks = [
    { 
      icon: Instagram, 
      href: contactInfo.instagram, 
      label: 'Instagram',
      color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-yellow-500'
    },
    { 
      icon: Twitter, 
      href: contactInfo.twitter, 
      label: 'Twitter',
      color: 'hover:bg-black hover:text-white'
    },
    { 
      icon: Youtube, 
      href: contactInfo.youtube, 
      label: 'YouTube',
      color: 'hover:bg-red-600 hover:text-white'
    },
    { 
      icon: Facebook, 
      href: contactInfo.facebook, 
      label: 'Facebook',
      color: 'hover:bg-blue-600 hover:text-white'
    },
  ];

  return (
    <footer className="bg-gray-50 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <motion.a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#d4af37] via-[#f4e5c2] to-[#b8860b] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl sm:text-2xl font-bold text-white logo-font">L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900 logo-font tracking-[0.15em] sm:tracking-[0.2em]">
                  LUXE
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#b8860b] tracking-[0.2em] sm:tracking-[0.3em] -mt-0.5 sm:-mt-1">
                  FINDS
                </span>
              </div>
            </motion.a>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">
              Curating the finest products with exclusive deals. Handpicked premium items so you don&apos;t have to.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 transition-all duration-300 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Categories</h4>
            <ul className="space-y-2 sm:space-y-3">
              {categories.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="/#featured" className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm">
                  Featured Products
                </a>
              </li>
              <li>
                <a href="/#products" className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm">
                  Shop All
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#b8860b] transition-colors text-xs sm:text-sm">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} {contactInfo.businessName}. All rights reserved.
            </p>
            <p className="text-gray-400 text-[10px] sm:text-xs text-center md:text-right">
              As an Amazon Associate, we earn from qualifying purchases. 
              Product prices and availability are subject to change.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
