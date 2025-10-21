'use client'; 

import { useState, useEffect } from 'react';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';

export default function BlogsClient() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchNews = async () => {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!apiKey) {
        console.error('NewsAPI key not configured');
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=cybersecurity+tech&sortBy=publishedAt&language=en&apiKey=${apiKey}`
        );
        const data = await response.json();
        if (isMounted) setNews(data.articles || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  const SpinnerFallback = () => (
    <div className="flex items-center justify-center py-4">
      <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
    </div>
  );

  return (
    <main className="flex-1">
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Latest Tech & Cybersecurity News</h1>

          {/* Search Bar (placeholder, can be enhanced) */}
          <div className="flex mb-8">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            {loading ? (
              <SpinnerFallback />
            ) : news.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.slice(0, 6).map((article, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="object-cover w-full h-48 mb-4 rounded-lg"
                      />
                    )}
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString()} | {article.source.name}
                    </p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">{article.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No news available at the moment.</p>
            )}
          </div>

          {/* Load More Button (optional, can be enhanced for pagination) */}
          {news.length > 6 && (
            <div className="flex justify-center mt-8">
              <button className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}