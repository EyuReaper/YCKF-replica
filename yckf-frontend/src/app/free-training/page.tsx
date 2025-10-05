import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import Link from 'next/link'; // Import Link for navigation
import TopBar
  from '@/components/TopBar';
// Define interface for Sanity data
interface TrainingData {
  title: string;
  description: string;
  date: string; // ISO datetime string
  duration: string;
  instructor: string;
  registrationUrl: string;
  image?: { asset: { url: string } } | null; // Optional image
}

interface TrainingResponse {
  trainings: TrainingData[]; // Array of training sessions
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getTrainingData(): Promise<TrainingResponse> {
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
    }
  }`;
  const trainings = await client.fetch(query);
  console.log('Training Data:', trainings); // Debug log
  return { trainings: trainings || [] };
}

export default async function FreeTraining() {
  const { trainings } = await getTrainingData();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        {/* Main Content Section */}
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Free Training Sessions</h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Unlock your potential with our expertly designed free training sessions in cybersecurity. Start your journey today!
          </p>

          {/* Get Started Button */}
          <div className="mb-10">
            <Link href="/get-started" className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
              Get Started
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search Training..."
              className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Instructors</option>
              {/* Add dynamic options if needed */}
            </select>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Dates</option>
              {/* Add dynamic options if needed */}
            </select>
          </div>

          {trainings.length > 0 ? (
            <div className="space-y-6">
              {trainings.map((training, index) => (
                <div key={index} className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 flex items-center">
                  {training.image?.asset && (
                    <img
                      src={training.image.asset.url}
                      alt={training.title}
                      className="object-cover w-32 h-32 mr-6 rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{training.title}</h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(training.date).toLocaleDateString()} | {training.duration}
                    </p>
                    <p className="mb-2 text-gray-600 dark:text-gray-400">Instructor: {training.instructor}</p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">{training.description}</p>
                    <a
                      href={training.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <SpinnerFallback />
              <p className="mt-4 text-red-600 dark:text-red-400">No training sessions available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}