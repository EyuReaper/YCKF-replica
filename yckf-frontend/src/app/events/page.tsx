import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Events() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 px-4 py-16 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 dark:text-gray-100">Our Events</h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Explore the upcoming and past events hosted by YCKF to promote cybersecurity education.
          </p>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Upcoming Events</h2>
            <p className="text-gray-600 dark:text-gray-400">
              - Cybersecurity Workshop: [Date] at [Location]<br />
              - Community Awareness Day: [Date] at [Location]
            </p>
          </section>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Past Events</h2>
            <p className="text-gray-600 dark:text-gray-400">
              - Annual Summit 2024: [Details]
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}