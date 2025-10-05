import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { notFound } from 'next/navigation';

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

interface PageProps {
  params: {
    slug: string;
  };
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getCourseData(slug: string): Promise<PremiumTrainingData | null> {
  const query = `*[_type == "premiumTraining" && slug.current == $slug && isActive == true][0] {
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
  
  const course = await client.fetch(query, { slug });
  return course;
}

export default async function CourseDetail({ params }: PageProps) {
  const course = await getCourseData(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          {course.bannerImage?.asset && (
            <div className="absolute inset-0">
              <img
                src={course.bannerImage.asset.url}
                alt={course.title}
                className="object-cover w-full h-96"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          )}
          <div className="relative px-4 py-16 mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {course.level}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200">
                    {course.category}
                  </span>
                  {course.featured && (
                    <span className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="mb-4 text-4xl font-extrabold text-white dark:text-white tracking-tight">
                  {course.title}
                </h1>
                <p className="mb-4 text-xl text-gray-200 dark:text-gray-200">
                  {course.shortDescription}
                </p>
                <div className="flex items-center space-x-6 text-gray-200 dark:text-gray-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {course.instructor}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Max {course.maxStudents} students
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8">
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Suggested Donation</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${course.suggestedDonationAmount}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Min: ${course.minDonationAmount} • Max: ${course.maxDonationAmount}
                    </p>
                  </div>
                  <Link
                    href={`/premium-training/${course.slug.current}/enroll`}
                    className="block w-full px-6 py-3 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Enroll Now
                  </Link>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Enrollment deadline: {new Date(course.enrollmentDeadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Course Description */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">About This Course</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Learning Objectives */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Learning Objectives</h2>
                  <ul className="space-y-2">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 mr-3 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Prerequisites</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Modules */}
              {course.modules && course.modules.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Course Modules</h2>
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Module {index + 1}: {module.title}
                        </h3>
                        <p className="mb-2 text-gray-600 dark:text-gray-400">{module.description}</p>
                        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">Duration: {module.duration}</p>
                        {module.lessons && module.lessons.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Lessons:</h4>
                            <ul className="space-y-1">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <li key={lessonIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  {lesson}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor */}
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Instructor</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{course.instructor}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructorBio}</p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Course Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Level:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(course.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(course.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donation Tiers */}
              {course.donationTiers && course.donationTiers.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Donation Tiers</h3>
                  <div className="space-y-3">
                    {course.donationTiers.map((tier, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h4>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            ${tier.amount}+
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tier.description}</p>
                        {tier.benefits && tier.benefits.length > 0 && (
                          <ul className="space-y-1">
                            {tier.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
