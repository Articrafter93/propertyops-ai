"use client";

import { cn } from "@/lib/utils";
import type { Incident } from "@/lib/types";
import { getSlaStatus, getSlaHoursElapsed } from "@/lib/seed";
import { useDict } from "@/lib/i18n/client";

interface SlaIndicatorProps {
  incident: Incident;
  showLabel?: boolean;
}

export function SlaIndicator({ incident, showLabel = true }: SlaIndicatorProps) {
  const dict = useDict();
  const sla = getSlaStatus(incident);
  const hours = getSlaHoursElapsed(incident.created_at);
  const days = Math.floor(hours / 24);

  const config = {
    ok: { dot: "bg-green-500", text: "text-green-700" },
    warning: { dot: "bg-amber-500", text: "text-amber-700" },
    critical: { dot: "bg-red-500 sla-pulse", text: "text-red-700" },
  }[sla];

  const elapsed = days > 0 ? `${days}d ${Math.floor(hours % 24)}h` : `${Math.floor(hours)}h`;
  const isResolved = incident.status === "Resuelta" || incident.status === "Cerrada";

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full shrink-0", config.dot)} />
      {showLabel && (
        <span className={cn("text-xs font-medium", config.text)}>
          {isResolved ? dict.sla.resolved : elapsed}
        </span>
      )}
    </div>
  );
}
