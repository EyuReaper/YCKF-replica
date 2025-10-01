import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReloadIcon } from '@radix-ui/react-icons';
import { client } from '@/lib/sanity';

// Define interfaces for Sanity data with optional fields
interface AboutData {
  title: string;
  description: string;
  image?: { asset: { url: string } }; // Optional image
  whoWeAre: string;
  mission: string;
  vision: string;
  story: string;
  coreValues: { value: string }[]; // Always an array
  history?: string; // Optional
  historyMilestones?: { milestone: string }[]; // Optional array
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image?: { asset: { url: string } }; // Optional image
}

async function getAboutData(): Promise<AboutData> {
  const query = `*[_type == "about"][0] {
    title,
    description,
    image,
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
  return {
    title: data?.title || '',
    description: data?.description || '',
    image: data?.image || undefined,
    whoWeAre: data?.whoWeAre || '',
    mission: data?.mission || '',
    vision: data?.vision || '',
    story: data?.story || '',
    coreValues: data?.coreValues || [], // Ensure it's an array
    history: data?.history || '',
    historyMilestones: data?.historyMilestones || [],
  };
}

async function getTestimonials(): Promise<Testimonial[]> {
  const query = `*[_type == "testimonial"] {
    quote,
    name,
    title,
    image
  }`;
  const testimonials = await client.fetch(query);
  return testimonials || []; // Fallback for empty array
}

// ⚠️ Note: Since this is an async Server Component, any missing data 
// will only show the spinner if the data is *falsy* (e.g., an empty string) 
// and the query succeeded. If the query *failed*, Next.js would usually 
// show an error boundary unless you wrap the fetch in a try/catch.

// Helper component for the spinner fallback
const SpinnerFallback = () => (
    <div className="flex items-center justify-center py-4">
        <ReloadIcon className="w-8 h-8 text-gray-500 animate-spin dark:text-gray-400" />
    </div>
);


export default async function About() {
  const data = await getAboutData();
  const testimonials = await getTestimonials();

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Image on Right */}
        <section className="relative py-20 bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center max-w-5xl gap-8 px-4 mx-auto md:flex-row-reverse">
            {data.image?.asset && (
              <img
                src={data.image.asset.url}
                alt={data.title || 'YCKF Overview'}
                className="object-cover w-full h-64 rounded-lg shadow-md md:w-1/3"
              />
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
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              {/* FIXED: Check for data.whoWeAre, otherwise render SpinnerFallback component */}
              {data.whoWeAre || <SpinnerFallback />} 
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Mission</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              {/* FIXED: Check for data.mission, otherwise render SpinnerFallback component */}
              {data.mission || <SpinnerFallback />}
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Vision</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              {/* FIXED: Check for data.vision, otherwise render SpinnerFallback component */}
              {data.vision || <SpinnerFallback />}
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Story</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              {/* FIXED: Check for data.story, otherwise render SpinnerFallback component */}
              {data.story || <SpinnerFallback />}
            </p>
            
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Core Values</h2>
            <ul className="space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
              {data.coreValues.length > 0 ? (
                data.coreValues.map((value, index) => <li key={index}>{value.value}</li>)
              ) : (
                // Already correctly rendering the spinner here, but wrapped in the helper for consistency
                <SpinnerFallback /> 
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
                {testimonials.length > 0 ? (
                    <>
                        {/* Original content */}
                        <div className="inline-flex items-center px-6 space-x-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="flex-shrink-0 p-6 bg-white rounded-lg shadow-md w-80 dark:bg-gray-700">
                                    {testimonial.image?.asset && (
                                        <img
                                            src={testimonial.image.asset.url}
                                            alt={`${testimonial.name}'s Profile`}
                                            className="object-cover w-12 h-12 mb-2 rounded-full"
                                        />
                                    )}
                                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">{testimonial.quote}</p>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                                </div>
                            ))}
                        </div>
                        {/* Duplicate content for seamless looping */}
                        <div className="inline-flex items-center px-6 space-x-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={`dup-${index}`} className="flex-shrink-0 p-6 bg-white rounded-lg shadow-md w-80 dark:bg-gray-700">
                                    {testimonial.image?.asset && (
                                        <img
                                            src={testimonial.image.asset.url}
                                            alt={`${testimonial.name}'s Profile`}
                                            className="object-cover w-12 h-12 mb-2 rounded-full"
                                        />
                                    )}
                                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">{testimonial.quote}</p>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-full p-10">
                        <SpinnerFallback />
                    </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our History</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              {/* FIXED: Check for data.history, otherwise render SpinnerFallback component */}
              {data.history || <SpinnerFallback />}
            </p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
              {data.historyMilestones && data.historyMilestones.length > 0 ? (
                data.historyMilestones.map((milestone, index) => <li key={index}>{milestone.milestone}</li>)
              ) : (
                // Already correctly rendering the spinner here, but wrapped in the helper for consistency
                <SpinnerFallback />
              )}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}