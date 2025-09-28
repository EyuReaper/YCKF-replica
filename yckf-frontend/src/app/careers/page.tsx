import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Careers() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 px-4 py-16 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 dark:text-gray-100">Careers</h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Join the YCKF team and contribute to our mission of advancing cybersecurity. Explore current openings below.
          </p>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Current Openings</h2>
            <ul className="text-gray-600 list-disc list-inside dark:text-gray-400">
              <li>Cybersecurity Trainer - [Details]</li>
              <li>Community Outreach Coordinator - [Details]</li>
            </ul>
          </section>
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">How to Apply</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Send your resume to [email] with the job title in the subject line.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}