/**
 * Sample bookings for eTiket Terminal (Terminal Online System, v1 screenshot 54).
 * v1 only showed the search form; the ticket fields here are a proposal. Operators
 * and booking codes are made up. Saved tickets live for the session only.
 */

import { useSyncExternalStore } from 'react';

export type Ticket = {
  code: string;
  passengers: string[];
  operator: string;
  busClass: string;
  from: string;
  to: string;
  /** "Minggu, 20 Des 2026" */
  date: string;
  departure: string;
  arrival: string;
  seats: string[];
  platform: string;
  checkedIn: boolean;
};

const tickets: Ticket[] = [
  {
    code: 'TOS7K2M9',
    passengers: ['Rina Wulandari', 'Budi Santoso'],
    operator: 'PO Contoh Jaya',
    busClass: 'Eksekutif',
    from: 'Terminal Pulo Gebang, Jakarta',
    to: 'Terminal Mangkang, Semarang',
    date: 'Minggu, 20 Des 2026',
    departure: '19.00',
    arrival: '03.30',
    seats: ['12A', '12B'],
    platform: 'Jalur 7',
    checkedIn: false,
  },
  {
    code: 'TOS4P8Q1',
    passengers: ['Rina Wulandari'],
    operator: 'PO Contoh Mataram',
    busClass: 'Bisnis',
    from: 'Terminal Mangkang, Semarang',
    to: 'Terminal Giwangan, Yogyakarta',
    date: 'Kamis, 24 Des 2026',
    departure: '07.30',
    arrival: '11.15',
    seats: ['5C'],
    platform: 'Jalur 3',
    checkedIn: true,
  },
];

/** Codes shown on the form so testers know what to type. */
export const sampleTicketQueries = tickets.map((t) => ({ code: t.code, name: t.passengers[0] }));

export function normalizeCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}

/** A booking matches when the code is exact and the name matches any passenger. */
export function findTicket(code: string, name: string) {
  const wanted = name.trim().toLowerCase();
  return tickets.find(
    (t) => t.code === normalizeCode(code) && t.passengers.some((p) => p.toLowerCase() === wanted),
  );
}

export function getTicket(code: string) {
  return tickets.find((t) => t.code === code);
}

let saved: string[] = [];
const listeners = new Set<() => void>();
const getSaved = () => saved;

export function useSavedTickets() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSaved,
    getSaved,
  );
}

export function saveTicket(code: string) {
  if (saved.includes(code)) return;
  saved = [code, ...saved];
  listeners.forEach((listener) => listener());
}
