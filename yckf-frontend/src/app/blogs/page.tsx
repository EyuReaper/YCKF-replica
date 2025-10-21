'use client'; // Mark as Client Component to use useTheme

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import { Suspense } from 'react';
import BlogsClient from './BlogsClient';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

export default function Blogs() {
  const { theme } = useTheme(); // Access the theme from context

  // Dynamic class based on theme
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';

  return (
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <Suspense fallback={<BlogsClient.SpinnerFallback />}>
        <BlogsClient />
      </Suspense>
      <Footer />
    </div>
  );
}