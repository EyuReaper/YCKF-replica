'use client'; // Mark as Client Component to use useTheme

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

// Define interfaces for Sanity data
interface EnrollmentData {
  _id: string;
  studentName: string;
  studentEmail: string;
  course: {
    _id: string;
    title: string;
    image?: { asset: { url: string } } | null;
    duration: string;
    instructor: string;
    level: string;
  };
  enrollmentDate: string;
  donationAmount: number;
  donationTier: string;
  paymentStatus: string;
  enrollmentStatus: string;
  certificateIssued: boolean;
  certificateUrl?: string;
}

interface ProgressData {
  _id: string;
  enrollment: {
    _id: string;
    studentName: string;
    course: {
      _id: string;
      title: string;
    };
  };
  overallProgress: number;
  lastAccessed: string;
  totalTimeSpent: number;
  moduleProgress: Array<{
    moduleTitle: string;
    completed: boolean;
    completionDate?: string;
    progressPercentage: number;
  }>;
  certificateEligible: boolean;
  certificateIssued: boolean;
  certificateUrl?: string;
}

interface DashboardData {
  enrollments: EnrollmentData[];
  progress: ProgressData[];
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

export default function StudentDashboard() {
  const { theme } = useTheme(); // Access the theme from context
  const [dashboardData, setDashboardData] = useState<DashboardData>({ enrollments: [], progress: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const enrollmentsQuery = `*[_type == "studentEnrollment"] {
          _id,
          studentName,
          studentEmail,
          course->{
            _id,
            title,
            image {
              asset->{
                url
              }
            },
            duration,
            instructor,
            level
          },
          enrollmentDate,
          donationAmount,
          donationTier,
          paymentStatus,
          enrollmentStatus,
          certificateIssued,
          certificateUrl
        }`;

        const progressQuery = `*[_type == "courseProgress"] {
          _id,
          enrollment->{
            _id,
            studentName,
            course->{
              _id,
              title
            }
          },
          overallProgress,
          lastAccessed,
          totalTimeSpent,
          moduleProgress,
          certificateEligible,
          certificateIssued,
          certificateUrl
        }`;

        const [enrollments, progress] = await Promise.all([
          client.fetch(enrollmentsQuery),
          client.fetch(progressQuery)
        ]);

        if (isMounted) {
          setDashboardData({ enrollments: enrollments || [], progress: progress || [] });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic classes based on theme
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = theme === 'light' ? 'border-gray-100' : 'border-gray-700';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const buttonBgClass = theme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const buttonHoverClass = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-blue-800';
  const secondaryButtonBgClass = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';
  const secondaryButtonHoverClass = theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-gray-600';
  const secondaryTextClass = theme === 'light' ? 'text-gray-800' : 'text-gray-100';

  const { enrollments, progress } = dashboardData;

  return (
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <section className={`px-4 py-16 mx-auto max-w-7xl ${bgClass}`}>
          <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h1 className={`mb-2 text-4xl font-extrabold tracking-tight ${textClass}`}>
                Student Dashboard
              </h1>
              <p className={`text-lg ${subTextClass}`}>
                Track your learning progress and access your courses
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-4 sm:flex-row md:mt-0">
              <Link 
                href="/premium-training" 
                className={`inline-block px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 ${buttonBgClass} rounded-lg shadow-md ${buttonHoverClass}`}
              >
                Browse Courses
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

        {/* Stats Overview */}
        <section className={`px-4 pb-8 mx-auto max-w-7xl ${bgClass}`}>
          <div className="grid gap-6 md:grid-cols-4">
            <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
              <div className="flex items-center">
                <div className={`p-2 ${theme === 'light' ? 'text-blue-600 bg-blue-100' : 'text-blue-200 bg-blue-900'} rounded-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${subTextClass}`}>Enrolled Courses</p>
                  <p className={`text-2xl font-semibold ${textClass}`}>{enrollments.length}</p>
                </div>
              </div>
            </div>
            <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
              <div className="flex items-center">
                <div className={`p-2 ${theme === 'light' ? 'text-green-600 bg-green-100' : 'text-green-200 bg-green-900'} rounded-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${subTextClass}`}>Completed</p>
                  <p className={`text-2xl font-semibold ${textClass}`}>
                    {progress.filter(p => p.overallProgress === 100).length}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
              <div className="flex items-center">
                <div className={`p-2 ${theme === 'light' ? 'text-purple-600 bg-purple-100' : 'text-purple-200 bg-purple-900'} rounded-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${subTextClass}`}>Time Spent</p>
                  <p className={`text-2xl font-semibold ${textClass}`}>
                    {Math.round(progress.reduce((acc, p) => acc + p.totalTimeSpent, 0) / 60)}h
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
              <div className="flex items-center">
                <div className={`p-2 ${theme === 'light' ? 'text-yellow-600 bg-yellow-100' : 'text-yellow-200 bg-yellow-900'} rounded-lg`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${subTextClass}`}>Certificates</p>
                  <p className={`text-2xl font-semibold ${textClass}`}>
                    {progress.filter(p => p.certificateIssued).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enrolled Courses */}
        <section className={`px-4 pb-16 mx-auto max-w-7xl ${bgClass}`}>
          <h2 className={`mb-6 text-2xl font-bold ${textClass}`}>My Courses</h2>
          
          {loading ? (
            <SpinnerFallback />
          ) : enrollments.length > 0 ? (
            <div className="space-y-6">
              {enrollments.map((enrollment) => {
                const courseProgress = progress.find(p => p.enrollment._id === enrollment._id);
                return (
                  <div key={enrollment._id} className={`p-6 ${cardBgClass} rounded-xl shadow-lg ${borderClass} hover:shadow-xl transition-shadow duration-200`}>
                    <div className="flex flex-col items-start md:flex-row md:items-center">
                      {enrollment.course.image?.asset && (
                        <img
                          src={enrollment.course.image.asset.url}
                          alt={enrollment.course.title}
                          className="object-cover w-32 h-32 mb-4 mr-6 rounded-lg md:mb-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-col mb-2 md:flex-row md:items-center md:justify-between">
                          <h3 className={`text-xl font-bold ${textClass}`}>
                            {enrollment.course.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.enrollmentStatus === 'active' 
                                ? `${theme === 'light' ? 'text-green-600 bg-green-100' : 'text-green-200 bg-green-900'}`
                                : enrollment.enrollmentStatus === 'completed'
                                ? `${theme === 'light' ? 'text-blue-600 bg-blue-100' : 'text-blue-200 bg-blue-900'}`
                                : `${theme === 'light' ? 'text-gray-600 bg-gray-100' : 'text-gray-200 bg-gray-700'}`
                            }`}>
                              {enrollment.enrollmentStatus}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'text-blue-600 bg-blue-100' : 'text-blue-200 bg-blue-900'} rounded-full`}>
                              {enrollment.course.level}
                            </span>
                          </div>
                        </div>
                        <p className={`mb-2 text-sm ${subTextClass}`}>
                          {enrollment.course.instructor} • {enrollment.course.duration}
                        </p>
                        <p className={`mb-2 text-sm ${subTextClass}`}>
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </p>
                        
                        {courseProgress && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Progress</span>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {courseProgress.overallProgress}%
                              </span>
                            </div>
                            <div className={`w-full bg-gray-200 rounded-full h-2 ${theme === 'light' ? '' : 'dark:bg-gray-700'}`}>
                              <div 
                                className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                                style={{ width: `${courseProgress.overallProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Link
                            href={`/premium-training/${enrollment.course._id}/learn`}
                            className={`inline-block px-4 py-2 text-sm font-medium text-center text-white transition-colors duration-200 ${buttonBgClass} rounded-md ${buttonHoverClass}`}
                          >
                            Continue Learning
                          </Link>
                          {courseProgress?.certificateIssued && courseProgress.certificateUrl && (
                            <Link
                              href={courseProgress.certificateUrl}
                              target="_blank"
                              className={`inline-block px-4 py-2 text-sm font-medium text-center ${theme === 'light' ? 'text-green-600' : 'text-green-200'} ${theme === 'light' ? 'bg-green-50' : 'bg-green-900'} rounded-md hover:${theme === 'light' ? 'bg-green-100' : 'bg-green-800'} transition-colors duration-200`}
                            >
                              View Certificate
                            </Link>
                          )}
                          {courseProgress?.certificateEligible && !courseProgress.certificateIssued && (
                            <button className={`inline-block px-4 py-2 text-sm font-medium text-center ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-200'} ${theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900'} rounded-md hover:${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-800'} transition-colors duration-200`}>
                              Request Certificate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className={`mb-2 text-lg font-semibold ${textClass}`}>No courses enrolled</h3>
              <p className={`mb-4 ${subTextClass}`}>
                Start your learning journey by enrolling in our premium training courses.
              </p>
              <Link
                href="/premium-training"
                className={`inline-block px-6 py-3 text-lg font-semibold text-white ${buttonBgClass} rounded-lg shadow-md ${buttonHoverClass}`}
              >
                Browse Courses
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}