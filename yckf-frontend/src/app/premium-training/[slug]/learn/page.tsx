'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity.client';
import { RiLoader2Fill } from 'react-icons/ri';
import TopBar from '@/components/TopBar';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BackendApi } from '@/lib/backend'; // New: For enrollment check
import { useAuth } from '@/context/AuthContext'; // New: For user ID

// Define interfaces
interface CourseModule {
  title: string;
  description: string;
  duration: string;
  lessons: string[];
  resources: string[];
}

interface PremiumTrainingData {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  modules: CourseModule[];
  image?: { asset: { url: string } } | null;
}

interface ProgressData {
  _id: string;
  overallProgress: number;
  moduleProgress: Array<{
    moduleTitle: string;
    moduleId: string;
    completed: boolean;
    completionDate?: string;
    progressPercentage: number;
    lessonProgress: Array<{
      lessonTitle: string;
      completed: boolean;
      completionDate?: string;
      timeSpent: number;
    }>;
  }>;
  totalTimeSpent: number;
  certificateEligible: boolean;
  certificateIssued: boolean;
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

export default function CourseLearningPage() {
  const params = useParams();
  const router = useRouter(); // New: For redirect
  const { user } = useAuth(); // New: For user ID in enrollment check
  const [course, setCourse] = useState<PremiumTrainingData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<boolean | null>(null); // New: Enrollment status
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  // New: useEffect for access check (per diff – on page load)
  useEffect(() => {
    if (!user || !params.slug) return;

    async function checkEnrollment() {
      try {
        // Query backend for enrollment (adjust endpoint as per backend)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/enrollments?courseId=${params.slug}&userId=${user.id}`);
        const enrollments = await response.json();
        const hasEnrollment = enrollments.length > 0;
        setEnrolled(hasEnrollment);

        if (!hasEnrollment) {
          router.push(`/premium-training/${params.slug}/enroll`); // Redirect if no enrollment
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
        router.push(`/premium-training/${params.slug}/enroll`); // Redirect on error
      }
    }

    checkEnrollment();
  }, [user, params.slug, router]);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        // Fetch course data
        const courseQuery = `*[_type == "premiumTraining" && slug.current == $slug && isActive == true][0] {
          _id,
          title,
          description,
          instructor,
          duration,
          level,
          modules,
          image {
            asset->{
              url
            }
          }
        }`;
        
        const courseData = await client.fetch(courseQuery, { slug: params.slug });
        setCourse(courseData);

        // Fetch progress data (in a real app, you'd get this from authenticated user)
        const progressQuery = `*[_type == "courseProgress" && course._ref == $courseId][0] {
          _id,
          overallProgress,
          moduleProgress,
          totalTimeSpent,
          certificateEligible,
          certificateIssued
        }`;
        
        const progressData = await client.fetch(progressQuery, { courseId: courseData._id });
        setProgress(progressData);

      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (enrolled !== false) { // Only fetch if enrolled (or loading)
      fetchCourseData();
    }
  }, [params.slug, enrolled]);

