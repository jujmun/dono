import { useEffect } from "react";
import { Platform } from "react-native";

const KEY_SELECTOR = ".retro-key, .retro-key-mint";
const FLAT_ATTR = "data-retro-flat";

/**
 * Keep retro-keys flat after press until the pointer actually leaves.
 * Uses a data attribute (not a class) so React className updates can't
 * wipe the lock and re-trigger the hover-lift spring-back.
 */
export function RetroKeyFlatLock() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const el = (event.target as Element | null)?.closest?.(
        KEY_SELECTOR
      ) as HTMLElement | null;
      if (
        !el ||
        el.matches(":disabled, [disabled]") ||
        el.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      // Lock before :active clears so release never re-applies hover lift.
      el.setAttribute(FLAT_ATTR, "true");

      if (!el.matches("a, button, input, textarea, select, [tabindex]")) {
        el.tabIndex = -1;
      }
      try {
        el.focus({ preventScroll: true });
      } catch {
        // Focus is a backup; the data attribute is the real lock.
      }

      const ac = new AbortController();
      const { signal } = ac;

      const unlock = () => {
        el.removeAttribute(FLAT_ATTR);
        ac.abort();
      };

      // pointerleave can false-fire when the key's transform shifts under the
      // cursor — unlock only when the pointer is truly outside the key.
      const onMove = (moveEvent: PointerEvent) => {
        const under = document.elementFromPoint(
          moveEvent.clientX,
          moveEvent.clientY
        );
        if (!under || !el.contains(under)) {
          unlock();
        }
      };

      document.addEventListener("pointermove", onMove, { signal });
      document.addEventListener("pointercancel", unlock, {
        once: true,
        signal,
      });
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return null;
}
