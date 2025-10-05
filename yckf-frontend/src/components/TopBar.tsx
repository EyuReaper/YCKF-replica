'use client'; // Ensure client-side rendering

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function TopBar() {
  const { theme } = useTheme(); // Access theme from context
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Addis_Ababa',
  });

  // Apply theme-aware styles
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';

  return (
    <div className={`${bgColor} ${textColor} py-2 text-center`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 text-sm">
        <div className="mb-2 sm:mb-0">
          <span>Welcome to YCKF! | </span>
          <span>{formattedDate} | {formattedTime} EAT</span>
        </div>
        <div>
          <a href="/contact" className={`underline hover:${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} ml-2`}>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}