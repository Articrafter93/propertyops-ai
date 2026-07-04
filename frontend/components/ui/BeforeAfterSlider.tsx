"use client";

import { useCallback, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { useDict } from "@/lib/i18n/client";

function PanelBackground({ isBefore }: { isBefore: boolean }) {
  const dict = useDict();
  const t = dict.inspections;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: isBefore
          ? "linear-gradient(135deg, #e8f5f5 0%, #d1f0ee 100%)"
          : "linear-gradient(135deg, #fef9ec 0%, #fef3c7 100%)",
      }}
    >
      <div className="text-center">
        <div className="w-16 h-12 mx-auto mb-2 rounded-sm border-2 border-dashed" style={{ borderColor: isBefore ? "#2aada0" : "#f59e0b" }} />
        <p className="text-xs font-semibold" style={{ color: isBefore ? "#1a7070" : "#92400e" }}>
          {isBefore ? t.initialState : t.checkoutState}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{t.referenceImage}</p>
      </div>
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ background: isBefore ? "#1a7070" : "#f59e0b" }}>
        {isBefore ? t.beforeTag : t.afterTag}
      </div>
    </div>
  );
}

export function BeforeAfterSlider() {
  const dict = useDict();
  const t = dict.inspections;
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }
  function onPointerUp() {
    draggingRef.current = false;
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-36 rounded-lg overflow-hidden border border-border select-none touch-none cursor-ew-resize"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* After (bottom layer, full) */}
      <PanelBackground isBefore={false} />

      {/* Before (top layer, clipped to reveal window) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <PanelBackground isBefore={true} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow pointer-events-none" style={{ left: `${position}%` }} />

      {/* Drag handle */}
      <button
        type="button"
        role="slider"
        aria-label={t.comparatorTitle}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-border flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-primary/40"
        style={{ left: `${position}%` }}
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
