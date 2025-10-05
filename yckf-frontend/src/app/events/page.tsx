import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import TopBar from '@/components/TopBar';

// Define interface for Sanity data
interface EventData {
  title: string;
  description: string;
  date: string; // ISO datetime string
  location: string;
  registrationUrl: string;
  image?: { asset: { url: string } } | null; // Optional image
}

interface EventsResponse {
  events: EventData[]; // Array of events
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getEventsData(): Promise<EventsResponse> {
  const query = `*[_type == "events"] {
    title,
    description,
    date,
    location,
    registrationUrl,
    image {
      asset->{
        url
      }
    }
  }`;
  const events = await client.fetch(query);
  console.log('Events Data:', events); // Debug log
  return { events: events || [] };
}

export default async function Events() {
  const { events } = await getEventsData();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Topbar/>
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
            <h1 className="mb-4 text-5xl font-bold text-center text-white drop-shadow-lg">Upcoming Events</h1>
            <p className="max-w-2xl text-xl text-center text-white drop-shadow-lg md:mx-0">
              Join us for exciting events to enhance your cybersecurity skills and network with professionals.
            </p>
          </div>
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </section>

        {/* Events Listings Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {events.map((event, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    {event.image?.asset && (
                      <img
                        src={event.image.asset.url}
                        alt={event.title}
                        className="object-cover w-full h-48 mb-4 rounded-t-lg"
                      />
                    )}
                    <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{event.title}</h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()} | {event.location}
                    </p>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{event.description}</p>
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Register Now
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <SpinnerFallback />
                <p className="mt-4 text-red-600 dark:text-red-400">No events available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}