
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production', // Cache in prod, real-time in dev
});

export { sanity };