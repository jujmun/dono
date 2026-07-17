import { useEffect, useState } from "react";
import { Text } from "react-native";
import { cn } from "@/lib/utils";

function formatMenubarClock(date: Date) {
  const day = date
    .toLocaleDateString("en-GB", { weekday: "short" })
    .toUpperCase();
  const dayNum = date.getDate();
  const month = date
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${dayNum} ${month} — ${time}`;
}

function formatTaskbarClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface RetroClockProps {
  variant: "menubar" | "taskbar";
  className?: string;
}

export function RetroClock({ variant, className }: RetroClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Text
      className={cn(
        "font-retro-mono text-[13px]",
        variant === "menubar"
          ? "rounded-md bg-retro-ink px-2.5 py-1 text-retro-paper"
          : "text-retro-paper",
        className,
      )}
    >
      {variant === "menubar" ? formatMenubarClock(now) : formatTaskbarClock(now)}
    </Text>
  );
}
