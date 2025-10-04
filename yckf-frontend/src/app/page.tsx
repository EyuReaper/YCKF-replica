import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ContentBlock from '@/components/ContentBlock';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <HeroSection />
      <ContentBlock
        title="YCKF in Brief"
        subtitle="Young Cyber Knights Foundation"
        content="A nonprofit organization dedicated to nurturing the next generation of cybersecurity professionals through educational activities and hands-on experiences."
        sections={[{ image: "/pexels-nilo.jpg" }]}
      />
      <ContentBlock
        title="Who We Are"
        content="We are a nonprofit foundation committed to empowering individuals and organizations with the tools and knowledge needed to stay safe online. We believe cybersecurity is a right—not a privilege."
        sections={[
          { title: "What We Do", content: "From community training and school outreach to policy advocacy and research, our initiatives raise awareness and build strong digital defenses for everyone." },
          { title: "Our Approach", content: "We collaborate with industry leaders, educational institutions, and local communities to make cybersecurity accessible, engaging, and effective." },
        ]}
      >
        <div className="mt-8 text-center">
          <a href="/about" className="inline-block px-6 py-3 font-medium text-gray-800 transition-colors duration-200 bg-white rounded-md dark:text-gray-900 dark:bg-gray-200 hover:bg-blue-500 dark:hover:bg-blue-400 active:bg-blue-700 dark:active:bg-blue-600">
            Learn More About Us
          </a>
        </div>
      </ContentBlock>
      <ContentBlock
        title="What We Do"
        content="Our foundation is dedicated to building a safer digital future through the following core focus areas:"
        sections={[
          {
            title: "Cybersecurity Education",
            content: "We collaborate with industry leaders, educational institutions, and local communities to make cybersecurity accessible, engaging, and effective.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-blue-600 lucide lucide-book-open dark:text-blue-400"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>,
          },
          {
            title: "Public Awareness Campaigns",
            content: "Campaigns to raise national and local awareness about online threats and how to stay protected.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-yellow-600 lucide lucide-megaphone dark:text-yellow-400"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/></svg>,
          },
          {
            title: "Policy Advocacy",
            content: "Engaging with lawmakers and institutions to shape policies that prioritize cybersecurity and digital rights.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-green-600 lucide lucide-shield-check dark:text-green-400"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
          },
          {
            title: "Youth Programs & Outreach",
            content: "Equipping young people with the knowledge to safely navigate the digital world through fun and practical activities.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-purple-600 lucide lucide-school dark:text-purple-400"><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M18 5v16"/><path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6"/><path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11"/><path d="M6 5v16"/><circle cx="12" cy="9" r="2"/></svg>,
          },
          {
            title: "Community Training",
            content: "Collaborating with communities to deliver hands-on training, particularly to underserved and at-risk groups..",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-pink-600 lucide lucide-users dark:text-pink-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>,
          },
        ]}
      />
      <ContentBlock
        title="Our Mission & Vision"
        content="Driving cybersecurity awareness, innovation, and resilience for all."
        sections={[
          { title: "Our Mission", content: "Our mission is to empower individuals, businesses, and communities with the knowledge, tools, and support needed to stay safe and secure in an increasingly digital world. We advocate for inclusive cybersecurity education, promote responsible digital citizenship, and provide accessible resources to protect against evolving online threats." },
          { title: "Our Vision", content: "We envision a world where everyone has the confidence and capability to navigate the digital landscape securely. A world where cybersecurity is not a privilege but a shared responsibility and foundational right—fostering trust, innovation, and resilience in our global community." },
        ]}
      />
      <ContentBlock
        title="Our Impact in Numbers"
        content="Here are some key metrics showcasing our impact."
        stats={[
          { label: "Individuals Trained", value: "200+" },
          { label: "Workshops Conducted", value: "8+" },
          { label: "Communities Reached", value: "4+" },
        ]}
      />
      <TestimonialSection />
      <Footer />
    </div>
  );
}