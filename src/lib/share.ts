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

/** Share links never include the photo: it's by far the largest part of the
 *  payload (a URL fragment isn't the place for a multi-KB image), and it's
 *  personal data the sender may not intend to hand out via a shareable link. */
export function encodeShareUrl(data: ResumeData, settings: TemplateSettings, name?: string): string {
  const { photoDataUrl: _photoDataUrl, ...basicsNoPhoto } = data.basics;
  const payload: SharePayload = { v: SCHEMA_VERSION, data: { ...data, basics: basicsNoPhoto }, settings, name };
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
