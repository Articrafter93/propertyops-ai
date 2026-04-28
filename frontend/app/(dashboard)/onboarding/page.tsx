import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getLeads } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/seed";
import { Mail, Phone, Check, X, FileText, Briefcase, TrendingUp } from "lucide-react";
import type { Lead } from "@/lib/types";

const KANBAN_COLUMNS: { key: string; label: string; statuses: string[]; color: string }[] = [
  { key: "new", label: "Nuevo Lead", statuses: ["Revisión Manual"], color: "#f59e0b" },
  { key: "review", label: "En Revisión", statuses: ["Revisión Manual"], color: "#3b82f6" },
  { key: "approved", label: "Aprobado", statuses: ["Auto-Aprobado"], color: "#10b981" },
  { key: "contract", label: "Contrato Enviado", statuses: ["Contrato Enviado"], color: "#1a7070" },
];

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="bg-white rounded-lg border border-border p-4 space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{lead.full_name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(lead.created_at)}</p>
        </div>
        <ScoreBadge score={lead.score} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Briefcase className="w-3 h-3" />
          <span>{lead.employment}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>Ratio ingresos: {lead.income_ratio}×</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
          <Check className="w-3 h-3" /> Aprobar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
          <X className="w-3 h-3" /> Rechazar
        </button>
        <button className="p-1.5 rounded-md border border-border hover:bg-muted transition-colors">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default async function OnboardingPage() {
  const leads = await getLeads();
  const byStatus = {
    new: leads.filter((l) => l.status === "Revisión Manual" && new Date(l.created_at) > new Date("2026-04-24")),
    review: leads.filter((l) => l.status === "Revisión Manual" && new Date(l.created_at) <= new Date("2026-04-24")),
    approved: leads.filter((l) => l.status === "Auto-Aprobado"),
    contract: leads.filter((l) => l.status === "Contrato Enviado"),
  };

  const allLeads = leads.length;
  const approved = leads.filter((l) => l.status === "Auto-Aprobado" || l.status === "Contrato Enviado").length;
  const rejected = leads.filter((l) => l.status === "Rechazado").length;

  return (
    <>
      <TopBar title="Bandeja de Onboarding" subtitle={`${allLeads} leads · ${approved} aprobados · ${rejected} rechazados`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {/* Stats row */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{allLeads} leads totales</span>
          <span>·</span>
          <span className="text-green-700">{approved} aprobados</span>
          <span>·</span>
          <span className="text-amber-700">{byStatus.new.length + byStatus.review.length} en revisión</span>
          <span>·</span>
          <span className="text-red-700">{rejected} rechazados</span>
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 h-full">
          {KANBAN_COLUMNS.map((col) => {
            const colLeads = byStatus[col.key as keyof typeof byStatus];
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{colLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {colLeads.length === 0 && (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <p className="text-xs text-muted-foreground">Sin leads en esta etapa</p>
                    </div>
                  )}
                  {colLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
