import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri'; // Import a spinner icon from react-icons
import TopBar from '@/components/TopBar';

// Define interfaces for Sanity data with optional fields
interface AboutData {
  title: string;
  description: string;
  image?: { asset?: { _ref?: string; url?: string } } | null; // Updated to handle reference and url
  whoWeAre: string;
  mission: string;
  vision: string;
  story: string;
  coreValues: { value: string }[];
  history?: string;
  historyMilestones?: { milestone: string }[];
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image?: { asset?: { url?: string } } | null; // Optional image
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-4">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

async function getAboutData(): Promise<AboutData> {
  const query = `*[_type == "about"][0] {
    title,
    description,
    image {
      asset->{
        _id,
        url,
        _type
      }
    },
    whoWeAre,
    mission,
    vision,
    story,
    coreValues[] {
      value
    },
    history,
    historyMilestones[] {
      milestone
    }
  }`;
  const data = await client.fetch(query);
  console.log('Full About Data:', JSON.stringify(data, null, 2)); // Detailed log
  return {
    title: data?.title || '',
    description: data?.description || '',
    image: data?.image || null, // Handle null case
    whoWeAre: data?.whoWeAre || '',
    mission: data?.mission || '',
    vision: data?.vision || '',
    story: data?.story || '',
    coreValues: data?.coreValues || [],
    history: data?.history || '',
    historyMilestones: data?.historyMilestones || [],
  };
}

async function getTestimonials(): Promise<Testimonial[]> {
  const query = `*[_type == "testimonial"] {
    quote,
    name,
    title,
    image {
      asset->{
        url
      }
    }
  }`;
  const testimonials = await client.fetch(query);
  console.log('Testimonials:', testimonials);
  return testimonials || [];
}

export default async function About() {
  const data = await getAboutData();
  const testimonials = await getTestimonials();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        {/* Hero Section with Image on Right */}
        <section className="relative py-20 bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center max-w-5xl gap-8 px-4 mx-auto md:flex-row-reverse">
            {data.image?.asset && (
              <>
                <img
                  src={data.image.asset.url || ''} // Fallback to empty string if url is undefined
                  alt={data.title || 'YCKF Overview'}
                  className="object-cover w-full h-64 rounded-lg shadow-md md:w-1/3"
                />
                {console.log('Image URL:', data.image.asset?.url)} {/* Debug log */}
              </>
            )}
            <div className="text-center md:text-left">
              <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-gray-100">{data.title || 'About Us'}</h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-600 md:mx-0 dark:text-gray-400">
                {data.description || 'Learn more about the Young Cyber Knights Foundation.'}
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are, Our Mission, and Our Vision Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Who We Are</h2>
            <div className="mb-6 text-lg text-gray-600 dark:text-gray-400">{data.whoWeAre || <SpinnerFallback />}</div>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Mission</h2>
            <div className="mb-6 text-lg text-gray-600 dark:text-gray-400">{data.mission || <SpinnerFallback />}</div>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Vision</h2>
            <div className="mb-6 text-lg text-gray-600 dark:text-gray-400">{data.vision || <SpinnerFallback />}</div>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Story</h2>
            <div className="mb-6 text-lg text-gray-600 dark:text-gray-400">{data.story || <SpinnerFallback />}</div>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Core Values</h2>
            <ul className="space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
              {data.coreValues.length > 0 ? (
                data.coreValues.map((value, index) => <li key={index}>{value.value}</li>)
              ) : (
                <li><SpinnerFallback /></li>
              )}
            </ul>
          </div>
        </section>

        {/* What Our Community Says Section with Auto-Scroll and Round Icon */}
        <section className="px-4 py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">What Our Community Says</h2>
            <p className="mb-6 text-lg text-center text-gray-600 dark:text-gray-400">
              Hear from the cybersecurity professionals and students who have been part of our community
            </p>
            <div className="overflow-x-hidden whitespace-nowrap">
              <div className="inline-flex animate-scroll" style={{ animationDuration: '20s', width: '200%' }}>
                <div className="inline-flex items-center px-6 space-x-8">
                  {testimonials.length > 0 ? (
                    testimonials.map((testimonial, index) => (
                      <div key={index} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                        {testimonial.image?.asset && (
                          <img
                            src={testimonial.image.asset.url || ''}
                            alt={`${testimonial.name}'s Profile`}
                            className="object-cover w-12 h-12 mb-2 rounded-full"
                          />
                        )}
                        <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">{testimonial.quote}</p>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700"><SpinnerFallback /></div>
                  )}
                </div>
                {/* Duplicate content for seamless looping */}
                <div className="inline-flex items-center px-6 space-x-8">
                  {testimonials.length > 0 ? (
                    testimonials.map((testimonial, index) => (
                      <div key={`dup-${index}`} className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                        {testimonial.image?.asset && (
                          <img
                            src={testimonial.image.asset.url || ''}
                            alt={`${testimonial.name}'s Profile`}
                            className="object-cover w-12 h-12 mb-2 rounded-full"
                          />
                        )}
                        <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">{testimonial.quote}</p>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700"><SpinnerFallback /></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our History</h2>
            <div className="mb-6 text-lg text-gray-600 dark:text-gray-400">{data.history || <SpinnerFallback />}</div>
            <ul className="space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
              {data.historyMilestones && data.historyMilestones.length > 0 ? (
                data.historyMilestones.map((milestone, index) => <li key={index}>{milestone.milestone}</li>)
              ) : (
                <li><SpinnerFallback /></li>
              )}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}