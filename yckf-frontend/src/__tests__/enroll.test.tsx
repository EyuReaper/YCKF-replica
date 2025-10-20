// src/__tests__/enroll.test.tsx 

import { isValidAmount } from '@/app/premium-training/[slug]/enroll/page'; 

// Mock exchange rate if needed for tests
const mockExchangeRate = 12.40;

describe('Enrollment Validation', () => {
 test('validates GHS min/max', () => {
 // Below min
     // FIX: Separated amount (40) and currency ('GHS') arguments
 expect(isValidAmount(40, 'GHS', mockExchangeRate)).toEqual({ 
     valid: false, 
     message: expect.stringContaining('Minimum') 
});
    // Valid
    // FIX: Separated amount (75) and currency ('GHS') arguments
    expect(isValidAmount(75, 'GHS', mockExchangeRate)).toEqual({ valid: true });
    // Above max
    // FIX: Separated amount (110) and currency ('GHS') arguments
     expect(isValidAmount(110, 'GHS', mockExchangeRate)).toEqual({ 
     valid: false, 
     message: expect.stringContaining('Maximum') 
 });
 });

 test('validates USD equivalent', () => {
    // Below min equiv 
    // FIX: Separated amount (3) and currency ('USD') arguments
    expect(isValidAmount(3, 'USD', mockExchangeRate)).toEqual({ 
     valid: false, 
     message: expect.stringContaining('Minimum') 
 });
    // Valid equiv 
    // FIX: Separated amount (5) and currency ('USD') arguments
     expect(isValidAmount(5, 'USD', mockExchangeRate)).toEqual({ valid: true });
 });

 test('handles invalid amount (zero/negative)', () => {
    // FIX: Separated amount (0) and currency ('GHS') arguments
    expect(isValidAmount(0, 'GHS', mockExchangeRate)).toEqual({ 
     valid: false, 
    message: 'Amount must be greater than 0.' 
 });
 });
});