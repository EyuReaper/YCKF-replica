import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'je36hluy', 
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-10-01',
  useCdn: process.env.NODE_ENV === 'production', // Enable CDN in production
});