'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { BackendApi } from '@/lib/backend';
import { RiLoader2Fill } from 'react-icons/ri';
import TopBar from '@/components/TopBar';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // New: For auth guard/pre-fill

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

interface FormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  donationAmount: number;
  currency: 'GHS' | 'USD';
  donationTier: string;
  paymentMethod: 'card' | 'mobile_money';
}

// Helper component for the spinner fallback
const SpinnerFallback = () => (
  <div className="flex items-center justify-center py-8">
    <RiLoader2Fill className="w-12 h-12 text-gray-500 animate-spin dark:text-gray-400" />
  </div>
);

const MIN_GHS = 50;
const MAX_GHS = 100;
const EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest/USD'; // Free API for USD to GHS

// Exported for testing: Validate amount against GHS equivalent
export const isValidAmount = (donationAmount: number, currency: 'GHS' | 'USD', exchangeRate: number) => {
  if (donationAmount <= 0) {
    return { valid: false, message: 'Amount must be greater than 0.' };
  }

  const ghsEquivalent = currency === 'GHS' ? donationAmount : donationAmount * exchangeRate;
  if (ghsEquivalent < MIN_GHS) {
    return { 
      valid: false, 
      message: `Minimum donation is ${MIN_GHS} GHS (≈ ${(MIN_GHS / exchangeRate).toFixed(2)} USD).` 
    };
  }
  if (ghsEquivalent > MAX_GHS) {
    return { 
      valid: false, 
      message: `Maximum donation is ${MAX_GHS} GHS (≈ ${(MAX_GHS / exchangeRate).toFixed(2)} USD).` 
    };
  }
  return { valid: true };
};

