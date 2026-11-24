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

/** Downscale + re-encode an uploaded photo client-side before storing it.
 *  Resumes only ever show a photo at a few hundred px, so there's no reason
 *  to keep a multi-MB phone photo in localStorage/JSON/share links — this
 *  keeps print/PDF quality identical while avoiding storage-quota failures
 *  and bloated exports. All work happens in the browser; nothing is uploaded
 *  anywhere. */
export function downscaleImage(file: File, maxDim = 640, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
