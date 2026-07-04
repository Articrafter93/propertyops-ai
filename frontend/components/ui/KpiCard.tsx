import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  sub?: string;
  deltaSuffix?: string;
}

export function KpiCard({ label, value, unit, delta, icon: Icon, iconColor = "#1a7070", trend = "neutral", sub, deltaSuffix }: KpiCardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card className="p-5 flex flex-col gap-3 shadow-none border border-border">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className="p-2 rounded-lg" style={{ background: `${iconColor}18` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
          {unit && <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>}
        </div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      {delta !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full w-fit",
          isPositive && "bg-green-50 text-green-700",
          isNegative && "bg-red-50 text-red-700",
          !isPositive && !isNegative && "bg-muted text-muted-foreground"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          <span>{delta > 0 ? "+" : ""}{delta}% {deltaSuffix}</span>
        </div>
      )}
    </Card>
  );
}
