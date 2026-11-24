import { callAi } from './providers';
import type { AiSettings } from './types';

const RESUME_VOICE =
  'You write resume content: concrete, achievement-focused, no fluff, no first-person "I" where a resume convention omits it, no markdown formatting, no emojis.';

export async function aiSummary(settings: AiSettings, about: string, signal?: AbortSignal): Promise<string> {
  const { text } = await callAi(
    settings,
    `${RESUME_VOICE} Write a resume summary: 2-3 sentences, no more. Reply with ONLY the summary text — no preamble, no quotes.`,
    `Write a resume summary for this person based on what they told me about themselves:\n\n${about}`,
    signal,
  );
  return text.replace(/^["']|["']$/g, '');
}

export async function aiSkills(settings: AiSettings, about: string, signal?: AbortSignal): Promise<string[]> {
  const { text } = await callAi(
    settings,
    `${RESUME_VOICE} Reply with ONLY a comma-separated list of 6-14 relevant skills/technologies — no numbering, no categories, no extra text.`,
    `Suggest resume skills for this person based on what they told me:\n\n${about}`,
    signal,
  );
  return text
    .split(/[,\n]/)
    .map((s) => s.replace(/^[-*\d.\s]+/, '').trim())
    .filter(Boolean);
}

export async function aiBullets(
  settings: AiSettings,
  context: string,
  rawNotes: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const { text } = await callAi(
    settings,
    `${RESUME_VOICE} Reply with ONLY 3-5 bullet points, one per line, no leading dashes/bullets/numbers — just the sentence.`,
    `Role/project context: ${context}\n\nRough notes on what they did (turn this into strong resume bullets, quantify where plausible, don't invent numbers that aren't implied):\n\n${rawNotes}`,
    signal,
  );
  return text
    .split('\n')
    .map((l) => l.replace(/^[-*•\d.\s]+/, '').trim())
    .filter(Boolean);
}
