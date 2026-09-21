import { useCallback, useState } from 'react';

const KEY = 'janmakundali:guest-mode';

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

function write(value: boolean) {
  try {
    if (value) localStorage.setItem(KEY, 'true');
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Tracks whether the visitor chose to use the app anonymously.
 * Persisted so returning guests skip the landing page.
 */
export function useGuestMode() {
  const [isGuest, setIsGuest] = useState<boolean>(() => read());

  const enterGuestMode = useCallback(() => {
    write(true);
    setIsGuest(true);
  }, []);

  const exitGuestMode = useCallback(() => {
    write(false);
    setIsGuest(false);
  }, []);

  return { isGuest, enterGuestMode, exitGuestMode };
}