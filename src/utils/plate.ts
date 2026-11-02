/** "h7191oq" becomes "H 7191 OQ": region letters, number, then suffix letters. */
export function formatPlate(raw: string) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = clean.match(/^([A-Z]{1,2})(\d{0,4})([A-Z]{0,3})/);
  if (!match) return clean.slice(0, 9);
  return [match[1], match[2], match[3]].filter(Boolean).join(' ');
}

/** A complete plate: region letters and a number; suffix letters are optional. */
export function isCompletePlate(plate: string) {
  return /^[A-Z]{1,2} \d{1,4}( [A-Z]{1,3})?$/.test(plate);
}
