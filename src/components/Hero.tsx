import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Zap, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const rotatingWords = [
  'Premium',
  'Curated',
  'Exclusive',
  'Luxury',
  'Premium'
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActiveCategory } = useProducts();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToProducts = () => {
    setActiveCategory('all');
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Video */}
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </motion.div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20"
      >
        {/* Premium Sale Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full sale-badge text-white shadow-2xl shadow-purple-500/30 mb-8"
        >
          {/* Pulsing Live Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="pulse-ring"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          
          <Zap className="w-5 h-5 fill-white" />
          <span className="font-bold tracking-widest text-sm uppercase">Sale is Live</span>
          <Sparkles className="w-5 h-5" />
        </motion.div>

        {/* Main Headline with Rotating Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight leading-none logo-font hero-title">
            Discover
          </h1>
          
          {/* Rotating Words Container */}
          <div className="h-[1.2em] sm:h-[1.1em] overflow-hidden my-2 sm:my-2">
            <motion.div
              animate={{ y: [0, -20, -40, -60, -80, -100] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: [0.85, 0, 0.15, 1],
                times: [0, 0.2, 0.4, 0.6, 0.8, 1]
              }}
              className="flex flex-col"
            >
              {rotatingWords.map((word, index) => (
                <span
                  key={index}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] h-[1.2em] sm:h-[1.1em] flex items-center justify-center logo-font"
                >
                  {word}
                </span>
              ))}
            </motion.div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight leading-none logo-font hero-title">
            Products
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
        >
          Handpicked premium items with exclusive deals. Elevate your lifestyle with 
          curated selections across tech, home, fashion, and more.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={scrollToProducts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full font-semibold text-base sm:text-lg btn-shine shadow-lg shadow-[#d4af37]/30 w-full sm:w-auto justify-center"
          >
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.a
            href="#featured"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
          >
            <Play className="w-5 h-5" />
            View Featured
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4"
        >
          {[
            { value: '200+', label: 'Products' },
            { value: '50K+', label: 'Happy Shoppers' },
            { value: '4.9', label: 'Avg Rating' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white logo-font mb-1">{stat.value}</div>
              <div className="text-white/50 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/30 rounded-full flex justify-center pt-1.5 sm:pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0], y: [0, 12] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#d4af37] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
