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

  // Theme-based class definitions (matching Footer style)
  const bgClass = theme === 'light' ? 'bg-gray-200' : 'bg-gray-800';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const linkHoverClass = theme === 'light' ? 'hover:text-blue-600' : 'hover:text-blue-400';

  return (
    <div className={`${bgClass} ${textClass} py-2 text-center`}>
      <div className="flex flex-col items-center justify-between px-4 mx-auto text-sm max-w-7xl sm:flex-row">
        <div className="mb-2 sm:mb-0">
          <span>Welcome to YCKF! | </span>
          <span>{formattedDate} | {formattedTime} EAT</span>
        </div>
        <div>
          <a href="/contact" className={`underline ${linkHoverClass} ml-2`}>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}