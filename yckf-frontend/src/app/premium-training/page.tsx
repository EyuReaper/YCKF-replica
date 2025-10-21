'use client'; // Mark as Client Component to use useTheme

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook
import { useState, useEffect } from 'react';

// Define interface for Sanity data
interface PremiumTrainingData {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorBio: string;
  duration: string;
  level: string;
  category: string;
  image?: { asset: { url: string } } | null;
  bannerImage?: { asset: { url: string } } | null;
  modules: Array<{
    title: string;
    description: string;
    duration: string;
    lessons: string[];
    resources: string[];
  }>;
  donationTiers: Array<{
    name: string;
    amount: number;
    description: string;
    benefits: string[];
  }>;
  minDonationAmount: number;
  maxDonationAmount: number;
  suggestedDonationAmount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  enrollmentDeadline: string;
  maxStudents: number;
  prerequisites: string[];
  learningObjectives: string[];
  certificateTemplate?: { asset: { url: string } } | null;
  tags: string[];
  featured: boolean;
  slug: { current: string };
}

interface PremiumTrainingResponse {
  courses: PremiumTrainingData[];
}

// Helper component for the spinner fallback
const SpinnerFallback = () => {
  const { theme } = useTheme();
  const textClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="flex items-center justify-center py-8">
      <RiLoader2Fill className={`w-12 h-12 ${textClass} animate-spin`} />
    </div>
  );
};

