import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | undefined;

/**
 * Creates the Gemini client only when a server-side AI feature is invoked.
 * Delaying this check keeps a missing key from failing an unrelated page build.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Add it to frontend/.env.local and restart the server.");
  }

  client ??= new GoogleGenAI({ apiKey });
  return client;
}
