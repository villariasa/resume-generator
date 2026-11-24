import { SCHEMA_VERSION, defaultSettings, emptyResumeData } from './types';
import type { CustomTemplate, ResumeIndexEntry, SavedResume } from './types';

const INDEX_KEY = 'rg:index';
const TEMPLATES_KEY = 'rg:templates';
const LAST_OPEN_KEY = 'rg:last-open';
const resumeKey = (id: string) => `rg:resume:${id}`;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Upgrade any older/foreign payload to the current schema. Also used by
 *  JSON import and share-link decode, so it must tolerate junk. */
export function migrateResume(raw: unknown): SavedResume | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<SavedResume> & Record<string, unknown>;
  if (!r.data || typeof r.data !== 'object') return null;

  const base: SavedResume = {
    id: typeof r.id === 'string' ? r.id : crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    name: typeof r.name === 'string' && r.name ? r.name : 'Untitled resume',
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString(),
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : new Date().toISOString(),
    data: { ...emptyResumeData(), ...(r.data as object) },
    settings: { ...defaultSettings(), ...((r.settings as object) ?? {}) },
  };

  // Future schema bumps switch on (r.schemaVersion ?? 1) here.
  return base;
}

export function listResumes(): ResumeIndexEntry[] {
  return read<ResumeIndexEntry[]>(INDEX_KEY) ?? [];
}

export function loadResume(id: string): SavedResume | null {
  const raw = read<unknown>(resumeKey(id));
  return raw ? migrateResume(raw) : null;
}

export function saveResume(resume: SavedResume): void {
  resume.updatedAt = new Date().toISOString();
  write(resumeKey(resume.id), resume);
  const index = listResumes().filter((e) => e.id !== resume.id);
  index.unshift({
    id: resume.id,
    name: resume.name,
    updatedAt: resume.updatedAt,
    templateId: resume.settings.templateId,
  });
  write(INDEX_KEY, index);
}

export function deleteResume(id: string): void {
  localStorage.removeItem(resumeKey(id));
  write(INDEX_KEY, listResumes().filter((e) => e.id !== id));
  if (getLastOpenId() === id) localStorage.removeItem(LAST_OPEN_KEY);
}

export function getLastOpenId(): string | null {
  return localStorage.getItem(LAST_OPEN_KEY);
}

export function setLastOpenId(id: string): void {
  localStorage.setItem(LAST_OPEN_KEY, id);
}

export function listCustomTemplates(): CustomTemplate[] {
  return read<CustomTemplate[]>(TEMPLATES_KEY) ?? [];
}

export function saveCustomTemplate(tpl: CustomTemplate): void {
  const all = listCustomTemplates().filter((t) => t.id !== tpl.id);
  all.unshift(tpl);
  write(TEMPLATES_KEY, all);
}

export function deleteCustomTemplate(id: string): void {
  write(TEMPLATES_KEY, listCustomTemplates().filter((t) => t.id !== id));
}
