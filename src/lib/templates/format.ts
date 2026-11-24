import type { ResumeData, SectionKey, TemplateSettings } from '../types';

export function formatRange(start: string, end: string, current: boolean): string {
  const from = start.trim();
  const to = current ? 'Present' : end.trim();
  if (!from && !to) return '';
  if (!from) return to;
  if (!to) return from;
  return `${from} — ${to}`;
}

/** Does a section have any content worth rendering? */
export function sectionHasContent(key: SectionKey, data: ResumeData): boolean {
  switch (key) {
    case 'summary':
      return data.summary.trim().length > 0;
    case 'work':
      return data.work.length > 0;
    case 'projects':
      return data.projects.length > 0;
    case 'education':
      return data.education.length > 0;
    case 'skills':
      return data.skills.length > 0;
    case 'certifications':
      return data.certifications.length > 0;
    case 'languages':
      return data.languages.length > 0;
    default: {
      const id = key.slice('custom:'.length);
      const section = data.customSections.find((s) => s.id === id);
      return !!section && section.entries.length > 0;
    }
  }
}

export function customSectionTitle(key: SectionKey, data: ResumeData): string {
  const id = key.slice('custom:'.length);
  return data.customSections.find((s) => s.id === id)?.title ?? '';
}

/** Visible, content-bearing sections in display order. */
export function visibleSections(data: ResumeData, settings: TemplateSettings): SectionKey[] {
  // Custom sections not yet in sectionOrder get appended automatically.
  const known = new Set(settings.sectionOrder);
  const extras = data.customSections
    .map((s) => `custom:${s.id}` as SectionKey)
    .filter((k) => !known.has(k));
  return [...settings.sectionOrder, ...extras].filter(
    (k) => !settings.hiddenSections.includes(k) && sectionHasContent(k, data),
  );
}

export const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary',
  work: 'Experience',
  projects: 'Projects',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
};

export function sectionLabel(key: SectionKey, data: ResumeData): string {
  return key.startsWith('custom:') ? customSectionTitle(key, data) : (SECTION_LABELS[key] ?? key);
}
