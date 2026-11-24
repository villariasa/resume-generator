import type { SavedResume } from '../types';
import { migrateResume } from '../storage';
import { downloadBlob, slugify } from '../utils';

export function exportJson(resume: SavedResume): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${slugify(resume.name)}.resume.json`);
}

export async function importJsonFile(file: File): Promise<SavedResume | null> {
  try {
    const raw = JSON.parse(await file.text());
    const migrated = migrateResume(raw);
    if (!migrated) return null;
    // Imported resumes get a fresh id so they never clobber an existing one.
    return { ...migrated, id: crypto.randomUUID() };
  } catch {
    return null;
  }
}
