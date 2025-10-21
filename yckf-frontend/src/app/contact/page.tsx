'use client'; // Mark as Client Component to use useTheme

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import { FaXTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa6';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

export default function Contact() {
  const { theme } = useTheme(); // Access the theme from context

  // Dynamic class based on theme
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const hoverBgClass = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-blue-800';

  return (
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16 mx-auto max-w-7xl">
          <h1 className={`mb-6 text-4xl font-extrabold ${textClass} tracking-tight`}>Contact Us</h1>
          <p className={`mb-10 text-lg ${subTextClass} max-w-2xl`}>
            We’d love to hear from you! Reach out to us with any questions or inquiries.
          </p>

          {/* Contact Form and Info */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Form Column */}
            <div className={`p-6 ${bgClass} rounded-lg shadow-md dark:${bgClass}`}>
              <h2 className={`mb-4 text-2xl font-bold ${textClass}`}>Send Us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block mb-1 text-sm font-medium ${subTextClass}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className={`w-full px-4 py-2 ${inputBgClass} ${borderClass} rounded-md ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block mb-1 text-sm font-medium ${subTextClass}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-2 ${inputBgClass} ${borderClass} rounded-md ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className={`block mb-1 text-sm font-medium ${subTextClass}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    className={`w-full px-4 py-2 ${inputBgClass} ${borderClass} rounded-md ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className={`block mb-1 text-sm font-medium ${subTextClass}`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    rows={4}
                    className={`w-full px-4 py-2 ${inputBgClass} ${borderClass} rounded-md ${inputTextClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full px-6 py-3 text-white bg-blue-600 rounded-md ${hoverBgClass} transition-colors duration-200`}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info & Map Column */}
            <div className={`p-6 ${bgClass} rounded-lg shadow-md dark:${bgClass}`}>
              <h2 className={`mb-4 text-2xl font-bold ${textClass}`}>Contact Information</h2>
              <div className="space-y-4">
                <p className={subTextClass}>
                  <span className={`font-medium ${textClass}`}>Address:</span> Akaki Beseka, Addis Ababa
                </p>
                <p className={subTextClass}>
                  <span className={`font-medium ${textClass}`}>Phone:</span> +251 0923940776
                </p>
                <p className={subTextClass}>
                  <span className={`font-medium ${textClass}`}>Email:</span> eyureaper@gmail.com
                </p>
              </div>
              <div className="mt-6">
                <h3 className={`mb-2 text-lg font-medium ${textClass}`}>Our Location</h3>
                <div className="w-full h-64 overflow-hidden rounded-lg">
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

          {/* Social Profiles */}
          <div className={`mt-10 p-6 ${bgClass} rounded-lg shadow-md dark:${bgClass}`}>
            <h2 className={`mb-4 text-2xl font-bold ${textClass}`}>Connect With Us</h2>
            <div className="flex space-x-6">
              <a
                href="https://x.com/YCKF_Official"
                target="_blank"
                rel="noopener noreferrer"
                className={`${subTextClass} hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200`}
              >
                <FaXTwitter size={24} />
                <span className="sr-only">X</span>
              </a>
              <a
                href="https://www.linkedin.com/company/yckf"
                target="_blank"
                rel="noopener noreferrer"
                className={`${subTextClass} hover:text-blue-700 dark:hover:text-blue-600 transition-colors duration-200`}
              >
                <FaLinkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/YCKF.Official"
                target="_blank"
                rel="noopener noreferrer"
                className={`${subTextClass} hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200`}
              >
                <FaFacebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}