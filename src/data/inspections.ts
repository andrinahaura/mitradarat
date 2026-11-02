/**
 * Sample inspection results for Cek Laik. v1's result page was never captured,
 * so the fields here (status, inspection date, validity, checklist) are a proposal
 * to match against the inspection data Ditjen Hubdat actually has.
 */

export type InspectionStatus = 'laik' | 'tidak-laik' | 'kedaluwarsa';

export type InspectionCheck = {
  item: string;
  passed: boolean;
  note?: string;
};

export type Inspection = {
  plate: string;
  vehicle: string;
  operator: string;
  status: InspectionStatus;
  inspectedAt: string;
  location: string;
  validUntil: string;
  checks: InspectionCheck[];
};

const allPassed = (items: string[]): InspectionCheck[] => items.map((item) => ({ item, passed: true }));

const CHECK_ITEMS = [
  'Rem utama dan rem parkir',
  'Lampu utama dan lampu sein',
  'Kondisi ban',
  'Pintu dan jendela darurat',
  'Alat pemecah kaca',
  'Alat pemadam api ringan (APAR)',
  'Sabuk keselamatan pengemudi',
];

const inspections: Inspection[] = [
  {
    plate: 'H 7191 OQ',
    vehicle: 'Bus pariwisata',
    operator: 'PO Contoh Wisata',
    status: 'laik',
    inspectedAt: '23 Okt 2026',
    location: 'Terminal Mangkang, Semarang',
    validUntil: '23 Apr 2027',
    checks: allPassed(CHECK_ITEMS),
  },
  {
    plate: 'B 7012 TGA',
    vehicle: 'Bus pariwisata',
    operator: 'PO Contoh Trans',
    status: 'tidak-laik',
    inspectedAt: '15 Okt 2026',
    location: 'Terminal Pulo Gebang, Jakarta',
    validUntil: '-',
    checks: [
      ...allPassed(CHECK_ITEMS.slice(0, 2)),
      { item: 'Kondisi ban', passed: false, note: 'Ban depan kiri aus melewati batas.' },
      ...allPassed(CHECK_ITEMS.slice(3, 5)),
      { item: 'Alat pemadam api ringan (APAR)', passed: false, note: 'APAR sudah kedaluwarsa.' },
      ...allPassed(CHECK_ITEMS.slice(6)),
    ],
  },
  {
    plate: 'AB 7123 XY',
    vehicle: 'Bus AKAP',
    operator: 'PO Contoh Mataram',
    status: 'kedaluwarsa',
    inspectedAt: '2 Mar 2026',
    location: 'Terminal Giwangan, Yogyakarta',
    validUntil: '2 Sep 2026',
    checks: allPassed(CHECK_ITEMS),
  },
];

/** Plates the prototype can answer, shown on the form so testers know what to type. */
export const samplePlates = inspections.map((inspection) => inspection.plate);

export function findInspection(plate: string) {
  return inspections.find((inspection) => inspection.plate === plate);
}
