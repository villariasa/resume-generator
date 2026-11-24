import type { ResumeData } from '../types';
import type { TemplateSettings } from '../types';
import { formatRange, sectionLabel, visibleSections } from '../templates/format';

/** Plain-text rendering for ATS systems and paste-into-form situations. */
export function toPlainText(data: ResumeData, settings: TemplateSettings): string {
  const out: string[] = [];
  const b = data.basics;

  if (b.fullName) out.push(b.fullName.toUpperCase());
  if (b.headline) out.push(b.headline);
  const contact = [b.email, b.phone, b.location, b.website, ...b.links.map((l) => l.url)].filter(Boolean);
  if (contact.length) out.push(contact.join(' | '));
  out.push('');

  for (const key of visibleSections(data, settings)) {
    out.push(sectionLabel(key, data).toUpperCase());
    out.push('-'.repeat(24));
    switch (key) {
      case 'summary':
        out.push(data.summary);
        break;
      case 'work':
        for (const w of data.work) {
          out.push(`${w.role}${w.company ? ` — ${w.company}` : ''}${w.location ? `, ${w.location}` : ''}`);
          const range = formatRange(w.startDate, w.endDate, w.current);
          if (range) out.push(range);
          for (const bl of w.bullets) if (bl.text.trim()) out.push(`* ${bl.text}`);
          out.push('');
        }
        break;
      case 'projects':
        for (const p of data.projects) {
          out.push(`${p.name}${p.tech.length ? ` (${p.tech.join(', ')})` : ''}${p.url ? ` — ${p.url}` : ''}`);
          if (p.description.trim()) out.push(p.description);
          for (const bl of p.bullets) if (bl.text.trim()) out.push(`* ${bl.text}`);
          out.push('');
        }
        break;
      case 'education':
        for (const e of data.education) {
          out.push(`${e.degree}${e.area ? `, ${e.area}` : ''} — ${e.institution}`);
          const range = formatRange(e.startDate, e.endDate, false);
          if (range) out.push(range);
          if (e.note.trim()) out.push(e.note);
          out.push('');
        }
        break;
      case 'skills':
        for (const g of data.skills) out.push(`${g.label ? `${g.label}: ` : ''}${g.items.join(', ')}`);
        out.push('');
        break;
      case 'certifications':
        for (const c of data.certifications) out.push(`${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`);
        out.push('');
        break;
      case 'languages':
        out.push(data.languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(', '));
        out.push('');
        break;
      default: {
        const section = data.customSections.find((s) => `custom:${s.id}` === key);
        for (const entry of section?.entries ?? []) {
          if (entry.heading) out.push(`${entry.heading}${entry.sub ? ` — ${entry.sub}` : ''}`);
          if (entry.body.trim()) out.push(entry.body);
          for (const bl of entry.bullets) if (bl.text.trim()) out.push(`* ${bl.text}`);
          out.push('');
        }
      }
    }
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
