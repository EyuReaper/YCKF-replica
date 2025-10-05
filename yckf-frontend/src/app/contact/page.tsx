import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Contact Us</h1>
          <p className="mb-10 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            We’d love to hear from you! Reach out to us with any questions or inquiries.
          </p>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form Column */}
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Send Us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    rows={4}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info & Map Column */}
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Contact Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Address:</span> akaki' beseka, Addis Ababa
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Phone:</span> +251 0923940776
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span> eyureaper@gmail.com
                </p>
              </div>
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">Our Location</h3>
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3942.117483088044!2d38.787211000000006!3d8.868654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwNTInMDcuMiJOIDM4wrA0NycxNC4wIkU!5e0!3m2!1sen!2set!4v1759547227870!5m2!1sen!2set"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                    title="Google Maps Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}