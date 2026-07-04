import { Bell, CalendarDays } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { fmtDate } from "@/lib/i18n/format";
import { NOW } from "@/lib/seed";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export async function TopBar({ title, subtitle }: TopBarProps) {
  const locale = await getLocale();
  const demoDate = fmtDate(NOW.toISOString(), locale);

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-card border-b border-border">
      <div>
        <h1 className="text-base font-semibold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{demoDate}</span>
        </div>
        <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>
      </div>
    </header>
  );
}
