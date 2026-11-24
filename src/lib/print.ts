const PORTAL_ID = 'print-portal-root';

/** Print (or "print to PDF") the live resume page reliably.
 *
 *  The editor's preview lives inside a scrollable, zoomed, absolutely-
 *  positioned structure (needed for on-screen zoom + page-break guides).
 *  That combination — `overflow: auto` + `position: absolute` escape tricks —
 *  is a well-known Chromium print gotcha: it can render correctly in the
 *  live DOM and even under `@media print` screenshots, yet Chromium's actual
 *  paginated print/PDF pass renders a blank page, because fragmentation
 *  doesn't reliably include absolutely-positioned content whose containing
 *  block sits inside a scrollable ancestor.
 *
 *  The fix: clone the resume page into a plain, unconstrained node appended
 *  directly to <body> (no overflow/position ancestors at all), hide
 *  everything else during print via `display: none` (not `visibility`, so
 *  nothing retains layout/clipping footprint), print, then clean up. */
export function printResume(sourceId = 'print-root'): void {
  const source = document.getElementById(sourceId);
  if (!source) {
    window.print();
    return;
  }

  const existing = document.getElementById(PORTAL_ID);
  existing?.remove();

  const portal = document.createElement('div');
  portal.id = PORTAL_ID;
  portal.appendChild(source.cloneNode(true));
  document.body.appendChild(portal);

  const cleanup = () => {
    portal.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  // Safety net: not every browser/print-to-PDF flow fires `afterprint`.
  const fallback = setTimeout(cleanup, 60_000);
  window.addEventListener('afterprint', () => clearTimeout(fallback), { once: true });

  window.print();
}
