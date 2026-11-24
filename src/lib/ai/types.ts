export type ProviderId = 'anthropic' | 'openai' | 'google' | 'custom';

export interface AiSettings {
  provider: ProviderId;
  apiKey: string;
  model: string;
  // Only used by 'custom' — any OpenAI-compatible chat completions endpoint
  // (Groq, OpenRouter, Together, Mistral, a local Ollama/LM Studio server…).
  baseUrl?: string;
}

export interface ProviderDef {
  id: ProviderId;
  name: string;
  keyPlaceholder: string;
  keyHelp: string;
  defaultModel: string;
  models: string[];
  needsBaseUrl?: boolean;
  corsNote: string;
}
