import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import TopBar from '@/components/TopBar';

// Define interface for Sanity data
interface TeamMemberData {
  name: string;
  title: string;
  bio: string;
  email: string;
  image?: { asset: { url: string } } | null; // Optional image
}

interface TeamResponse {
  team: TeamMemberData[]; // Array of team members
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getTeamData(): Promise<TeamResponse> {
  const query = `*[_type == "team"] {
    name,
    title,
    bio,
    email,
    image {
      asset->{
        url
      }
    }
  }`;
  const team = await client.fetch(query);
  console.log('Team Data:', team); // Debug log
  return { team: team || [] };
}

export default async function Team() {
  const { team } = await getTeamData();

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
            <h1 className="mb-4 text-5xl font-bold text-center text-white drop-shadow-lg">Our Team</h1>
            <p className="max-w-2xl text-xl text-center text-white drop-shadow-lg md:mx-0">
              Meet the dedicated professionals driving our mission forward.
            </p>
          </div>
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </section>

        {/* Team Members Listings Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {team.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    {member.image?.asset && (
                      <img
                        src={member.image.asset.url}
                        alt={member.name}
                        className="object-cover w-full mb-4 rounded-lg h-49"
                      />
                    )}
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{member.title}</p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{member.bio}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{member.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <SpinnerFallback />
                <p className="mt-4 text-red-600 dark:text-red-400">No team members available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}