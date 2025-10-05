import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useState } from 'react';

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
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getPremiumTrainingData(): Promise<PremiumTrainingResponse> {
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
  const courses = await client.fetch(query);
  console.log('Premium Training Data:', courses);
  return { courses: courses || [] };
}

export default async function PremiumTraining() {
  const { courses } = await getPremiumTrainingData();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Premium Training Courses
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Access our comprehensive cybersecurity training courses through donation-based enrollment. 
              Support our mission while advancing your skills with expert-led, hands-on learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/student-dashboard" 
                className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Student Dashboard
              </Link>
              <Link 
                href="/free-training" 
                className="inline-block px-6 py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Free Training
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="px-4 pb-8 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search Courses..."
              className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Network Security</option>
              <option>Web Application Security</option>
              <option>Ethical Hacking</option>
              <option>Digital Forensics</option>
              <option>Incident Response</option>
              <option>Risk Management</option>
              <option>Compliance</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="px-4 pb-16 mx-auto max-w-7xl">
          {courses.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course._id} className="overflow-hidden bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                  {course.image?.asset && (
                    <img
                      src={course.image.asset.url}
                      alt={course.title}
                      className="object-cover w-full h-48"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {course.level}
                      </span>
                      {course.featured && (
                        <span className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      {course.title}
                    </h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {course.instructor} • {course.duration}
                    </p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
                      {course.shortDescription}
                    </p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Suggested Donation: ${course.suggestedDonationAmount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Min: ${course.minDonationAmount} • Max: ${course.maxDonationAmount}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/premium-training/${course.slug.current}`}
                        className="inline-block px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/premium-training/${course.slug.current}/enroll`}
                        className="inline-block px-4 py-2 text-sm font-medium text-center text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
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
              <p className="mt-4 text-red-600 dark:text-red-400">No premium courses available at the moment.</p>
            </div>
          )}
        </section>

        {/* Donation Information */}
        <section className="px-4 py-16 mx-auto max-w-7xl bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
              How Donation-Based Access Works
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our premium courses are accessible through donations that support our mission to make cybersecurity education available to everyone.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                <div className="w-12 h-12 mx-auto mb-4 text-blue-600 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900 dark:text-blue-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Flexible Donation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose any amount within our suggested range. Every donation helps us provide free training to underserved communities.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                <div className="w-12 h-12 mx-auto mb-4 text-green-600 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900 dark:text-green-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Full Access</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get complete access to course materials, instructor support, and earn certificates upon completion.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                <div className="w-12 h-12 mx-auto mb-4 text-purple-600 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900 dark:text-purple-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Support Mission</h3>
                <p className="text-gray-600 dark:text-gray-400">
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
