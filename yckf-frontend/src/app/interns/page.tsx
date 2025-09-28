import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Interns() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 px-4 py-16 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 dark:text-gray-100">Our Interns</h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Discover the talented interns at YCKF who are shaping the future of cybersecurity through hands-on experience.
          </p>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Current Interns</h2>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Alex Johnson</h3>
                <p className="text-gray-600 dark:text-gray-400">Cybersecurity Analyst Intern</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Sarah Lee</h3>
                <p className="text-gray-600 dark:text-gray-400">Education Support Intern</p>
              </div>
            </div>
          </section>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Internship Program</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our internship program offers practical training and mentorship for aspiring cybersecurity professionals.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}