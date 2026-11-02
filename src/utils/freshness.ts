/**
 * Rules for showing how old a live bus position is. A position older than
 * STALE_AFTER_SECONDS is shown as "Tertunda" and its arrival estimate is hidden.
 * The 2-minute limit is a proposal; tune it to how often operators send GPS data.
 */
export const STALE_AFTER_SECONDS = 120;

export function isStale(updatedSecondsAgo: number) {
  return updatedSecondsAgo > STALE_AFTER_SECONDS;
}

export function formatUpdated(seconds: number) {
  if (seconds < 60) return `Diperbarui ${seconds} detik lalu`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Diperbarui ${minutes} menit lalu`;
  return `Diperbarui ${Math.round(minutes / 60)} jam lalu`;
}

export function formatEta(minutes: number) {
  return minutes <= 1 ? 'Segera tiba' : `${minutes} menit`;
}
