
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function getExchangeRate(from: string, to: string = 'GHS'): Promise<number> {
  const key = `${from}-${to}`;
  let rate = cache.get<number>(key);
  if (!rate) {
    try {
      const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
      rate = res.data.rates[to];
      if (!rate) throw new Error(`Invalid currency pair: ${from} to ${to}`);
      cache.set(key, rate);
    } catch (error) {
      console.error('Exchange rate fetch failed:', error);
      throw new Error('Unable to fetch exchange rate');
    }
  }
  return rate;
}