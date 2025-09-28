import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Team() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 px-4 py-16 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 dark:text-gray-100">Our Team</h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Meet the dedicated professionals at the Young Cyber Knights Foundation (YCKF) who drive our mission to empower cybersecurity excellence.
          </p>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Leadership</h2>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">John Doe</h3>
                <p className="text-gray-600 dark:text-gray-400">Founder & CEO</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Jane Smith</h3>
                <p className="text-gray-600 dark:text-gray-400">Lead Educator</p>
              </div>
            </div>
          </section>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Support Staff</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our support team ensures the smooth operation of our programs and initiatives.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}