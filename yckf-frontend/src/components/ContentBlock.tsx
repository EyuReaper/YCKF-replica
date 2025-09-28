'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { useTheme } from '@/context/ThemeContext';

interface ContentBlockProps {
  title: string;
  subtitle?: string;
  content?: string;
  sections?: { title: string; content: string; image?: string; icon?: React.ReactNode }[];
  stats?: { label: string; value: string; image?: string; icon?: React.ReactNode }[];
}

const ContentBlock = ({
  title,
  subtitle,
  content,
  sections,
  stats,
  children,
}: ContentBlockProps & { children?: React.ReactNode }) => {
  const { theme } = useTheme();
  const statsRef = useRef<HTMLDivElement>(null);
  const countUpInstances = useRef<(CountUp | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && stats) {
            stats.forEach((stat, index) => {
              const element = document.getElementById(`stat-value-${index}`);
              if (element && !countUpInstances.current[index]) {
                const countUp = new CountUp(`stat-value-${index}`, parseInt(stat.value), {
                  startVal: 0,
                  duration: 2.5,
                  suffix: stat.value.includes('+') ? '+' : '',
                });
                if (!countUp.error) {
                  countUp.start();
                  countUpInstances.current[index] = countUp;
                } else {
                  console.error(`CountUp error for stat ${index}:`, countUp.error);
                }
              }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      countUpInstances.current.forEach((instance) => instance?.reset());
      countUpInstances.current = [];
    };
  }, [stats]);

  const sectionBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-950';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const titleTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subtitleTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const contentTextClass = theme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const sectionTitleTextClass = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const statLabelTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const buttonBgClass = theme === 'light' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400';
  const buttonTextClass = theme === 'light' ? 'text-white' : 'text-white';
  const buttonBorderClass = theme === 'light' ? 'border-blue-700' : 'border-blue-600';

  return (
    <section className={`px-4 py-16 md:px-8 ${sectionBgClass}`}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mb-12 text-3xl font-bold text-center ${titleTextClass} md:text-4xl`}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`max-w-2xl mx-auto mb-10 text-lg text-center ${subtitleTextClass} md:text-xl`}
          >
            {subtitle}
          </motion.p>
        )}
        {content && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`max-w-2xl mx-auto mb-12 text-base text-center ${contentTextClass} md:text-lg`}
          >
            {content}
          </motion.p>
        )}
        {sections && (
          <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className={`relative overflow-hidden ${cardBgClass} rounded-lg shadow-lg card`}
              >
                <div className={`absolute z-10 top-4 left-4`}>
                  {section.icon && <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4  `}>{section.icon}</div>}
                </div>
                <div className="p-6 pt-16 text-center">
                  <h3 className={`mb-4 text-2xl font-semibold ${sectionTitleTextClass}`}>{section.title}</h3>
                  <p className={contentTextClass}>{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {stats && (
          <div ref={statsRef} className="grid max-w-5xl grid-cols-1 gap-8 mx-auto mt-12 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className={`overflow-hidden text-center ${cardBgClass} rounded-lg shadow-lg card`}
              >
                <div className="p-6">
                  {stat.icon && <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4  `}>{stat.icon}</div>}
                  <p className="mb-2 text-3xl font-bold text-blue-500">
                    <span id={`stat-value-${index}`}>0</span>
                  </p>
                  <p className={`text-lg ${statLabelTextClass}`}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};

export default ContentBlock;