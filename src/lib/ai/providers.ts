import type { AiSettings, ProviderDef, ProviderId } from './types';

export const PROVIDERS: Record<ProviderId, ProviderDef> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    keyPlaceholder: 'sk-ant-...',
    keyHelp: 'From console.anthropic.com → API Keys.',
    defaultModel: 'claude-sonnet-4-5',
    models: ['claude-sonnet-4-5', 'claude-haiku-4-5', 'claude-opus-4-1'],
    corsNote: 'Calls api.anthropic.com directly from your browser — officially supported for direct browser access.',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (GPT)',
    keyPlaceholder: 'sk-...',
    keyHelp: 'From platform.openai.com → API keys.',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
    corsNote: 'Calls api.openai.com directly from your browser. Some OpenAI accounts/networks block direct browser requests (CORS) — if generation fails immediately, try Anthropic or Google instead.',
  },
  google: {
    id: 'google',
    name: 'Google (Gemini)',
    keyPlaceholder: 'AIza...',
    keyHelp: 'From aistudio.google.com → Get API key.',
    defaultModel: 'gemini-3.8-flash',
    models: ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3-pro'],
    corsNote: 'Calls generativelanguage.googleapis.com directly from your browser — used by Google AI Studio itself, so browser calls are supported.',
  },
  custom: {
    id: 'custom',
    name: 'Custom (OpenAI-compatible)',
    keyPlaceholder: 'your API key (or leave blank if none)',
    keyHelp: 'Any server exposing an OpenAI-style /chat/completions endpoint — Groq, OpenRouter, Together, Mistral, a local Ollama/LM Studio server, etc.',
    defaultModel: '',
    models: [],
    needsBaseUrl: true,
    corsNote: 'The endpoint must allow cross-origin requests from this page (CORS). Most hosted OpenAI-compatible APIs do; a local server may need to be started with CORS enabled.',
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);

interface CallResult {
  text: string;
}

/** Sends one user prompt (+ optional system prompt) to whichever provider is
 *  configured and returns the plain-text reply. Every request goes straight
 *  from this browser to the provider's API — the key never passes through
 *  any server of ours (we don't have one; this app has no backend). */
export async function callAi(settings: AiSettings, system: string, user: string): Promise<CallResult> {
  if (!settings.apiKey && settings.provider !== 'custom') {
    throw new Error('No API key configured.');
  }

  let res: Response;
  try {
    switch (settings.provider) {
      case 'anthropic':
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': settings.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: settings.model || PROVIDERS.anthropic.defaultModel,
            max_tokens: 1024,
            system,
            messages: [{ role: 'user', content: user }],
          }),
        });
        break;

      case 'openai':
        res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${settings.apiKey}` },
          body: JSON.stringify({
            model: settings.model || PROVIDERS.openai.defaultModel,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        });
        break;

      case 'google': {
        const model = settings.model || PROVIDERS.google.defaultModel;
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(settings.apiKey)}`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents: [{ role: 'user', parts: [{ text: user }] }],
            }),
          },
        );
        break;
      }

      case 'custom': {
        const base = (settings.baseUrl || '').replace(/\/+$/, '');
        if (!base) throw new Error('Set an API base URL for the custom provider.');
        res = await fetch(`${base}/chat/completions`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(settings.apiKey ? { authorization: `Bearer ${settings.apiKey}` } : {}),
          },
          body: JSON.stringify({
            model: settings.model,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        });
        break;
      }
    }
  } catch {
    throw new Error(
      'Request failed before reaching the server — likely blocked by CORS or a network/ad-blocker issue. ' +
        (PROVIDERS[settings.provider]?.corsNote ?? ''),
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    let detail = body.slice(0, 200);
    try {
      const j = JSON.parse(body);
      detail = j.error?.message || j.message || detail;
    } catch {
      /* not JSON, use raw snippet */
    }
    throw new Error(`${settings.provider} API error (${res.status}): ${detail || 'request rejected'}`);
  }

  const json = await res.json();
  const text =
    settings.provider === 'anthropic'
      ? json.content?.[0]?.text
      : settings.provider === 'google'
        ? json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('')
        : json.choices?.[0]?.message?.content; // openai + custom (OpenAI-compatible)

  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('The model returned an empty response.');
  }
  return { text: text.trim() };
}
