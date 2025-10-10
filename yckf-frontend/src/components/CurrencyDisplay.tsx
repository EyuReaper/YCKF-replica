// src/components/CurrencyDisplay.tsx – New reusable component for dual-currency display

'use client';

import { useState, useEffect } from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency?: 'GHS' | 'USD';
  showEquivalent?: boolean;
}

export default function CurrencyDisplay({ 
  amount, 
  currency = 'GHS', 
  showEquivalent = false 
}: CurrencyDisplayProps) {
  const [exchangeRate, setExchangeRate] = useState<number>(12.40); // Fallback USD to GHS rate

  useEffect(() => {
    // Fetch latest USD to GHS rate (runs once on mount)
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates && data.rates.GHS) {
          setExchangeRate(data.rates.GHS);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch exchange rate:', err);
      });
  }, []);

  const equivalentAmount = currency === 'GHS' 
    ? amount / exchangeRate 
    : amount * exchangeRate;

  const equivalentCurrency = currency === 'GHS' ? 'USD' : 'GHS';

  return (
    <span className="inline-flex items-baseline gap-1">
      {currency} {amount.toFixed(2)}
      {showEquivalent && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          (≈ {equivalentCurrency} {equivalentAmount.toFixed(2)})
        </span>
      )}
    </span>
  );
}