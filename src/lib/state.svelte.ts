import type { SavedResume, TemplateSettings, ResumeData } from './types';
import { defaultSettings, emptyResumeData, SCHEMA_VERSION } from './types';
import { saveResume, setLastOpenId } from './storage';

export type View = 'gallery' | 'editor' | 'viewer';

interface SharedPayload {
  data: ResumeData;
  settings: TemplateSettings;
}

export const app = $state({
  view: 'gallery' as View,
  current: null as SavedResume | null,
  shared: null as SharedPayload | null,
  saveState: 'saved' as 'saved' | 'saving',
  zoom: 0.8,
  customizerOpen: false,
  // mobile: which pane is visible under lg breakpoint
  mobileTab: 'form' as 'form' | 'preview',
});

export function newResume(templateId: string, data?: ResumeData, settings?: TemplateSettings, name?: string): SavedResume {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    name: name ?? 'Untitled resume',
    createdAt: now,
    updatedAt: now,
    data: data ?? emptyResumeData(),
    settings: settings ?? defaultSettings(templateId),
  };
}

export function openResume(resume: SavedResume): void {
  app.current = resume;
  app.view = 'editor';
  app.mobileTab = 'form';
  setLastOpenId(resume.id);
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;

/** Debounced autosave — call from an $effect watching the current resume. */
export function scheduleSave(): void {
  if (!app.current) return;
  app.saveState = 'saving';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (app.current) {
      saveResume($state.snapshot(app.current) as SavedResume);
      app.saveState = 'saved';
    }
  }, 500);
}

export function flushSave(): void {
  clearTimeout(saveTimer);
  if (app.current) {
    saveResume($state.snapshot(app.current) as SavedResume);
    app.saveState = 'saved';
  }
}
