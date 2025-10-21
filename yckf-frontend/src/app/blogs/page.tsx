import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import { Suspense } from 'react';
import BlogsClient from './BlogsClient';

export default async function Blogs() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar />
      <Header />
      <Suspense fallback={<div>Loading news...</div>}>
        <BlogsClient />
      </Suspense>
      <Footer />
    </div>
  );
}