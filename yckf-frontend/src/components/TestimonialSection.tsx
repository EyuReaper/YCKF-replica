'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import * as Avatar from '@radix-ui/react-avatar';

const TestimonialSection = () => {
  const { theme } = useTheme();

  const testimonials = [
    {
      quote: "A great zone to move into cybersecurity. Thanks to the foundation!",
      name: "John Doe",
      title: "Cyber Enthusiast",
      imageUrl: "/professional_2.jpg", 
    },
    {
      quote: "The community approach really brought out my interest in security training.",
      name: "Emily Davis",
      title: "Security Expert",
      imageUrl: "/black_woman1.jpg", 
    },
    {
      quote: "The sessions were insightful and helped me understand cybersecurity better.",
      name: "Kwame Adom",
      title: "CTO, Apex Group",
      imageUrl: "/professional_4.jpg", 
    },
  ];

  // Theme-based class definitions
  const sectionBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const titleTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100'; // For section title
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const quoteTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const nameTextClass = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const testimonialTitleTextClass = theme === 'light' ? 'text-gray-500' : 'text-gray-500'; // For testimonial title
  const avatarRingClass = theme === 'light' ? 'ring-blue-400' : 'ring-blue-700'; // Ring color for avatar

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
                            <Avatar.Root className="inline-flex items-center justify-center mb-4">
                <Avatar.Image
                  className={`rounded-full w-16 h-16 object-cover ${avatarRingClass}`}
                  src={testimonial.imageUrl}
                  alt={`${testimonial.name}'s avatar`}
                />
                <Avatar.Fallback
                  className={`flex items-center justify-center w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 text-white text-xl font-semibold ${avatarRingClass}`}
                >
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </Avatar.Fallback>
              </Avatar.Root>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;