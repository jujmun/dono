import { useCallback, useEffect, useState } from "react";
import {
  getWelcomeTourComplete,
  getWelcomeTourPending,
  setWelcomeTourComplete,
  setWelcomeTourPending,
} from "@/lib/welcome-tour-storage";

export function useWelcomeTourStatus(userId: string | undefined) {
  const [complete, setComplete] = useState<boolean | null>(null);
  const [pending, setPending] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setComplete(null);
      setPending(null);
      return;
    }

    let cancelled = false;
    void Promise.all([
      getWelcomeTourComplete(userId),
      getWelcomeTourPending(userId),
    ]).then(([isComplete, isPending]) => {
      if (!cancelled) {
        setComplete(isComplete);
        setPending(isPending);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const markPending = useCallback(async () => {
    if (!userId) return;
    await setWelcomeTourPending(userId);
    setPending(true);
  }, [userId]);

  const markComplete = useCallback(async () => {
    if (!userId) return;
    await setWelcomeTourComplete(userId);
    setComplete(true);
    setPending(false);
  }, [userId]);

  const loading = Boolean(userId) && (complete === null || pending === null);

  return { complete, pending, markPending, markComplete, loading };
}
