import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { SCHEMA_VERSION } from './types';
import type { ResumeData, TemplateSettings } from './types';
import { migrateResume } from './storage';

interface SharePayload {
  v: number;
  data: ResumeData;
  settings: TemplateSettings;
  name?: string;
}

export function encodeShareUrl(data: ResumeData, settings: TemplateSettings, name?: string): string {
  const payload: SharePayload = { v: SCHEMA_VERSION, data, settings, name };
  const fragment = compressToEncodedURIComponent(JSON.stringify(payload));
  return `${location.origin}${location.pathname}#R=${fragment}`;
}

export function decodeShareFragment(hash: string): SharePayload | null {
  if (!hash.startsWith('#R=')) return null;
  try {
    const json = decompressFromEncodedURIComponent(hash.slice(3));
    if (!json) return null;
    const raw = JSON.parse(json) as Partial<SharePayload>;
    if (!raw.data || !raw.settings) return null;
    // Run through the same migration path as storage/import for safety.
    const migrated = migrateResume({ data: raw.data, settings: raw.settings, name: raw.name });
    if (!migrated) return null;
    return { v: SCHEMA_VERSION, data: migrated.data, settings: migrated.settings, name: migrated.name };
  } catch {
    return null;
  }
}
