'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="relative bg-[url('/cybercrime_1280.png')] bg-cover bg-center h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center overflow-hidden" >
      <div className="absolute inset-0 z-80 bg-black/50" />
      <div className="relative flex flex-col items-center justify-center h-full max-w-3xl px-4 mx-auto text-center z-80 ">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-6 text-3xl font-bold leading-tight text-white md:text-6xl"
        >
          Empowering a Safer Digital World
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-2xl mb-8 text-lg text-white md:text-xl"
        >
          Join us in protecting, educating, and empowering cybersecurity awareness and resilience.
        </motion.p>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-500 rounded-full hover:bg-blue-400"
          >
            Join Us
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-6 py-3 font-medium text-white transition-colors duration-200 bg-transparent border-2 border-blue-600 rounded-full hover:bg-white hover:text-gray-900"
          >
            Explore
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;