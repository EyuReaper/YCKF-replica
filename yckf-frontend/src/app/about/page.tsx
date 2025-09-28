import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Image on Right */}
        <section className="relative py-20 bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center max-w-5xl gap-8 px-4 mx-auto md:flex-row-reverse">
            <img
              src="/blackman_pointing3.jpg" // Replace with your screenshot URL or uploaded image
              alt="YCKF Overview"
              className="object-cover w-full h-64 rounded-lg shadow-md md:w-1/3"
            />
            <div className="text-center md:text-left">
              <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-gray-100">About Us</h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-600 md:mx-0 dark:text-gray-400">
                Welcome to the Young Cyber Knights Foundation (YCKF), a nonprofit dedicated to fostering cybersecurity excellence and empowering the next generation of professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are, Our Mission, and Our Vision Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Who We Are</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Young Cyber Knights is an initiative aimed at nurturing the next generation of cybersecurity professionals. This program focuses on providing young individuals with foundational knowledge and practical skills in the field of cybersecurity through engaging, educational activities and hands-on experiences.
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Mission</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Our core mission is to bridge the growing skills gap in cybersecurity by targeting high school and college students, encouraging their interest in the field early on. The program offers a variety of resources including workshops, training sessions, and competitions designed to teach participants about the principles of cybersecurity, including threat identification, network security, and ethical hacking.
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Vision</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              We envision a future where everyone can participate safely in the digital world, protected from threats and empowered with the skills to succeed.
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Story</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Born out of the increasing need for cybersecurity awareness and digital safety, our foundation started as a grassroots initiative and quickly grew into a nationwide movement. What began with a few school workshops has evolved into a series of impactful campaigns, training programs, and collaborations with key stakeholders.
            </p>
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our Core Values</h2>
            <ul className="space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
              <li>Education First: We believe that awareness is the first step toward empowerment.</li>
              <li>Inclusivity: Everyone deserves access to digital safety knowledge, regardless of background.</li>
              <li>Collaboration: We work with governments, institutions, and tech leaders to broaden our reach.</li>
              <li>Transparency: We operate with honesty, openness, and accountability.</li>
              <li>Community-Driven: Our programs are designed with and for the people they serve.</li>
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
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="/black_woman1.jpg" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"The workshops and training were essential to my understanding of cybersecurity. I now feel equipped to handle potential threats."</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Jane Smith</h3>
                    <p className="text-gray-600 dark:text-gray-400">IT Professional</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"As a business owner, I feel more confident about my company's online security. Thanks to the foundation's workshops!"</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">John Doe</h3>
                    <p className="text-gray-600 dark:text-gray-400">Tech Entrepreneur</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"The community-driven approach is what makes this foundation stand out. I gained so much insight into securing my online presence."</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Emily Davies</h3>
                    <p className="text-gray-600 dark:text-gray-400">Security Analyst</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"This foundation helped me understand cybersecurity from the ground up. The training sessions were insightful and practical!"</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Kwame Adamu</h3>
                    <p className="text-gray-600 dark:text-gray-400">CEO, Adamu Group of Companies</p>
                  </div>
                </div>
                {/* Duplicate content for seamless looping */}
                <div className="inline-flex items-center px-6 space-x-8">
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"The workshops and training were essential to my understanding of cybersecurity. I now feel equipped to handle potential threats."</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Jane Smith</h3>
                    <p className="text-gray-600 dark:text-gray-400">IT Professional</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"As a business owner, I feel more confident about my company's online security. Thanks to the foundation's workshops!"</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">John Doe</h3>
                    <p className="text-gray-600 dark:text-gray-400">Tech Entrepreneur</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"The community-driven approach is what makes this foundation stand out. I gained so much insight into securing my online presence."</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Emily Davies</h3>
                    <p className="text-gray-600 dark:text-gray-400">Security Analyst</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
                    <img
                      src="https://via.placeholder.com/50" // Placeholder round icon - replace with your image
                      alt="Quote Icon"
                      className="object-cover w-12 h-12 mb-2 rounded-full"
                    />
                    <p className="mb-4 text-base italic leading-tight text-gray-600 dark:text-gray-400">"This foundation helped me understand cybersecurity from the ground up. The training sessions were insightful and practical!"</p>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Kwame Adamu</h3>
                    <p className="text-gray-600 dark:text-gray-400">CEO, Adamu Group of Companies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Our History</h2>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Founded in 2015, YCKF started as a small initiative to address the growing need for cybersecurity education. Over the decade, we’ve grown into a recognized leader, with milestones including:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
              <li>First workshop in 2016, training 50 participants.</li>
              <li>Community training launch in 2019, reaching 500+ individuals.</li>
              <li>Annual Summit debut in 2023, featuring global experts.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}