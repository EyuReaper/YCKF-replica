import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import TopBar from '@/components/TopBar';

// Define interface for Sanity data
interface VolunteerData {
  name: string;
  role: string;
  bio: string;
  joinedDate: string; // ISO datetime string
  image?: { asset: { url: string } } | null; // Optional image
}

interface VolunteersResponse {
  volunteers: VolunteerData[]; // Array of volunteers
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getVolunteersData(): Promise<VolunteersResponse> {
  const query = `*[_type == "volunteers"] {
    name,
    role,
    bio,
    joinedDate,
    image {
      asset->{
        url
      }
    }
  }`;
  const volunteers = await client.fetch(query);
  console.log('Volunteers Data:', volunteers); // Debug log
  return { volunteers: volunteers || [] };
}

export default async function Volunteers() {
  const { volunteers } = await getVolunteersData();

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
            <h1 className="mb-4 text-5xl font-bold text-center text-white drop-shadow-lg">Our Volunteers</h1>
            <p className="max-w-2xl text-xl text-center text-white drop-shadow-lg md:mx-0">
              Dedicated individuals powering our community efforts.
            </p>
          </div>
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </section>

        {/* Volunteers Listings Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {volunteers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {volunteers.map((volunteer, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    {volunteer.image?.asset && (
                      <img
                        src={volunteer.image.asset.url}
                        alt={volunteer.name}
                        className="object-cover w-full h-48 mb-4 rounded-lg"
                      />
                    )}
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{volunteer.name}</h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{volunteer.role}</p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{volunteer.bio}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Joined: {new Date(volunteer.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <SpinnerFallback />
                <p className="mt-4 text-red-600 dark:text-red-400">No volunteers available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}