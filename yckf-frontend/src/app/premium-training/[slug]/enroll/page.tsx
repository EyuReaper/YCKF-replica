'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import { BackendApi } from '@/lib/backend';
import { RiLoader2Fill } from 'react-icons/ri';
import TopBar from '@/components/TopBar';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

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
const SpinnerFallback = () => {
  const { theme } = useTheme();
  const textClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="flex items-center justify-center py-8">
      <RiLoader2Fill className={`w-12 h-12 ${textClass} animate-spin`} />
    </div>
  );
};

const MIN_GHS = 50;
const MAX_GHS = 100;
const EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

// Exported for testing: Validate amount against GHS equivalent
export const isValidAmount = (donationAmount: number, currency: 'GHS' | 'USD', exchangeRate: number) => {
  if (donationAmount <= 0) {
    return { valid: false, message: 'Amount must be greater than 0.' };
  }

  const ghsEquivalent = currency === 'GHS' ? donationAmount : donationAmount * exchangeRate;
  if (ghsEquivalent < MIN_GHS) {
    return { valid: false, message: `Minimum donation is ${MIN_GHS} GHS (≈ ${(MIN_GHS / exchangeRate).toFixed(2)} USD).` };
  }
  if (ghsEquivalent > MAX_GHS) {
    return { valid: false, message: `Maximum donation is ${MAX_GHS} GHS (≈ ${(MAX_GHS / exchangeRate).toFixed(2)} USD).` };
  }
  return { valid: true };
};

