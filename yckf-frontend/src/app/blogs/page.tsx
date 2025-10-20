'use client'; // Move to the top of the file

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Server-side data fetching
async function getBlogsData() {
  const query = `*[_type == "blogs"] {
    title,
    excerpt,
    content,
    author,
    date,
    slug,
    image {
      asset->{
        url
      }
    }
  }`;
  const blogs = await client.fetch(query);
  console.log('Blogs Data:', blogs); // Debug log
  return blogs || [];
}

// Interfaces
interface BlogData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  slug?: { current: string };
  image?: { asset: { url: string } } | null;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string };
  urlToImage?: string;
}

// Client Component for interactive UI
const BlogsClient = ({ initialBlogs }: { initialBlogs: BlogData[] }) => {
  const [blogs] = useState(initialBlogs);
  const [activeTab, setActiveTab] = useState('blogs');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!apiKey) {
        console.error('NewsAPI key not configured');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=cybersecurity+tech&sortBy=publishedAt&language=en&apiKey=${apiKey}`
        );
        const data = await response.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const SpinnerFallback = () => (
    <div className="flex items-center justify-center py-4">
      <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar />
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Cybersecurity Insights & Stories</h1>

            {/* Search Bar (placeholder, can be enhanced) */}
            <div className="flex mb-8">
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`px-4 py-2 font-medium ${activeTab === 'blogs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  Our Blogs
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={`px-4 py-2 font-medium ${activeTab === 'news' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  Tech News
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'blogs' ? (
              blogs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog, index) => (
                    <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                      {blog.image?.asset?.url && (
                        <img
                          src={blog.image.asset.url}
                          alt={blog.title}
                          className="object-cover w-full h-48 mb-4 rounded-lg"
                        />
                      )}
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                        <Link href={`/blog/${blog.slug?.current}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {blog.title}
                        </Link>
                      </h3>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(blog.date).toLocaleDateString()} | By {blog.author}
                      </p>
                      <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">{blog.excerpt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <SpinnerFallback />
                  <p className="mt-4 text-red-600 dark:text-red-400">No blogs available at the moment.</p>
                </div>
              )
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Latest Tech & Cybersecurity News</h2>
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
            )}

            {/* Load More Button (for blogs only) */}
            {activeTab === 'blogs' && blogs.length > 0 && (
              <div className="flex justify-center mt-8">
                <button className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Load More
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Server Component to fetch data
export default async function Blogs() {
  const blogs = await getBlogsData();
  return <BlogsClient initialBlogs={blogs} />;
}