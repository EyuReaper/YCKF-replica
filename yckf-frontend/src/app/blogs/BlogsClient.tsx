'use client'; // Must be at the top

import { useState, useEffect } from 'react';
import { RiLoader2Fill } from 'react-icons/ri';

export default function BlogsClient() {
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
      <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
    </div>
  );

  return (
    <main className="flex-1">
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Latest Tech & Cybersecurity News
          </h1>

          {/* Enhanced Search Bar */}
          <div className="flex mb-8">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div
                      key={index}
                      className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
                    >
                      {article.urlToImage && (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="object-cover w-full h-48 mb-4 rounded-lg"
                        />
                      )}
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.title}
                        </a>
                      </h3>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(article.publishedAt).toLocaleDateString()} |{' '}
                        {article.source.name}
                      </p>
                      <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
                        {article.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                          : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No news available at the moment.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
