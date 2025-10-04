'use client'
import { useState, useEffect } from 'react';

export default function TopBar() {
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

  return (
    <div className="bg-gray-800 text-white py-2 text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 text-sm">
        <div className="mb-2 sm:mb-0">
          <span>Welcome to YCKF Hub! | </span>
          <span>{formattedDate} | {formattedTime} EAT</span>
        </div>
        <div>
          <a href="/contact" className="underline hover:text-blue-300 ml-2">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}