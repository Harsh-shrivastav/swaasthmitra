// Server-side GenAI client wrapper
// Usage: set environment variable GENAI_API_KEY and use from a secure server context.

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GENAI_API_KEY;

if (!apiKey) {
  // Do not throw here to allow static analysis tools to run in dev without the key,
  // but runtime calls will fail with a clear error.
  console.warn('GENAI_API_KEY not set. Set process.env.GENAI_API_KEY to use the GenAI client.');
}

export function createGenAIClient() {
  if (!apiKey) {
    throw new Error('GENAI_API_KEY is not configured');
  }

  return new GoogleGenAI({ apiKey });
}

// Example helper: generate content streaming (async iterator consumption)
export async function generateContent(model: string, contents: Array<any>, config?: any) {
  const client = createGenAIClient();

  const response = await client.models.generateContentStream({
    model,
    config: config || {},
    contents,
  });

  let out = '';
  for await (const chunk of response) {
    if (chunk.text) out += chunk.text;
  }

  return out;
}

// IMPORTANT: Keep this file server-only. Never expose your API key to browser code.
