import type { ResumeData } from './types';
import { nanoid } from 'nanoid';

const b = (text: string) => ({ id: nanoid(8), text });

/** A complete, obviously-fictional example resume used by "Start from example"
 *  and as preview placeholder content. Never exported or printed. */
export function exampleResume(): ResumeData {
  return {
    basics: {
      fullName: 'Jordan Reyes',
      headline: 'Full-Stack Web Developer',
      email: 'jordan.reyes@example.com',
      phone: '+63 912 345 6789',
      location: 'Cebu City, Philippines',
      website: 'jordanreyes.example.com',
      links: [
        { id: nanoid(8), label: 'GitHub', url: 'github.com/jordanreyes' },
        { id: nanoid(8), label: 'LinkedIn', url: 'linkedin.com/in/jordanreyes' },
      ],
    },
    summary:
      'Full-stack developer with 4 years of experience shipping point-of-sale, inventory, and booking systems for small businesses. Comfortable owning features end to end — database design, REST APIs, and the UI staff actually use every day.',
    work: [
      {
        id: nanoid(8),
        company: 'Brightside Retail Co.',
        role: 'Full-Stack Developer',
        location: 'Remote',
        startDate: '2023',
        endDate: '',
        current: true,
        bullets: [
          b('Built a multi-location POS console used daily by 12 store staff, cutting checkout time by a third.'),
          b('Designed the inventory schema (weighted-average costing, barcode generation) and its REST API.'),
          b('Introduced automated DB backups and migration scripts, eliminating manual release steps.'),
        ],
      },
      {
        id: nanoid(8),
        company: 'Studio Lumen',
        role: 'Junior Web Developer',
        location: 'Cebu City',
        startDate: '2021',
        endDate: '2023',
        current: false,
        bullets: [
          b('Delivered 10+ client marketing sites with responsive layouts and CMS integration.'),
          b('Maintained a shared component library adopted across all client projects.'),
        ],
      },
    ],
    projects: [
      {
        id: nanoid(8),
        name: 'TableTab',
        url: 'github.com/jordanreyes/tabletab',
        description: 'Self-service restaurant ordering kiosk for tablets with offline LAN sync.',
        bullets: [b('FastAPI + SQLite backend; orders reach the kitchen even when the internet drops.')],
        tech: ['Svelte', 'FastAPI', 'SQLite'],
      },
      {
        id: nanoid(8),
        name: 'QuickReceipt',
        url: 'quickreceipt.example.com',
        description: 'Client-side invoice and thermal receipt generator — no accounts, no server.',
        bullets: [b('Print-accurate preview from A4 down to 58 mm thermal rolls; PDF export.')],
        tech: ['TypeScript', 'Tailwind CSS'],
      },
    ],
    education: [
      {
        id: nanoid(8),
        institution: 'University of San Carlos',
        degree: 'B.S. Information Systems',
        area: '',
        startDate: '2022',
        endDate: 'present',
        note: 'Completing degree alongside full-time development work.',
      },
    ],
    skills: [
      { id: nanoid(8), label: 'Languages', items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'SQL'] },
      { id: nanoid(8), label: 'Frameworks', items: ['Svelte', 'React', 'Node.js', 'Tailwind CSS'] },
      { id: nanoid(8), label: 'Databases & Tools', items: ['MySQL', 'PostgreSQL', 'Docker', 'Git'] },
    ],
    certifications: [
      { id: nanoid(8), name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2024' },
    ],
    languages: [
      { id: nanoid(8), name: 'English', level: 'Fluent' },
      { id: nanoid(8), name: 'Filipino', level: 'Native' },
    ],
    customSections: [],
  };
}
