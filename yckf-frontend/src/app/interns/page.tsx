import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity.client';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import TopBar from '@/components/TopBar';

// Define interface for Sanity data
interface InternData {
  name: string;
  department: string;
  batch: string;
  year: number;
  program: string;
  image?: { asset: { url: string } } | null; // Optional image
}

interface InternsResponse {
  interns: InternData[]; // Array of interns
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getInternsData(): Promise<InternsResponse> {
  const query = `*[_type == "interns"] {
    name,
    department,
    batch,
    year,
    program,
    image {
      asset->{
        url
      }
    }
  }`;
  const interns = await client.fetch(query);
  console.log('Interns Data:', interns); // Debug log
  return { interns: interns || [] };
}

export default async function Interns() {
  const { interns } = await getInternsData();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
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
            <h1 className="mb-4 text-5xl font-bold text-center text-white drop-shadow-lg">Our Interns</h1>
            <p className="max-w-2xl text-xl text-center text-white drop-shadow-lg md:mx-0">
              Building the next generation of cybersecurity professionals.
            </p>
          </div>
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </section>

        {/* Interns Listings Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Search and Filters */}
            <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Search Interns..."
                className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <option>All Batches</option>
                {/* Add dynamic options if needed */}
              </select>
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <option>All Years</option>
                {/* Add dynamic options if needed */}
              </select>
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <option>All Programs</option>
                {/* Add dynamic options if needed */}
              </select>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Showing {interns.length} of {interns.length} Interns</p>

            {interns.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {interns.map((intern, index) => (
                  <div key={index}  className="relative flex items-center p-4 space-x-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
>
                    {intern.image?.asset && (
                      <img
                        src={intern.image.asset.url}
                        alt={intern.name}
                        className="object-cover w-24 h-40 mb-4 rounded-lg "
                      />
                    )}
                    <span className="absolute px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full top-4 left-4">
                      {intern.batch}
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{intern.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{intern.department}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <SpinnerFallback />
                <p className="mt-4 text-red-600 dark:text-red-400">No data available.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}