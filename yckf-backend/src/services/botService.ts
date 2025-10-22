import { sanity } from './../lib/sanity.js';
// src/services/botService.ts

import { groq } from 'next-sanity';
import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog.js';
import NodeCache from 'node-cache';

//  Simple in-memory rate limiter (5 queries/hour per user)
const rateLimiter = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

//  Fuzzy search via GROQ for FAQ match
export const getFAQMatch = async (query: string, category?: string) => {
  const faqQuery = groq`*[
    _type == "faq" && 
    (category == $category || !defined($category)) && 
    score(title + " " + answer, $query) > 0.3
  ] | order(score(title + " " + answer, $query) desc)[0...1]{
    _id,
    title,
    answer,
    category,
    "score": score(title + " " + answer, $query)
  }`;

  const params = { query, category };
  const faq = await sanityClient.fetch(faqQuery, params); //  using correct Sanity client
  return faq[0] || null;
};

//  Rate limit check
async function checkRateLimit(
  userId: string,
  channel: 'whatsapp' | 'telegram'
): Promise<boolean> {
  const key = `${userId}-${channel}`;
  const count = rateLimiter.get<number>(key) || 0;
  if (count >= 5) return false; // Block after 5/hour
  rateLimiter.set(key, count + 1);
  return true;
}

//  Process bot message
export async function processBotMessage(
  query: string,
  userId: string,
  channel: 'whatsapp' | 'telegram'
): Promise<string> {
  try {
    // 1️⃣ Rate limit check
    const allowed = await checkRateLimit(userId, channel);
    if (!allowed) return 'Rate limit exceeded. Try again in 1 hour.';

    // 2️⃣ Match FAQ
    const match = await getFAQMatch(query);
    const response = match
      ? `**${match.title}**\n\n${match.answer}\n\nFor more, visit [YCKF Courses](https://yckf.org/premium-training).`
      : "Sorry, I couldn't find that. Common FAQs: What is phishing? Reply with your question or contact support@yckf.org.";

    // 3️⃣ Log successful interaction
    await logBotInteraction(userId, channel, query, response, match?._id);

    return response;
  } catch (error: any) {
    console.error('Bot service error:', error);
    await logBotInteraction(
      userId,
      channel,
      query,
      'N/A',
      undefined,
      'failed',
      error.message
    );
    return 'Sorry, something went wrong. Please try again.';
  }
}

//  Log bot interaction
export const logBotInteraction = async (
  userId: string | null,
  channel: 'whatsapp' | 'telegram',
  query: string,
  response: string,
  matchedFAQId?: string,
  status: 'success' | 'failed' | 'pending' = 'success',
  error?: string
) => {
  await AuditLog.create({
    action: 'bot_query',
    entityType: 'bot',
    userId: userId ? new mongoose.Types.ObjectId(userId) : null,
    channel,
    query,
    response,
    matchedFAQId,
    status,
    ...(error && { details: { error } }), 
  });
};
