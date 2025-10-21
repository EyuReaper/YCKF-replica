'use client'; // Mark as Client Component to use useTheme

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import Link from 'next/link'; // Import Link for navigation
import TopBar from '@/components/TopBar';
import TrainingImage from '@/components/TrainingImage'; // Import the new Client Component
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook
import { useState, useEffect } from 'react';
import { Suspense } from 'react';

// Define interface for Sanity data
interface TrainingData {
  title: string;
  description: string;
  date: string; // ISO datetime string
  duration: string;
  instructor: string;
  registrationUrl: string;
  image?: { asset: { url: string } } | null; // Optional image with asset URL
  capacity?: string; // Optional capacity (e.g., "50 seats")
  location?: string; // Optional location (e.g., "Online")
}

interface TrainingResponse {
  trainings: TrainingData[]; // Array of training sessions
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

export default function FreeTraining() {
  const { theme } = useTheme(); // Access the theme from context

  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTrainingData = async () => {
      try {
        const query = `*[_type == "freeTraining"] {
          title,
          description,
          date,
          duration,
          instructor,
          registrationUrl,
          image {
            asset->{
              url
            }
          },
          capacity,
          location
        }`;
        const response = await client.fetch(query);
        if (isMounted) setTrainings(response || []);
      } catch (error) {
        console.error('❌ Failed to fetch training data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrainingData();

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
  const buttonTextClass = theme === 'light' ? 'bg-blue-100' : 'bg-blue-900';
  const buttonTextHoverClass = theme === 'light' ? 'hover:bg-blue-200' : 'hover:bg-blue-800';
  const errorTextClass = theme === 'light' ? 'text-red-600' : 'text-red-400';

  return (
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Main Content Section */}
        <section className={`px-4 py-16 mx-auto max-w-7xl ${bgClass}`}>
          <h1 className={`mb-6 text-4xl font-extrabold tracking-tight ${textClass}`}>Free Training Sessions</h1>
          <p className={`max-w-2xl mb-8 text-lg ${subTextClass}`}>
            Unlock your potential with our expertly designed free training sessions in cybersecurity. Start your journey today!
          </p>

          {/* Get Started Button */}
          <div className="mb-10">
            <Link
              href="/get-started"
              className={`inline-block px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 ${buttonBgClass} rounded-lg shadow-md ${buttonHoverClass}`}
            >
              Get Started
            </Link>
          </div>

          {/* Search and Filters */}
          <div className={`flex flex-col justify-between mb-8 space-y-4 md:flex-row md:space-y-0 md:space-x-4 ${bgClass}`}>
            <input
              type="text"
              placeholder="Search Training..."
              className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <select className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option>All Instructors</option>
              {/* Add dynamic options if needed */}
            </select>
            <select className={`w-full px-4 py-2 ${inputBgClass} ${inputBorderClass} rounded-md ${inputTextClass} md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option>All Dates</option>
              {/* Add dynamic options if needed */}
            </select>
          </div>

          {loading ? (
            <Suspense fallback={<SpinnerFallback />}>
              <div>Loading...</div> {/* Placeholder while data fetches */}
            </Suspense>
          ) : trainings.length > 0 ? (
            <div className="space-y-6">
              {trainings.map((training, index) => (
                <div
                  key={index}
                  className={`flex items-start p-6 transition-shadow duration-200 ${cardBgClass} ${borderClass} shadow-lg rounded-xl hover:shadow-xl md:items-center`}
                >
                  {training.image?.asset?.url ? (
                    <TrainingImage url={training.image.asset.url} alt={training.title} title={training.title} />
                  ) : (
                    <div className={`flex items-center justify-center w-32 h-32 mr-6 ${inputBgClass} rounded-lg`}>
                      <span className={subTextClass}>No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={`mb-2 text-xl font-bold ${textClass}`}>{training.title}</h3>
                    <p className={`mb-2 text-sm ${subTextClass}`}>
                      {new Date(training.date).toLocaleDateString()} | {training.duration}
                    </p>
                    <p className={subTextClass}>Instructor: {training.instructor}</p>
                    {training.capacity && <p className={subTextClass}>Capacity: {training.capacity}</p>}
                    {training.location && <p className={subTextClass}>Location: {training.location}</p>}
                    <p className={`mb-4 ${subTextClass} line-clamp-3`}>{training.description}</p>
                    <div className="flex space-x-4">
                      <a
                        href={training.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ${buttonBgClass} rounded-md ${buttonHoverClass}`}
                      >
                        Register Now
                      </a>
                      <Link
                        href={`/training/${index}`}
                        className={`inline-block px-4 py-2 text-sm font-medium ${textClass} transition-colors duration-200 ${buttonTextClass} rounded-md ${buttonTextHoverClass}`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <SpinnerFallback />
              <p className={errorTextClass}>No training sessions available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}