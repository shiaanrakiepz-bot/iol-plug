"use client";

import { useEffect, useState } from "react";

/**
 * Brand selection state, seeded from a `?brand=<id>` query param when present
 * and valid. Reads the param via window.location (client-only) to avoid a
 * Suspense boundary requirement around useSearchParams during static build.
 */
export function useBrandSelection(validIds: string[], fallback: string) {
  const [id, setId] = useState(fallback);

  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get("brand");
      if (param && validIds.includes(param)) setId(param);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [id, setId] as const;
}
