import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity.client';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import TopBar from '@/components/TopBar';

// Define interface for Sanity data
interface CareerData {
  title: string;
  description: string;
  requirements: string[]; // Array of requirements
  location: string;
  type: string; // Job type
  salary: string;
  applyUrl: string;
  image?: { asset: { url: string } } | null; // Optional image
}

interface CareersResponse {
  careers: CareerData[]; // Array of job openings
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getCareersData(): Promise<CareersResponse> {
  const query = `*[_type == "careers"] {
    title,
    description,
    requirements,
    location,
    type,
    salary,
    applyUrl,
    image {
      asset->{
        url
      }
    }
  }`;
  const careers = await client.fetch(query);
  console.log('Careers Data:', careers); // Debug log
  return { careers: careers || [] };
}

export default async function Careers() {
  const { careers } = await getCareersData();

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
            <h1 className="mb-4 text-5xl font-bold text-center text-white drop-shadow-lg">Job Openings</h1>
            <p className="max-w-2xl text-xl text-center text-white drop-shadow-lg md:mx-0">
              Explore exciting opportunities to join the Young Cyber Knights Foundation and contribute to cybersecurity education and innovation.
            </p>
          </div>
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </section>

        {/* Job Listings Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {careers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {careers.map((career, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    {career.image?.asset && (
                      <img
                        src={career.image.asset.url}
                        alt={career.title}
                        className="object-cover w-full h-48 mb-4 rounded-t-lg"
                      />
                    )}
                    <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{career.title}</h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{career.description}</p>
                    <ul className="mb-4 space-y-1 text-gray-600 dark:text-gray-400">
                      {career.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center">
                          <span className="mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div><strong>Location:</strong> {career.location}</div>
                      <div><strong>Type:</strong> {career.type}</div>
                      <div><strong>Salary:</strong> {career.salary}</div>
                    </div>
                    <a
                      href={career.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <SpinnerFallback />
                <p className="mt-4 text-red-600 dark:text-red-400">No job openings available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}