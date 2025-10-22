
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production', // Fixed: Conditional CDN (cache in prod, real-time in dev)
});
export default sanity;