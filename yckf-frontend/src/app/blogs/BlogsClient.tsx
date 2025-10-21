'use client'; // Must be at the top

import { useState, useEffect } from 'react';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

export default function BlogsClient() {
  const { theme } = useTheme(); // Access the theme from context

  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!apiKey) {
        console.error('❌ NewsAPI key not configured');
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
        console.error('❌ Failed to fetch news:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter news based on search query
  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const SpinnerFallback = () => (
    <div className="flex items-center justify-center py-12">
      <RiLoader2Fill className={`w-12 h-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} animate-spin`} />
    </div>
  );

  // Dynamic classes based on theme
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const hoverBgClass = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-blue-800';
  const paginationBgClass = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';
  const paginationTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const paginationHoverClass = theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-gray-600';

  return (
    <main className="flex-1">
      <section className="px-4 py-16">
        <div className={`max-w-5xl mx-auto ${bgClass}`}>
          <h1 className={`mb-6 text-3xl font-bold ${textClass}`}>Latest Tech & Cybersecurity News</h1>

          {/* Enhanced Search Bar */}
          <div className="flex mb-8">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            {loading ? (
              <SpinnerFallback />
            ) : currentNews.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentNews.map((article, index) => (
                    <div key={index} className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
                      {article.urlToImage && (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="object-cover w-full h-48 mb-4 rounded-lg"
                        />
                      )}
                      <h3 className={`mb-2 text-xl font-bold ${textClass}`}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h3>
                      <p className={`mb-2 text-sm ${subTextClass}`}>
                        {new Date(article.publishedAt).toLocaleDateString()} | {article.source.name}
                      </p>
                      <p className={`mb-4 ${subTextClass} line-clamp-3`}>{article.description}</p>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-white bg-blue-600 rounded-md ${hoverBgClass} disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-700 text-white'
                          : `${paginationBgClass} ${paginationTextClass} ${paginationHoverClass}`
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-white bg-blue-600 rounded-md ${hoverBgClass} disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className={subTextClass}>No news available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}