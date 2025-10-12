// src/services/exchangeRateService.ts

import axios from 'axios';
import NodeCache from 'node-cache';
import { auditLog } from '../lib/audit.js'; // From lib for logging

const cache = new NodeCache({ stdTTL: 3600 }); // 1hr TTL

export async function getExchangeRate(from: string, to: string = 'GHS', userId?: string): Promise<number> {
  const key = `${from}-${to}`;
  let rate = cache.get<number>(key);
  
  if (!rate) {
    try {
      const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
      rate = res.data.rates[to];
      if (!rate) throw new Error(`Invalid currency pair: ${from} to ${to}`);
      
      cache.set(key, rate);
      console.log(`💱 Cached rate ${from} to ${to}: ${rate}`);
      
      // Audit log (optional, if user-triggered)
      if (userId) {
        await auditLog({
          action: 'exchange_rate_fetch',
          entityType: 'system',
          userId,
          details: { from, to, rate },
          status: 'success',
        });
      }
    } catch (error: any) {
      console.error('Exchange rate fetch failed:', error);
      await auditLog({
        action: 'exchange_rate_fetch',
        entityType: 'system',
        userId: userId || 'system',
        details: { from, to, error: error.message },
        status: 'failed',
      });
      throw new Error(`Unable to fetch rate for ${from} to ${to}: ${error.message}`);
    }
  }
  
  return rate;
}