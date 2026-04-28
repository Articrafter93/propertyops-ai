import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const config =
    score >= 70
      ? { classes: "bg-green-50 text-green-700 border-green-200", label: "Alto" }
      : score >= 40
      ? { classes: "bg-amber-50 text-amber-700 border-amber-200", label: "Medio" }
      : { classes: "bg-red-50 text-red-700 border-red-200", label: "Bajo" };

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border", config.classes, className)}>
      {score}
      <span className="opacity-70 font-normal">/ 100</span>
    </span>
  );
}
