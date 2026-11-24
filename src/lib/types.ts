export const SCHEMA_VERSION = 1;

export interface ProfileLink {
  id: string;
  label: string; // e.g. "GitHub", "LinkedIn", "Portfolio"
  url: string;
}

export interface Bullet {
  id: string;
  text: string;
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // free text: "2022", "Jan 2022"
  endDate: string;
  current: boolean;
  bullets: Bullet[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  url: string;
  description: string;
  bullets: Bullet[];
  tech: string[];
}

export interface EduEntry {
  id: string;
  institution: string;
  degree: string;
  area: string;
  startDate: string;
  endDate: string;
  note: string;
}

export interface SkillGroup {
  id: string;
  label: string; // e.g. "Languages", "Frameworks"
  items: string[];
}

export interface CertEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  level: string; // e.g. "Native", "Fluent", "B2"
}

export interface CustomSectionEntry {
  id: string;
  heading: string;
  sub: string;
  body: string;
  bullets: Bullet[];
}

export interface CustomSection {
  id: string;
  title: string;
  entries: CustomSectionEntry[];
}

export interface ResumeData {
  basics: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    links: ProfileLink[];
    photoDataUrl?: string;
  };
  summary: string;
  work: WorkEntry[];
  projects: ProjectEntry[];
  education: EduEntry[];
  skills: SkillGroup[];
  certifications: CertEntry[];
  languages: LanguageEntry[];
  customSections: CustomSection[];
}

export type SectionKey =
  | 'summary'
  | 'work'
  | 'projects'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'languages'
  | `custom:${string}`;

export type FontPairing = 'inter' | 'source-serif' | 'ibm-plex' | 'lora-inter' | 'space-grotesk';
export type Density = 'compact' | 'normal' | 'relaxed';
export type PageSize = 'a4' | 'letter';

export interface TemplateSettings {
  templateId: string; // built-in id or 'custom:<id>'
  accentColor: string;
  fontPairing: FontPairing;
  density: Density;
  pageSize: PageSize;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  columns: 1 | 2;
  sidebarSections: SectionKey[];
  // Render the uploaded photo on templates. Off by default makes sense for
  // US/ATS submissions; on is the norm in PH/Asia/EU.
  showPhoto: boolean;
}

export interface SavedResume {
  id: string;
  schemaVersion: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
  settings: TemplateSettings;
}

export interface CustomTemplate {
  id: string;
  schemaVersion: number;
  name: string;
  baseTemplateId: string;
  settings: Omit<TemplateSettings, 'templateId'>;
  createdAt: string;
}

export interface ResumeIndexEntry {
  id: string;
  name: string;
  updatedAt: string;
  templateId: string;
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'work',
  'projects',
  'education',
  'skills',
  'certifications',
  'languages',
];

export function defaultSettings(templateId = 'classic'): TemplateSettings {
  return {
    templateId,
    accentColor: '#1d4ed8',
    fontPairing: 'inter',
    density: 'normal',
    pageSize: 'a4',
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    hiddenSections: [],
    columns: 1,
    sidebarSections: ['skills', 'languages', 'certifications'],
    showPhoto: true,
  };
}

export function emptyResumeData(): ResumeData {
  return {
    basics: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      links: [],
    },
    summary: '',
    work: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}