export default function EnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const { requireLogin, user } = useAuth(); // New: Destructure from useAuth
  const [course, setCourse] = useState<PremiumTrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number>(12.40); // Fallback
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    donationAmount: MIN_GHS,
    currency: 'GHS',
    donationTier: '',
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course
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
        // Use suggested if within range, else min
        const suggested = Math.max(MIN_GHS, Math.min(MAX_GHS, courseData?.suggestedDonationAmount || MIN_GHS));
        setFormData(prev => ({
          ...prev,
          donationAmount: suggested,
          currency: 'GHS'
        }));

        // Fetch exchange rate
        try {
          const response = await fetch(EXCHANGE_API);
          const data = await response.json();
          setExchangeRate(data.rates.GHS || 12.40);
        } catch (err) {
          console.warn('Exchange rate fetch failed, using fallback');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  // New: useEffect for auth guard and pre-fill (per diff – add after the above useEffect)
  useEffect(() => {
    requireLogin(`/premium-training/${params.slug}/enroll`); // New: Guard/redirect if not logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        studentName: user.name,
        studentEmail: user.email
      })); // New: Pre-fill donor fields
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'donationAmount' ? parseFloat(value) || 0 : value
    }));
    if (error) setError(null);
  };

  const handleTierSelect = (tier: any) => {
    setFormData(prev => ({
      ...prev,
      donationAmount: tier.amount,
      donationTier: tier.name,
      currency: 'GHS' // Assume tiers in GHS
    }));
    setError(null);
  };

  // Validate amount against GHS equivalent
  const isValidAmount = () => {
    const { donationAmount, currency } = formData;
    if (donationAmount <= 0) {
      return { valid: false, message: 'Amount must be greater than 0.' };
    }

    const ghsEquivalent = currency === 'GHS' ? donationAmount : donationAmount * exchangeRate;
    if (ghsEquivalent < MIN_GHS) {
      return { 
        valid: false, 
        message: `Minimum donation is ${MIN_GHS} GHS (≈ ${(MIN_GHS / exchangeRate).toFixed(2)} USD).` 
      };
    }
    if (ghsEquivalent > MAX_GHS) {
      return { 
        valid: false, 
        message: `Maximum donation is ${MAX_GHS} GHS (≈ ${(MAX_GHS / exchangeRate).toFixed(2)} USD).` 
      };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setError(null);

    const validation = isValidAmount();
    if (!validation.valid) {
      setError(validation.message);
      setIsSubmitting(false);
      return;
    }

    if (formData.paymentMethod === 'mobile_money' && !formData.studentPhone) {
      setError('Phone number is required for mobile money payments.');
      setIsSubmitting(false);
      return;
    }

    try {
      const donor = { name: formData.studentName, email: formData.studentEmail };
      const enrollment = await BackendApi.donate({
        courseId: course?._id || '',
        amount: formData.donationAmount,
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        donor,
        ...(formData.paymentMethod === 'mobile_money' && { phone: formData.studentPhone }),
      });

      if (enrollment.success) {
        setSubmitMessage('Enrollment successful! Redirecting to course...');
        // Redirect to learn page
        setTimeout(() => router.push(`/premium-training/${params.slug}/learn`), 2000);
      } else {
        throw new Error(enrollment.message || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'There was an error processing your enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <TopBar/>
        <Header />
        <main className="flex items-center justify-center flex-1">
          <SpinnerFallback />
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || error) {
    return (
      <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <TopBar/>
        <Header />
        <main className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course not found</h1>
            <p className="text-gray-600 dark:text-gray-400">{error || "The course you're looking for doesn't exist or is no longer available."}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { donationAmount, currency } = formData;
  const ghsEquivalent = currency === 'GHS' ? donationAmount : donationAmount * exchangeRate;
  const usdEquivalent = currency === 'USD' ? donationAmount : donationAmount / exchangeRate;

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <TopBar/>
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl px-4 py-16 mx-auto">
          <div className="mb-8 text-center">
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
                  <span className="font-medium text-gray-900 capitalize dark:text-gray-100">{course.level}</span>
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
                <div className="p-4 mb-4 text-green-800 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                  {submitMessage}
                </div>
              )}
              {error && (
                <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="studentName" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label htmlFor="studentEmail" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label htmlFor="studentPhone" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number {formData.paymentMethod === 'mobile_money' ? '*' : ''}
                  </label>
                  <input
                    type="tel"
                    id="studentPhone"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleInputChange}
                    placeholder="e.g., +233 123 456 789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                {/* Donation Tiers - Optional, assume in GHS */}
                {course.donationTiers && course.donationTiers.length > 0 && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Choose Donation Tier (GHS)
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
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                            </div>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              GHS {tier.amount}+
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="donationAmount" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Donation Amount *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      id="donationAmount"
                      name="donationAmount"
                      value={formData.donationAmount}
                      onChange={handleInputChange}
                      min={currency === 'GHS' ? MIN_GHS : (MIN_GHS / exchangeRate).toFixed(2)}
                      max={currency === 'GHS' ? MAX_GHS : (MAX_GHS / exchangeRate).toFixed(2)}
                      step="0.01"
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      placeholder="Enter amount"
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {currency === 'GHS' ? `GHS ${ghsEquivalent.toFixed(2)} (≈ $${usdEquivalent.toFixed(2)})` : `USD $${usdEquivalent.toFixed(2)} (≈ GHS ${ghsEquivalent.toFixed(2)})`}
                    <br />
                    Minimum: {currency === 'GHS' ? `${MIN_GHS} GHS` : `≈ ${(MIN_GHS / exchangeRate).toFixed(2)} USD`} • Maximum: {currency === 'GHS' ? `${MAX_GHS} GHS` : `≈ ${(MAX_GHS / exchangeRate).toFixed(2)} USD`}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">Rate: 1 USD = {exchangeRate.toFixed(2)} GHS</p>
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    <option value="card">Visa/Mastercard (Stripe/Paystack/Flutterwave)</option>
                    <option value="mobile_money">MTN/Telecel Mobile Money</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValidAmount().valid}
                    className="w-full px-6 py-3 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RiLoader2Fill className="inline w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Enroll Now - ${currency} ${donationAmount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </form>

              <div className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900">
                <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">What happens next?</h3>
                <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
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