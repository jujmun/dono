import { useCallback, useEffect, useState } from "react";
import {
  getWelcomeTourComplete,
  getWelcomeTourPending,
  setWelcomeTourComplete,
  setWelcomeTourPending,
} from "@/lib/welcome-tour-storage";
import type { WelcomeTourVariant } from "@/components/welcome-tour";

export function useWelcomeTourStatus(
  userId: string | undefined,
  variant: WelcomeTourVariant = "student",
) {
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
      getWelcomeTourComplete(userId, variant),
      getWelcomeTourPending(userId, variant),
    ]).then(([isComplete, isPending]) => {
      if (!cancelled) {
        setComplete(isComplete);
        setPending(isPending);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId, variant]);

  const markPending = useCallback(async () => {
    if (!userId) return;
    await setWelcomeTourPending(userId, variant);
    setPending(true);
  }, [userId, variant]);

  const markComplete = useCallback(async () => {
    if (!userId) return;
    await setWelcomeTourComplete(userId, variant);
    setComplete(true);
    setPending(false);
  }, [userId, variant]);

  const loading = Boolean(userId) && (complete === null || pending === null);

  return { complete, pending, markPending, markComplete, loading };
}
