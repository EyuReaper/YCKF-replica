
import Fuse from 'fuse.js'; // npm i fuse.js
import { sanity } from '../lib/sanity.js'; // From lib
import { AuditLog } from '../models/AuditLog.js'; // From models (updated for bots)
import NodeCache from 'node-cache'; // For rate limiting

const cache = new NodeCache({ stdTTL: 3600 }); // Cache FAQs for 1h
const rateLimiter = new NodeCache({ stdTTL: 3600 }); // 1 query/hour per user

// Fetch and cache FAQs from Sanity
let faqs: any[] = [];
async function loadFAQs(): Promise<void> {
  faqs = await sanity.fetch(`*[_type == "faq"] { title, answer, category }`);
  cache.set('faqs', faqs);
}

// Fuzzy search for FAQ match
function findFAQ(query: string): { answer: string; title: string } | null {
  if (!faqs.length) return null;
  const fuse = new Fuse(faqs, {
    keys: ['title', 'answer'],
    threshold: 0.4, // Loose match
  });
  const result = fuse.search(query)[0];
  return result ? { answer: result.item.answer, title: result.item.title } : null;
}

// Rate limit check (5 queries/hour per user/channel)
async function checkRateLimit(userId: string, channel: 'whatsapp' | 'telegram'): Promise<boolean> {
  const key = `${userId}-${channel}`;
  const count = rateLimiter.get<number>(key) || 0;
  if (count >= 5) return false; // Blocked
  rateLimiter.set(key, count + 1);
  return true;
}

export async function processBotMessage(query: string, userId: string, channel: 'whatsapp' | 'telegram'): Promise<string> {
  try {
    // Load FAQs if not cached
    if (!cache.get('faqs')) await loadFAQs();

    // Rate limit
    const allowed = await checkRateLimit(userId, channel);
    if (!allowed) return 'Rate limit exceeded. Try again in 1 hour.';

    // Match FAQ
    const match = findFAQ(query);
    const response = match 
      ? `**${match.title}**\n\n${match.answer}\n\nFor more, visit [YCKF Courses](https://yckf.org/premium-training).` 
      : "Sorry, I couldn't find that. Common FAQs: What is phishing? Reply with your question or contact support@yckf.org.";

    // Log interaction
    await new AuditLog({
      action: 'bot_interaction',
      entityType: 'bot',
      userId,
      details: { channel, query, response },
      status: 'success',
    }).save();

    return response;
  } catch (error: any) {
    console.error('Bot service error:', error);
    await new AuditLog({
      action: 'bot_interaction',
      entityType: 'bot',
      userId,
      details: { channel, query: 'N/A', error: error.message },
      status: 'failed',
    }).save();
    return 'Sorry, something went wrong. Please try again.';
  }
}