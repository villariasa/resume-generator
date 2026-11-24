import { nanoid } from 'nanoid';

export const uid = () => nanoid(8);

/** Move item at `from` to position `to` (in place). */
export function move<T>(arr: T[], from: number, to: number): void {
  if (from === to || from < 0 || from >= arr.length) return;
  const clamped = Math.max(0, Math.min(arr.length - 1, to));
  const [item] = arr.splice(from, 1);
  arr.splice(clamped, 0, item);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function slugify(name: string): string {
  return (name || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'resume';
}
