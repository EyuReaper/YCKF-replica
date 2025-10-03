import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons

// Define interface for Sanity data
interface TopPerformerData {
  name: string;
  recognition: string;
  year: number;
  category: string; // e.g., "Volunteer", "Intern"
  image?: { asset: { url: string } } | null; // Optional image
}

interface TopPerformersResponse {
  topPerformers: TopPerformerData[]; // Array of top performers
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getTopPerformersData(): Promise<TopPerformersResponse> {
  const query = `*[_type == "topPerformers"] {
    name,
    recognition,
    year,
    category,
    image {
      asset->{
        url
      }
    }
  }`;
  const topPerformers = await client.fetch(query);
  console.log('Top Performers Data:', topPerformers); // Debug log
  return { topPerformers: topPerformers || [] };
}

export default async function TopPerformers() {
  const { topPerformers } = await getTopPerformersData();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1">
        {/* Header Section with Background Image */}
        <section
          className="relative py-20 bg-center bg-cover"
          style={{
            backgroundImage: "url('job-openings2.jpg')", // Placeholder image
          }}
        >
          <div className="relative z-10 flex flex-col items-center max-w-5xl gap-8 px-4 mx-auto">
            <h1 className="mb-4 text-5xl font-bold text-center text-white drop-shadow-lg">Top Performers</h1>
            <p className="max-w-2xl text-xl text-center text-white drop-shadow-lg md:mx-0">
              Celebrating Excellence
            </p>
          </div>
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </section>

        {/* Top Performers Listings Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <option>All Years</option>
                {/* Add dynamic options if needed */}
              </select>
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <option>All Categories</option>
                {/* Add dynamic options if needed */}
              </select>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Showing {topPerformers.length} of {topPerformers.length} top performers</p>

            {topPerformers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="relative p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    {performer.image?.asset && (
                      <img
                        src={performer.image.asset.url}
                        alt={performer.name}
                        className="object-cover w-full h-48 mb-4 rounded-lg"
                      />
                    )}
                    <span className="absolute px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-full top-4 left-4">
                      {performer.category}
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{performer.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{performer.recognition}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Year: {performer.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <SpinnerFallback />
                <p className="mt-4 text-red-600 dark:text-red-400">No top performers available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}