  const updateProgress = async (moduleIndex: number, lessonIndex: number) => {
    if (!progress || !course) return;

    setIsUpdatingProgress(true);

    try {
      const updatedModuleProgress = [...progress.moduleProgress];
      
      // Ensure module exists in progress
      if (!updatedModuleProgress[moduleIndex]) {
        updatedModuleProgress[moduleIndex] = {
          moduleTitle: course.modules[moduleIndex].title,
          moduleId: `module_${moduleIndex}`,
          completed: false,
          progressPercentage: 0,
          lessonProgress: course.modules[moduleIndex].lessons.map((lesson, idx) => ({
            lessonTitle: lesson,
            completed: false,
            timeSpent: 0
          }))
        };
      }

      // Mark lesson as completed
      if (!updatedModuleProgress[moduleIndex].lessonProgress[lessonIndex].completed) {
        updatedModuleProgress[moduleIndex].lessonProgress[lessonIndex].completed = true;
        updatedModuleProgress[moduleIndex].lessonProgress[lessonIndex].completionDate = new Date().toISOString();
        updatedModuleProgress[moduleIndex].lessonProgress[lessonIndex].timeSpent += 30; // Simulate 30 minutes

        // Update module progress
        const completedLessons = updatedModuleProgress[moduleIndex].lessonProgress.filter(l => l.completed).length;
        const totalLessons = updatedModuleProgress[moduleIndex].lessonProgress.length;
        updatedModuleProgress[moduleIndex].progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        updatedModuleProgress[moduleIndex].completed = completedLessons === totalLessons;
        if (updatedModuleProgress[moduleIndex].completed) {
          updatedModuleProgress[moduleIndex].completionDate = new Date().toISOString();
        }
      }

      // Calculate overall progress
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedLessons = updatedModuleProgress.reduce((acc, module) => 
        acc + module.lessonProgress.filter(lesson => lesson.completed).length, 0
      );
      const overallProgress = Math.round((completedLessons / totalLessons) * 100);

      // Update total time spent
      const totalTimeSpent = updatedModuleProgress.reduce((acc, module) => 
        acc + module.lessonProgress.reduce((moduleAcc, lesson) => moduleAcc + lesson.timeSpent, 0), 0
      );

      // Update progress in Sanity
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progressId: progress._id,
          moduleProgress: updatedModuleProgress,
          overallProgress: overallProgress,
          totalTimeSpent: totalTimeSpent,
          lastAccessed: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setProgress(prev => prev ? {
          ...prev,
          moduleProgress: updatedModuleProgress,
          overallProgress: overallProgress,
          totalTimeSpent: totalTimeSpent,
          certificateEligible: overallProgress === 100
        } : null);
      }

    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const requestCertificate = async () => {
    if (!progress || !course) return;

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progressId: progress._id,
          studentName: user?.name || 'Student Name', // Updated: Use user from auth
          courseTitle: course.title,
          completionDate: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProgress(prev => prev ? {
          ...prev,
          certificateIssued: true,
          certificateUrl: result.certificateUrl
        } : null);
        alert('Certificate generated successfully!');
      }
    } catch (error) {
      console.error('Error requesting certificate:', error);
    }
  };

  if (loading || enrolled === null) {
    return (
      <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <TopBar/>
        <Header />
        <main className="flex items-center justify-center flex-1">
          <SpinnerFallback />
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || !enrolled) {
    return (
      <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <TopBar/>
        <Header />
        <main className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400">You need to enroll in this course to access the learning materials.</p>
            <button
              onClick={() => router.push(`/premium-training/${params.slug}/enroll`)}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Enroll Now
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData?.lessons[currentLesson];

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="overflow-y-auto border-r border-gray-200 w-80 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Course Content</h2>
              
              {/* Progress Overview */}
              {progress && (
                <div className="p-4 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Overall Progress</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{progress.overallProgress}%</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(progress.totalTimeSpent / 60)}h
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600">
                    <div 
                      className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                      style={{ width: `${progress.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Modules */}
              <div className="space-y-2">
                {course.modules.map((module, moduleIndex) => {
                  const moduleProgress = progress?.moduleProgress[moduleIndex];
                  const isCompleted = moduleProgress?.completed || false;
                  const progressPercentage = moduleProgress?.progressPercentage || 0;

                  return (
                    <div key={moduleIndex} className="border border-gray-200 rounded-lg dark:border-gray-700">
                      <button
                        onClick={() => setCurrentModule(moduleIndex)}
                        className={`w-full p-3 text-left transition-colors ${
                          currentModule === moduleIndex
                            ? 'bg-blue-50 dark:bg-blue-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : progressPercentage > 0 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                            }`}>
                              {isCompleted ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-xs font-medium">{moduleIndex + 1}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {module.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{module.duration}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {progressPercentage}%
                          </span>
                        </div>
                      </button>

                      {/* Lessons */}
                      {currentModule === moduleIndex && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const lessonProgress = moduleProgress?.lessonProgress[lessonIndex];
                            const isLessonCompleted = lessonProgress?.completed || false;

                            return (
                              <button
                                key={lessonIndex}
                                onClick={() => setCurrentLesson(lessonIndex)}
                                className={`w-full p-3 pl-12 text-left text-sm transition-colors ${
                                  currentLesson === lessonIndex
                                    ? 'bg-blue-50 dark:bg-blue-900'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-3 ${
                                    isLessonCompleted 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}>
                                    {isLessonCompleted && (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">{lesson}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {currentModuleData?.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Lesson {currentLesson + 1} of {currentModuleData?.lessons.length}
                  </p>
                </div>
                {progress?.certificateEligible && !progress.certificateIssued && (
                  <button
                    onClick={requestCertificate}
                    className="px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Request Certificate
                  </button>
                )}
                {progress?.certificateIssued && progress.certificateUrl && (
                  <a
                    href={progress.certificateUrl}
                    target="_blank"
                    className="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </div>

            {/* Lesson Content */}
            <div className="flex-1 p-6">
              {currentLessonData ? (
                <div className="max-w-4xl">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {currentLessonData}
                  </h2>
                  
                  {/* Mock lesson content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      This is a sample lesson content for <strong>{currentLessonData}</strong>. 
                      In a real application, this would contain the actual course material, 
                      videos, interactive content, and assessments.
                    </p>
                    
                    <div className="p-6 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900">
                      <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Learning Objectives
                      </h3>
                      <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                        <li>• Understand the key concepts covered in this lesson</li>
                        <li>• Apply the knowledge in practical scenarios</li>
                        <li>• Complete the lesson assessment</li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Lesson Content
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This is where the actual lesson content would be displayed. 
                        It could include videos, text, interactive elements, code examples, 
                        and other educational materials.
                      </p>
                    </div>
                  </div>

                  {/* Lesson Actions */}
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => {
                        if (currentLesson > 0) {
                          setCurrentLesson(currentLesson - 1);
                        } else if (currentModule > 0) {
                          setCurrentModule(currentModule - 1);
                          setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
                        }
                      }}
                      disabled={currentModule === 0 && currentLesson === 0}
                      className="px-6 py-2 text-gray-600 transition-colors duration-200 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={() => updateProgress(currentModule, currentLesson)}
                      disabled={isUpdatingProgress}
                      className="px-6 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingProgress ? 'Marking Complete...' : 'Mark as Complete'}
                    </button>

                    <button
                      onClick={() => {
                        if (currentLesson < currentModuleData.lessons.length - 1) {
                          setCurrentLesson(currentLesson + 1);
                        } else if (currentModule < course.modules.length - 1) {
                          setCurrentModule(currentModule + 1);
                          setCurrentLesson(0);
                        }
                      }}
                      disabled={currentModule === course.modules.length - 1 && currentLesson === currentModuleData.lessons.length - 1}
                      className="px-6 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    No lesson selected
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please select a lesson from the sidebar to begin learning.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}