import type { Density, FontPairing, PageSize } from '../types';

export const FONT_PAIRINGS: Record<FontPairing, { label: string; heading: string; body: string }> = {
  inter: {
    label: 'Inter — clean sans',
    heading: "'Inter', ui-sans-serif, system-ui, sans-serif",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  'source-serif': {
    label: 'Source Serif — classic headings',
    heading: "'Source Serif 4', Georgia, 'Times New Roman', serif",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  'ibm-plex': {
    label: 'IBM Plex Mono — technical',
    heading: "'IBM Plex Mono', ui-monospace, 'Cascadia Mono', monospace",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  'lora-inter': {
    label: 'Lora — editorial serif',
    heading: "'Lora', Georgia, serif",
    body: "'Lora', Georgia, serif",
  },
  'space-grotesk': {
    label: 'Space Grotesk — modern display',
    heading: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
};

export const DENSITY_FACTOR: Record<Density, number> = {
  compact: 0.72,
  normal: 1,
  relaxed: 1.28,
};

export const DENSITY_FONT_SIZE: Record<Density, string> = {
  compact: '9.2pt',
  normal: '10pt',
  relaxed: '10.6pt',
};

export const PAGE_DIMENSIONS: Record<PageSize, { width: string; height: string; css: string }> = {
  a4: { width: '210mm', height: '297mm', css: 'A4' },
  letter: { width: '8.5in', height: '11in', css: 'letter' },
};
