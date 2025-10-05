import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useState } from 'react';

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
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getDashboardData(): Promise<DashboardData> {
  // In a real application, you would get the student's email from authentication
  // For now, we'll fetch all data (you should filter by authenticated user)
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

  return { 
    enrollments: enrollments || [], 
    progress: progress || [] 
  };
}

export default async function StudentDashboard() {
  const { enrollments, progress } = await getDashboardData();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="mb-2 text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                Student Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Track your learning progress and access your courses
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <Link 
                href="/premium-training" 
                className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Courses
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

        {/* Stats Overview */}
        <section className="px-4 pb-8 mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="p-2 text-blue-600 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Courses</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{enrollments.length}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="p-2 text-green-600 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {progress.filter(p => p.overallProgress === 100).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="p-2 text-purple-600 bg-purple-100 rounded-lg dark:bg-purple-900 dark:text-purple-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {Math.round(progress.reduce((acc, p) => acc + p.totalTimeSpent, 0) / 60)}h
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="p-2 text-yellow-600 bg-yellow-100 rounded-lg dark:bg-yellow-900 dark:text-yellow-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {progress.filter(p => p.certificateIssued).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enrolled Courses */}
        <section className="px-4 pb-16 mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">My Courses</h2>
          
          {enrollments.length > 0 ? (
            <div className="space-y-6">
              {enrollments.map((enrollment) => {
                const courseProgress = progress.find(p => p.enrollment._id === enrollment._id);
                return (
                  <div key={enrollment._id} className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      {enrollment.course.image?.asset && (
                        <img
                          src={enrollment.course.image.asset.url}
                          alt={enrollment.course.title}
                          className="object-cover w-32 h-32 mr-6 rounded-lg mb-4 md:mb-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {enrollment.course.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.enrollmentStatus === 'active' 
                                ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
                                : enrollment.enrollmentStatus === 'completed'
                                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
                                : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {enrollment.enrollmentStatus}
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                              {enrollment.course.level}
                            </span>
                          </div>
                        </div>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {enrollment.course.instructor} • {enrollment.course.duration}
                        </p>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </p>
                        
                        {courseProgress && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {courseProgress.overallProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${courseProgress.overallProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            href={`/premium-training/${enrollment.course._id}/learn`}
                            className="inline-block px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            Continue Learning
                          </Link>
                          {courseProgress?.certificateIssued && courseProgress.certificateUrl && (
                            <Link
                              href={courseProgress.certificateUrl}
                              target="_blank"
                              className="inline-block px-4 py-2 text-sm font-medium text-center text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                            >
                              View Certificate
                            </Link>
                          )}
                          {courseProgress?.certificateEligible && !courseProgress.certificateIssued && (
                            <button className="inline-block px-4 py-2 text-sm font-medium text-center text-yellow-600 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors duration-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">
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
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No courses enrolled</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Start your learning journey by enrolling in our premium training courses.
              </p>
              <Link
                href="/premium-training"
                className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
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