export default function EnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const { requireLogin, user } = useAuth();
  const { theme } = useTheme(); // Access the theme from context

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
    paymentMethod: 'card',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Dynamic classes based on theme
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputTextClass = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const labelTextClass = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const buttonBgClass = theme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const buttonHoverClass = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-blue-800';
  const successBgClass = theme === 'light' ? 'bg-green-100' : 'bg-green-900';
  const successTextClass = theme === 'light' ? 'text-green-800' : 'text-green-200';
  const errorBgClass = theme === 'light' ? 'bg-red-100' : 'bg-red-900';
  const errorTextClass = theme === 'light' ? 'text-red-800' : 'text-red-200';

  useEffect(() => {
    async function fetchData() {
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
        const suggested = Math.max(MIN_GHS, Math.min(MAX_GHS, courseData?.suggestedDonationAmount || MIN_GHS));
        setFormData((prev) => ({
          ...prev,
          donationAmount: suggested,
          currency: 'GHS',
        }));

        const response = await fetch(EXCHANGE_API);
        const data = await response.json();
        setExchangeRate(data.rates.GHS || 12.40);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  useEffect(() => {
    requireLogin(`/premium-training/${params.slug}/enroll`);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        studentName: user.name,
        studentEmail: user.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'donationAmount' ? parseFloat(value) || 0 : value,
    }));
    if (error) setError(null);
  };

  const handleTierSelect = (tier: any) => {
    setFormData((prev) => ({
      ...prev,
      donationAmount: tier.amount,
      donationTier: tier.name,
      currency: 'GHS',
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setError(null);

    const validation = isValidAmount(formData.donationAmount, formData.currency, exchangeRate);
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
      <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
        <TopBar />
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
      <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
        <TopBar />
        <Header />
        <main className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className={`text-2xl font-bold ${textClass}`}>Course not found</h1>
            <p className={subTextClass}>{error || "The course you're looking for doesn't exist or is no longer available."}</p>
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
    <div className={`flex flex-col min-h-screen ${textClass} ${bgClass} dark:${bgClass} dark:${textClass}`}>
      <TopBar />
      <Header />
      <main className="flex-1">
        <div className={`max-w-4xl px-4 py-16 mx-auto ${bgClass}`}>
          <div className="mb-8 text-center">
            <h1 className={`mb-4 text-3xl font-bold ${textClass}`}>Enroll in Course</h1>
            <p className={`text-lg ${subTextClass}`}>
              Complete your enrollment for <strong>{course.title}</strong>
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Course Summary */}
            <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
              <h2 className={`mb-4 text-xl font-semibold ${textClass}`}>Course Summary</h2>
              {course.image?.asset && (
                <img
                  src={course.image.asset.url}
                  alt={course.title}
                  className="object-cover w-full h-48 mb-4 rounded-lg"
                />
              )}
              <h3 className={`mb-2 text-lg font-semibold ${textClass}`}>{course.title}</h3>
              <p className={`mb-4 ${subTextClass}`}>{course.shortDescription}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={subTextClass}>Instructor:</span>
                  <span className={textClass}>{course.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className={subTextClass}>Duration:</span>
                  <span className={textClass}>{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className={subTextClass}>Level:</span>
                  <span className={textClass}>{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className={subTextClass}>Enrollment Deadline:</span>
                  <span className={textClass}>{new Date(course.enrollmentDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Form */}
            <div className={`p-6 ${cardBgClass} rounded-lg shadow-md`}>
              <h2 className={`mb-4 text-xl font-semibold ${textClass}`}>Enrollment Form</h2>

              {submitMessage && (
                <div className={`p-4 mb-4 ${successBgClass} rounded-lg`}>
                  <p className={successTextClass}>{submitMessage}</p>
                </div>
              )}
              {error && (
                <div className={`p-4 mb-4 ${errorBgClass} rounded-lg`}>
                  <p className={errorTextClass}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="studentName" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${borderClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass} ${inputTextClass}`}
                  />
                </div>

                <div>
                  <label htmlFor="studentEmail" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="studentEmail"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${borderClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass} ${inputTextClass}`}
                  />
                </div>

                <div>
                  <label htmlFor="studentPhone" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                    Phone Number {formData.paymentMethod === 'mobile_money' ? '*' : ''}
                  </label>
                  <input
                    type="tel"
                    id="studentPhone"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleInputChange}
                    placeholder="e.g., +233 123 456 789"
                    className={`w-full px-3 py-2 ${borderClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass} ${inputTextClass}`}
                  />
                </div>

                {course.donationTiers && course.donationTiers.length > 0 && (
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${labelTextClass}`}>
                      Choose Donation Tier (GHS)
                    </label>
                    <div className="space-y-2">
                      {course.donationTiers.map((tier, index) => (
                        <div
                          key={index}
                          className={`p-3 ${borderClass} rounded-lg cursor-pointer transition-colors ${
                            formData.donationTier === tier.name
                              ? `${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-blue-900 bg-blue-900'}`
                              : `${borderClass} ${theme === 'light' ? 'hover:border-gray-400' : 'hover:border-gray-500'}`
                          }`}
                          onClick={() => handleTierSelect(tier)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={textClass}>{tier.name}</h4>
                              <p className={subTextClass}>{tier.description}</p>
                            </div>
                            <span className={`text-lg font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                              GHS {tier.amount}+
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="donationAmount" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
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
                      className={`flex-1 px-3 py-2 ${borderClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass} ${inputTextClass}`}
                      placeholder="Enter amount"
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className={`px-3 py-2 ${borderClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass} ${inputTextClass}`}
                    >
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <p className={`mt-1 text-xs ${subTextClass}`}>
                    {currency === 'GHS' ? `GHS ${ghsEquivalent.toFixed(2)} (≈ $${usdEquivalent.toFixed(2)})` : `USD $${usdEquivalent.toFixed(2)} (≈ GHS ${ghsEquivalent.toFixed(2)})`}
                    <br />
                    Minimum: {currency === 'GHS' ? `${MIN_GHS} GHS` : `≈ ${(MIN_GHS / exchangeRate).toFixed(2)} USD`} • Maximum: {currency === 'GHS' ? `${MAX_GHS} GHS` : `≈ ${(MAX_GHS / exchangeRate).toFixed(2)} USD`}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">Rate: 1 USD = {exchangeRate.toFixed(2)} GHS</p>
                </div>

                <div>
                  <label htmlFor="paymentMethod" className={`block mb-1 text-sm font-medium ${labelTextClass}`}>
                    Payment Method *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${borderClass} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass} ${inputTextClass}`}
                  >
                    <option value="card">Visa/Mastercard (Stripe/Paystack/Flutterwave)</option>
                    <option value="mobile_money">MTN/Telecel Mobile Money</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValidAmount(formData.donationAmount, formData.currency, exchangeRate).valid}
                    className={`w-full px-6 py-3 text-white transition-colors duration-200 ${buttonBgClass} rounded-lg ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
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

              <div className={`p-4 mt-6 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
                <h3 className={`mb-2 text-sm font-semibold ${theme === 'light' ? 'text-blue-900' : 'text-blue-100'}`}>What happens next?</h3>
                <ul className={`space-y-1 text-xs ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
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