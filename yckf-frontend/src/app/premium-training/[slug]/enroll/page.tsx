'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { RiLoader2Fill } from 'react-icons/ri';
import TopBar from '@/components/TopBar';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Define interface for Sanity data
interface PremiumTrainingData {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  image?: { asset: { url: string } } | null;
  donationTiers: Array<{
    name: string;
    amount: number;
    description: string;
    benefits: string[];
  }>;
  minDonationAmount: number;
  maxDonationAmount: number;
  suggestedDonationAmount: number;
  enrollmentDeadline: string;
  maxStudents: number;
  slug: { current: string };
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

export default function EnrollmentPage() {
  const params = useParams();
  const [course, setCourse] = useState<PremiumTrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    donationAmount: 0,
    donationTier: '',
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    async function fetchCourse() {
      try {
        const query = `*[_type == "premiumTraining" && slug.current == $slug && isActive == true][0] {
          _id,
          title,
          description,
          shortDescription,
          instructor,
          duration,
          level,
          category,
          image {
            asset->{
              url
            }
          },
          donationTiers,
          minDonationAmount,
          maxDonationAmount,
          suggestedDonationAmount,
          enrollmentDeadline,
          maxStudents,
          slug
        }`;
        
        const courseData = await client.fetch(query, { slug: params.slug });
        setCourse(courseData);
        setFormData(prev => ({
          ...prev,
          donationAmount: courseData?.suggestedDonationAmount || 0
        }));
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [params.slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'donationAmount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTierSelect = (tier: any) => {
    setFormData(prev => ({
      ...prev,
      donationAmount: tier.amount,
      donationTier: tier.name
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // In a real application, you would:
      // 1. Process payment through a payment gateway
      // 2. Create enrollment record in Sanity
      // 3. Send confirmation email
      // 4. Redirect to course or dashboard

      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('Enrollment successful! You will receive a confirmation email shortly.');
      
      // Reset form
      setFormData({
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        donationAmount: course?.suggestedDonationAmount || 0,
        donationTier: '',
        paymentMethod: 'card'
      });
    } catch (error) {
      setSubmitMessage('There was an error processing your enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <TopBar/>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <SpinnerFallback />
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <TopBar/>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course not found</h1>
            <p className="text-gray-600 dark:text-gray-400">The course you're looking for doesn't exist or is no longer available.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        <div className="px-4 py-16 mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Enroll in Course</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Complete your enrollment for <strong>{course.title}</strong>
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Course Summary */}
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Course Summary</h2>
              {course.image?.asset && (
                <img
                  src={course.image.asset.url}
                  alt={course.title}
                  className="object-cover w-full h-48 mb-4 rounded-lg"
                />
              )}
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{course.title}</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{course.shortDescription}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Instructor:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{course.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Level:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Enrollment Deadline:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(course.enrollmentDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrollment Form */}
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Enrollment Form</h2>
              
              {submitMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitMessage.includes('successful') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="studentEmail"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="studentPhone"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                {/* Donation Tiers */}
                {course.donationTiers && course.donationTiers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Choose Donation Tier
                    </label>
                    <div className="space-y-2">
                      {course.donationTiers.map((tier, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.donationTier === tier.name
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                          onClick={() => handleTierSelect(tier)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                            </div>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              ${tier.amount}+
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Donation Amount ($) *
                  </label>
                  <input
                    type="number"
                    id="donationAmount"
                    name="donationAmount"
                    value={formData.donationAmount}
                    onChange={handleInputChange}
                    min={course.minDonationAmount}
                    max={course.maxDonationAmount}
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum: ${course.minDonationAmount} • Maximum: ${course.maxDonationAmount}
                  </p>
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? 'Processing...' : `Enroll Now - $${formData.donationAmount}`}
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900">
                <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">What happens next?</h3>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• You'll receive a confirmation email with course access details</li>
                  <li>• Course materials will be available in your student dashboard</li>
                  <li>• You'll get instructor support throughout the course</li>
                  <li>• Earn a certificate upon successful completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
