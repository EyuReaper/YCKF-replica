'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  // Theme-based class definitions
  const bgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-950';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const secondaryTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const mutedTextClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400'; // Adjusted for dark mode contrast
  const linkHoverClass = theme === 'light' ? 'hover:text-blue-600' : 'hover:text-blue-400';

  return (
    <footer className={`px-4 py-10 ${bgClass} ${textClass} md:px-8`}>
      <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
        <div className="text-center md:text-left">
          <h3 className={`mb-4 text-2xl font-semibold ${textClass}`}>YCKF</h3>
          <p className={secondaryTextClass}>Empowering youth in cybersecurity, fostering skills and talent to secure digital environ.</p>
        </div>
        <div className="text-center md:text-left">
          <h3 className={`mb-4 text-2xl font-semibold ${textClass}`}>Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>About Us</a></li>
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>Team</a></li>
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>Blog</a></li>
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>Contact</a></li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className={`mb-4 text-2xl font-semibold ${textClass}`}>Follow Us</h3>
          <ul className="space-y-2">
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>Facebook</a></li>
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>Instagram</a></li>
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>X(Twitter)</a></li>
            <li><a href="#" className={`${secondaryTextClass} transition-colors ${linkHoverClass}`}>LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <p className={`mt-6 text-center ${mutedTextClass}`}>© 2025 Young Cyber Knights Foundation™. All rights reserved.</p>
      <p className={`mt-6 text-sm text-center ${secondaryTextClass}`}>
        Reimagined and Developed by{' '}
        <a className={`font-semibold ${linkHoverClass}`} href="https://eyus-portfolio.vercel.app">EyuReaper</a>
      </p>
    </footer>
  );
};

export default Footer;