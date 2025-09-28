'use client';

import { motion } from 'framer-motion';

const GallerySection = () => {
  return (
    <section className="hidden px-4 py-16 bg-gray-900 md:px-8"> {/* Hidden by default */}
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-3xl font-bold text-center text-gray-100 md:text-4xl"
        >
          Gallery Section (Removed)
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg text-center text-gray-300"
        >
          This section has been removed. Please check back later for updates or contact us for more information.
        </motion.p>
      </div>
    </section>
  );
};

export default GallerySection;