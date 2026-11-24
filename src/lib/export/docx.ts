import type { SavedResume } from '../types';
import { formatRange, sectionLabel, visibleSections } from '../templates/format';
import { downloadBlob, slugify } from '../utils';

/** DOCX export — single-column, recruiter-editable. The docx library is
 *  lazy-loaded so it never weighs down the main bundle. */
export async function exportDocx(resume: SavedResume): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');

  const { data, settings } = resume;
  const accent = settings.accentColor.replace('#', '');
  const children: InstanceType<typeof Paragraph>[] = [];

  const b = data.basics;
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: b.fullName || 'Resume', bold: true, size: 48 })],
    }),
  );
  if (b.headline) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: b.headline, color: accent, size: 24 })],
      }),
    );
  }
  const contact = [b.email, b.phone, b.location, b.website, ...b.links.map((l) => l.url)].filter(Boolean).join('  ·  ');
  if (contact) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: contact, size: 18, color: '555555' })],
        spacing: { after: 220 },
      }),
    );
  }

  const heading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, color: accent, size: 22 })],
    });

  const entryHead = (left: string, right: string) =>
    new Paragraph({
      spacing: { before: 120 },
      children: [
        new TextRun({ text: left, bold: true, size: 21 }),
        ...(right ? [new TextRun({ text: `   ${right}`, color: '666666', size: 18 })] : []),
      ],
    });

  const bullet = (text: string) =>
    new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 40 } });

  const body = (text: string) => new Paragraph({ children: [new TextRun({ text, size: 20 })] });

  for (const key of visibleSections(data, settings)) {
    children.push(heading(sectionLabel(key, data)));
    switch (key) {
      case 'summary':
        children.push(body(data.summary));
        break;
      case 'work':
        for (const w of data.work) {
          children.push(entryHead(`${w.role}${w.company ? ` · ${w.company}` : ''}`, [w.location, formatRange(w.startDate, w.endDate, w.current)].filter(Boolean).join(' — ')));
          for (const bl of w.bullets) if (bl.text.trim()) children.push(bullet(bl.text));
        }
        break;
      case 'projects':
        for (const p of data.projects) {
          children.push(entryHead(p.name, [p.tech.join(', '), p.url].filter(Boolean).join(' — ')));
          if (p.description.trim()) children.push(body(p.description));
          for (const bl of p.bullets) if (bl.text.trim()) children.push(bullet(bl.text));
        }
        break;
      case 'education':
        for (const e of data.education) {
          children.push(entryHead(`${e.degree}${e.area ? `, ${e.area}` : ''} · ${e.institution}`, formatRange(e.startDate, e.endDate, false)));
          if (e.note.trim()) children.push(body(e.note));
        }
        break;
      case 'skills':
        for (const g of data.skills) children.push(body(`${g.label ? `${g.label}: ` : ''}${g.items.join(', ')}`));
        break;
      case 'certifications':
        for (const c of data.certifications) children.push(bullet(`${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`));
        break;
      case 'languages':
        children.push(body(data.languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(' · ')));
        break;
      default: {
        const section = data.customSections.find((s) => `custom:${s.id}` === key);
        for (const entry of section?.entries ?? []) {
          if (entry.heading) children.push(entryHead(entry.heading, entry.sub));
          if (entry.body.trim()) children.push(body(entry.body));
          for (const bl of entry.bullets) if (bl.text.trim()) children.push(bullet(bl.text));
        }
      }
    }
  }

  const isA4 = settings.pageSize === 'a4';
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            // twips: 1in = 1440
            size: isA4 ? { width: 11906, height: 16838 } : { width: 12240, height: 15840 },
            margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${slugify(resume.name)}.docx`);
}
