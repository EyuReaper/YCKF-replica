'use client';

import { useState } from 'react';

interface DonationTier {
  name: string;
  amount: number;
  description: string;
  benefits: string[];
}

interface DonationSystemProps {
  courseId: string;
  courseTitle: string;
  minDonationAmount: number;
  maxDonationAmount: number;
  suggestedDonationAmount: number;
  donationTiers?: DonationTier[];
  onDonationComplete?: (donationData: any) => void;
}

export default function DonationSystem({
  courseId,
  courseTitle,
  minDonationAmount,
  maxDonationAmount,
  suggestedDonationAmount,
  donationTiers = [],
  onDonationComplete
}: DonationSystemProps) {
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [customAmount, setCustomAmount] = useState(suggestedDonationAmount);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    anonymous: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleTierSelect = (tier: DonationTier) => {
    setSelectedTier(tier);
    setCustomAmount(tier.amount);
  };

  const handleCustomAmountChange = (amount: number) => {
    setCustomAmount(amount);
    setSelectedTier(null);
  };

  const handleDonorInfoChange = (field: string, value: string | boolean) => {
    setDonorInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDonation = async () => {
    if (customAmount < minDonationAmount || customAmount > maxDonationAmount) {
      setMessage('Please enter a valid donation amount within the specified range.');
      return;
    }

    if (!donorInfo.name || !donorInfo.email) {
      setMessage('Please provide your name and email address.');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      // In a real application, you would integrate with a payment processor like Stripe, PayPal, etc.
      const donationData = {
        courseId,
        courseTitle,
        amount: customAmount,
        tier: selectedTier?.name || 'Custom',
        donorInfo,
        timestamp: new Date().toISOString()
      };

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically:
      // 1. Process payment through payment gateway
      // 2. Create enrollment record in Sanity
      // 3. Send confirmation email
      // 4. Redirect to course access

      setMessage('Donation successful! You will receive a confirmation email shortly.');
      
      if (onDonationComplete) {
        onDonationComplete(donationData);
      }

      // Reset form
      setDonorInfo({
        name: '',
        email: '',
        phone: '',
        anonymous: false
      });
      setCustomAmount(suggestedDonationAmount);
      setSelectedTier(null);

    } catch (error) {
      setMessage('There was an error processing your donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Support Our Mission
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Your donation helps us provide free cybersecurity training to underserved communities while giving you access to premium content.
      </p>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.includes('successful') 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Donation Tiers */}
      {donationTiers.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
            Choose a Donation Tier
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {donationTiers.map((tier, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTier?.name === tier.name
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
                onClick={() => handleTierSelect(tier)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h5>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${tier.amount}+
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tier.description}</p>
                {tier.benefits.length > 0 && (
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Amount */}
      <div className="mb-6">
        <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
          Or Enter Custom Amount
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-400">$</span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(parseFloat(e.target.value) || 0)}
            min={minDonationAmount}
            max={maxDonationAmount}
            step="0.01"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Minimum: ${minDonationAmount} • Maximum: ${maxDonationAmount}
        </p>
      </div>

      {/* Donor Information */}
      <div className="mb-6">
        <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
          Your Information
        </h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name *"
            value={donorInfo.name}
            onChange={(e) => handleDonorInfoChange('name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <input
            type="email"
            placeholder="Email Address *"
            value={donorInfo.email}
            onChange={(e) => handleDonorInfoChange('email', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={donorInfo.phone}
            onChange={(e) => handleDonorInfoChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={donorInfo.anonymous}
              onChange={(e) => handleDonorInfoChange('anonymous', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Make this donation anonymous
            </span>
          </label>
        </div>
      </div>

      {/* Donation Button */}
      <button
        onClick={handleDonation}
        disabled={isProcessing}
        className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isProcessing ? 'Processing...' : `Donate $${customAmount}`}
      </button>

      {/* Benefits Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900">
        <h5 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
          What you get with your donation:
        </h5>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Full access to {courseTitle}</li>
          <li>• Instructor support and Q&A sessions</li>
          <li>• Downloadable course materials</li>
          <li>• Certificate of completion</li>
          <li>• Supporting free training for underserved communities</li>
        </ul>
      </div>
    </div>
  );
}
