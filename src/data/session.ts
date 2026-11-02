/**
 * Signed-in state for the prototype. Nothing is checked or stored: any filled-in
 * form signs in, and passwords are never kept. Replace with the account API.
 */

import { useSyncExternalStore } from 'react';

let signedIn = true;
const listeners = new Set<() => void>();
const getSignedIn = () => signedIn;

export function useSignedIn() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSignedIn,
    getSignedIn,
  );
}

function setSignedIn(value: boolean) {
  signedIn = value;
  listeners.forEach((listener) => listener());
}

export const signIn = () => setSignedIn(true);
export const signOut = () => setSignedIn(false);