export default function PremiumTraining() {
  const { theme } = useTheme(); // Access the theme from context

  const [courses, setCourses] = useState<PremiumTrainingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPremiumTrainingData = async () => {
      try {
        const query = `*[_type == "premiumTraining" && isActive == true] | order(featured desc, _createdAt desc) {
          _id,
          title,
          description,
          shortDescription,
          instructor,
          instructorBio,
          duration,
          level,
          category,
          image {
            asset->{
              url
            }
          },
          bannerImage {
            asset->{
              url
            }
          },
          modules,
          donationTiers,
          minDonationAmount,
          maxDonationAmount,
          suggestedDonationAmount,
          isActive,
          startDate,
          endDate,
          enrollmentDeadline,
          maxStudents,
          prerequisites,
          learningObjectives,
          certificateTemplate {
            asset->{
              url
            }
          },
          tags,
          featured,
          slug
        }`;
        const response = await client.fetch(query);
        if (isMounted) setCourses(response || []);
      } catch (error) {
        console.error('❌ Failed to fetch premium training data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPremiumTrainingData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic classes based on theme
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = theme === 'light' ? 'border-gray-100' : 'border-gray-700';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const buttonBgClass = theme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const buttonHoverClass = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-blue-800';
  const secondaryButtonBgClass = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';
  const secondaryButtonHoverClass = theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-gray-600';
  const secondaryTextClass = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const errorTextClass = theme === 'light' ? 'text-red-600' : 'text-red-400';
  const sectionBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800';

  return (
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className={`px-4 py-16 mx-auto max-w-7xl ${bgClass}`}>
          <div className="text-center">
            <h1 className={`mb-6 text-4xl font-extrabold tracking-tight ${textClass}`}>
              Premium Training Courses
            </h1>
            <p className={`max-w-3xl mx-auto mb-8 text-lg ${subTextClass}`}>
              Access our comprehensive cybersecurity training courses through donation-based enrollment. 
              Support our mission while advancing your skills with expert-led, hands-on learning experiences.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/student-dashboard"
                className={`inline-block px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 ${buttonBgClass} rounded-lg shadow-md ${buttonHoverClass}`}
              >
                Student Dashboard
              </Link>
              <Link
                href="/free-training"
                className={`inline-block px-6 py-3 text-lg font-semibold ${secondaryTextClass} transition-colors duration-200 ${secondaryButtonBgClass} rounded-lg shadow-md ${secondaryButtonHoverClass}`}
              >
                Free Training
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className={`px-4 pb-8 mx-auto max-w-7xl ${bgClass}`}>
          <div className={`flex flex-col justify-between mb-8 space-y-4 md:flex-row md:space-y-0 md:space-x-4 ${bgClass}`}>
            <input
              type="text"
              placeholder="Search Courses..."
              className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <select className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option>All Categories</option>
              <option>Network Security</option>
              <option>Web Application Security</option>
              <option>Ethical Hacking</option>
              <option>Digital Forensics</option>
              <option>Incident Response</option>
              <option>Risk Management</option>
              <option>Compliance</option>
            </select>
            <select className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </section>

        {/* Courses Grid */}
        <section className={`px-4 pb-16 mx-auto max-w-7xl ${bgClass}`}>
          {loading ? (
            <SpinnerFallback />
          ) : courses.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course._id} className={`overflow-hidden transition-shadow duration-200 ${cardBgClass} ${borderClass} shadow-lg rounded-xl hover:shadow-xl`}>
                  {course.image?.asset && (
                    <img
                      src={course.image.asset.url}
                      alt={course.title}
                      className="object-cover w-full h-48"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'text-blue-600 bg-blue-100' : 'text-blue-200 bg-blue-900'} rounded-full`}>
                        {course.level}
                      </span>
                      {course.featured && (
                        <span className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'text-yellow-600 bg-yellow-100' : 'text-yellow-200 bg-yellow-900'} rounded-full`}>
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className={`mb-2 text-xl font-bold ${textClass}`}>
                      {course.title}
                    </h3>
                    <p className={`mb-2 text-sm ${subTextClass}`}>
                      {course.instructor} • {course.duration}
                    </p>
                    <p className={`mb-4 ${subTextClass} line-clamp-3`}>
                      {course.shortDescription}
                    </p>
                    <div className="mb-4">
                      <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Suggested Donation: <CurrencyDisplay amount={course.suggestedDonationAmount} currency="GHS" showEquivalent />
                      </p>
                      <p className={`text-xs ${subTextClass}`}>
                        Min: <CurrencyDisplay amount={course.minDonationAmount} currency="GHS" /> • Max: <CurrencyDisplay amount={course.maxDonationAmount} currency="GHS" />
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/premium-training/${course.slug.current}`}
                        className={`inline-block px-4 py-2 text-sm font-medium text-center text-white transition-colors duration-200 ${buttonBgClass} rounded-md ${buttonHoverClass}`}
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/premium-training/${course.slug.current}/enroll`}
                        className={`inline-block px-4 py-2 text-sm font-medium text-center ${textClass} transition-colors duration-200 ${buttonTextClass} rounded-md ${buttonTextHoverClass}`}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <SpinnerFallback />
              <p className={errorTextClass}>No premium courses available at the moment.</p>
            </div>
          )}
        </section>

        {/* Donation Information */}
        <section className={`px-4 py-16 mx-auto rounded-lg max-w-7xl ${sectionBgClass}`}>
          <div className="text-center">
            <h2 className={`mb-4 text-3xl font-bold ${textClass}`}>
              How Donation-Based Access Works
            </h2>
            <p className={`max-w-3xl mx-auto mb-8 text-lg ${subTextClass}`}>
              Our premium courses are accessible through donations that support our mission to make cybersecurity education available to everyone.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
                <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 ${theme === 'light' ? 'text-blue-600 bg-blue-100' : 'text-blue-200 bg-blue-900'} rounded-full`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className={`mb-2 text-lg font-semibold ${textClass}`}>Flexible Donation</h3>
                <p className={subTextClass}>
                  Choose any amount within our suggested range. Every donation helps us provide free training to underserved communities.
                </p>
              </div>
              <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
                <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 ${theme === 'light' ? 'text-green-600 bg-green-100' : 'text-green-200 bg-green-900'} rounded-full`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`mb-2 text-lg font-semibold ${textClass}`}>Full Access</h3>
                <p className={subTextClass}>
                  Get complete access to course materials, instructor support, and earn certificates upon completion.
                </p>
              </div>
              <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
                <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 ${theme === 'light' ? 'text-purple-600 bg-purple-100' : 'text-purple-200 bg-purple-900'} rounded-full`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className={`mb-2 text-lg font-semibold ${textClass}`}>Support Mission</h3>
                <p className={subTextClass}>
                  Your donation directly supports our mission to make cybersecurity education accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}