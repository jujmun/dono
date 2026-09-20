import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { Platform, View, type LayoutChangeEvent } from "react-native";
import { cn } from "@/lib/utils";

const EDGE_PADDING = 16;
const DRAG_THRESHOLD_PX = 4;

type DraggableHeroCardProps = {
  children: React.ReactNode;
  /** Hero frame size — required to clamp the card inside the image. */
  containerWidth: number;
  containerHeight: number;
  className?: string;
  /** Max width of the floating card (matches prior `w-80`). */
  cardMaxWidth?: number;
};

function clampPosition(
  left: number,
  top: number,
  containerWidth: number,
  containerHeight: number,
  cardWidth: number,
  cardHeight: number,
) {
  const maxLeft = Math.max(EDGE_PADDING, containerWidth - cardWidth - EDGE_PADDING);
  const maxTop = Math.max(EDGE_PADDING, containerHeight - cardHeight - EDGE_PADDING);
  return {
    left: Math.min(Math.max(EDGE_PADDING, left), maxLeft),
    top: Math.min(Math.max(EDGE_PADDING, top), maxTop),
  };
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'button, input, textarea, select, a, [role="button"], [contenteditable="true"]',
    ),
  );
}

/**
 * Web-only: drag a floating card around inside a measured hero frame.
 * Position is session-local (not persisted). Clamped so the card stays fully
 * inside the hero bounds. Clicks on buttons/inputs still work normally.
 */
export function DraggableHeroCard({
  children,
  containerWidth,
  containerHeight,
  className,
  cardMaxWidth = 320,
}: DraggableHeroCardProps) {
  const [cardSize, setCardSize] = useState({ width: cardMaxWidth, height: 280 });
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null,
  );
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originLeft: number;
    originTop: number;
    dragging: boolean;
  } | null>(null);
  const positionRef = useRef(position);
  positionRef.current = position;

  const reclamp = useCallback(
    (left: number, top: number) =>
      clampPosition(
        left,
        top,
        containerWidth,
        containerHeight,
        cardSize.width,
        cardSize.height,
      ),
    [containerWidth, containerHeight, cardSize.width, cardSize.height],
  );

  useEffect(() => {
    if (containerWidth <= 0 || containerHeight <= 0) return;
    setPosition((current) => {
      if (current) return reclamp(current.left, current.top);
      return reclamp(
        containerWidth - cardSize.width - EDGE_PADDING,
        EDGE_PADDING,
      );
    });
  }, [containerWidth, containerHeight, cardSize.width, cardSize.height, reclamp]);

  const onCardLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    setCardSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  };

  if (Platform.OS !== "web") {
    return (
      <View
        className={cn("absolute right-4 top-4 z-10 w-80 max-w-[42%]", className)}
      >
        {children}
      </View>
    );
  }

  const left = position?.left ?? EDGE_PADDING;
  const top = position?.top ?? EDGE_PADDING;
  const ready = position != null && containerWidth > 0;

  return createElement(
    "div",
    {
      className,
      style: {
        position: "absolute",
        left,
        top,
        width: cardMaxWidth,
        maxWidth: "42%",
        zIndex: 10,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        opacity: ready ? 1 : 0,
      },
      onPointerDown: (event: PointerEvent) => {
        if (isInteractiveTarget(event.target)) return;
        const current = positionRef.current;
        if (!current) return;
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originLeft: current.left,
          originTop: current.top,
          dragging: false,
        };
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      },
      onPointerMove: (event: PointerEvent) => {
        const state = dragRef.current;
        if (!state || state.pointerId !== event.pointerId) return;
        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;
        if (
          !state.dragging &&
          Math.abs(dx) < DRAG_THRESHOLD_PX &&
          Math.abs(dy) < DRAG_THRESHOLD_PX
        ) {
          return;
        }
        state.dragging = true;
        (event.currentTarget as HTMLElement).style.cursor = "grabbing";
        setPosition(reclamp(state.originLeft + dx, state.originTop + dy));
      },
      onPointerUp: (event: PointerEvent) => {
        if (dragRef.current?.pointerId === event.pointerId) {
          dragRef.current = null;
          (event.currentTarget as HTMLElement).style.cursor = "grab";
        }
      },
      onPointerCancel: (event: PointerEvent) => {
        if (dragRef.current?.pointerId === event.pointerId) {
          dragRef.current = null;
          (event.currentTarget as HTMLElement).style.cursor = "grab";
        }
      },
    },
    createElement(View, { onLayout: onCardLayout }, children),
  );
}
