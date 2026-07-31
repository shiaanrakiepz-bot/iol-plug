"use client";

import { useCallback, useEffect, useState } from "react";

type Setter<T> = (value: T | ((prev: T) => T)) => void;

/**
 * SSR-safe localStorage state.
 *
 * Renders `initialValue` on the server and the first client paint (so markup
 * matches and there is no hydration mismatch), then swaps in the persisted
 * value after mount. `hydrated` flips to true once the read has happened, so
 * callers can show skeletons until real data is ready.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Setter<T>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      /* ignore malformed or unavailable storage */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback<Setter<T>>(
    (updater) => {
      setValue((prev) => {
        const next =
          typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage may be full or blocked; keep in-memory value */
        }
        return next;
      });
    },
    [key],
  );

  return [value, set, hydrated];
}
