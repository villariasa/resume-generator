import type { Component } from 'svelte';
import type { ResumeData, TemplateSettings } from '../types';
import { defaultSettings } from '../types';
import { listCustomTemplates } from '../storage';
import Classic from './Classic.svelte';
import Meridian from './Meridian.svelte';
import Dossier from './Dossier.svelte';
import Compact from './Compact.svelte';
import Vivid from './Vivid.svelte';

export type TemplateComponent = Component<{ data: ResumeData; settings: TemplateSettings }>;

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  component: TemplateComponent;
  defaults: TemplateSettings;
  supportsColumns: boolean;
  atsSafe: boolean;
}

export const BUILTIN_TEMPLATES: TemplateDef[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'ATS-safe single column with a centered header and hairline rules. The safe pick for corporate applications.',
    component: Classic as TemplateComponent,
    defaults: { ...defaultSettings('classic'), accentColor: '#1f2937' },
    supportsColumns: false,
    atsSafe: true,
  },
  {
    id: 'meridian',
    name: 'Meridian',
    description: 'Modern two-column with a tinted sidebar for contact, skills, and languages. Polished but still professional.',
    component: Meridian as TemplateComponent,
    defaults: { ...defaultSettings('meridian'), accentColor: '#1d4ed8', columns: 2 },
    supportsColumns: true,
    atsSafe: false,
  },
  {
    id: 'dossier',
    name: 'Dossier',
    description: 'Editorial serif with small-caps labels and generous whitespace. Distinctive without being loud.',
    component: Dossier as TemplateComponent,
    defaults: { ...defaultSettings('dossier'), accentColor: '#7c3aed', fontPairing: 'lora-inter' },
    supportsColumns: false,
    atsSafe: true,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense one-pager with tight spacing and inline dates — fits a long history on a single page.',
    component: Compact as TemplateComponent,
    defaults: { ...defaultSettings('compact'), accentColor: '#0f766e', density: 'compact' },
    supportsColumns: false,
    atsSafe: true,
  },
  {
    id: 'vivid',
    name: 'Vivid',
    description: 'Bold accent header band with timeline dots and photo support — made for freelance client work.',
    component: Vivid as TemplateComponent,
    defaults: { ...defaultSettings('vivid'), accentColor: '#db2777', fontPairing: 'space-grotesk', columns: 2 },
    supportsColumns: true,
    atsSafe: false,
  },
];

export function getBuiltin(id: string): TemplateDef | undefined {
  return BUILTIN_TEMPLATES.find((t) => t.id === id);
}

/** Resolve a settings object to a concrete template component. `custom:<id>`
 *  ids resolve to the custom template's base component; the resume's own
 *  settings (already copied from the custom template on apply) win. */
export function resolveTemplate(settings: TemplateSettings): { def: TemplateDef; settings: TemplateSettings } {
  if (settings.templateId.startsWith('custom:')) {
    const customId = settings.templateId.slice('custom:'.length);
    const custom = listCustomTemplates().find((t) => t.id === customId);
    const def = (custom && getBuiltin(custom.baseTemplateId)) ?? BUILTIN_TEMPLATES[0];
    return { def, settings };
  }
  const def = getBuiltin(settings.templateId) ?? BUILTIN_TEMPLATES[0];
  return { def, settings };
}
