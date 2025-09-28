import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Volunteers() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 px-4 py-16 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 dark:text-gray-100">Our Volunteers</h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Learn about the passionate volunteers who support YCKF’s mission to enhance cybersecurity awareness.
          </p>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Active Volunteers</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our volunteers contribute through workshops, community events, and educational outreach.
            </p>
          </section>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">How to Get Involved</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join us as a volunteer! Contact us at [email] to learn more about opportunities.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}