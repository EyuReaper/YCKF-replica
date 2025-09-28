'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const TestimonialSection = () => {
  const { theme } = useTheme();

  const testimonials = [
    {
      quote: "A great zone to move into cybersecurity. Thanks to the foundation!",
      name: "John Doe",
      title: "Cyber Enthusiast",
    },
    {
      quote: "The community approach really brought out my interest in security training.",
      name: "Emily Davis",
      title: "Security Expert",
    },
    {
      quote: "The sessions were insightful and helped me understand cybersecurity better.",
      name: "Kwame Adom",
      title: "CTO, Apex Group",
    },
  ];

  // Theme-based class definitions
  const sectionBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const titleTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100'; // For section title
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const quoteTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const nameTextClass = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const testimonialTitleTextClass = theme === 'light' ? 'text-gray-500' : 'text-gray-500'; // Renamed for testimonial title

  return (
    <section className={`py-16 px-4 md:px-8 ${sectionBgClass}`}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-3xl md:text-4xl font-bold ${titleTextClass} mb-8 text-center`}
        >
          What Our Community Says
        </motion.h2>
        <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`card ${cardBgClass} p-6 rounded-lg shadow-lg text-center`}
            >
              <p className={`italic ${quoteTextClass} mb-4`}>"{testimonial.quote}"</p>
              <p className={`font-semibold ${nameTextClass} text-xl`}>{testimonial.name}</p>
              <p className={testimonialTitleTextClass}>{testimonial.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;