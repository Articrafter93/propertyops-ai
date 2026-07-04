"use client";

import { useState } from "react";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Check, X, Briefcase, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDict } from "@/lib/i18n/client";
import { fmtRelativeTime } from "@/lib/i18n/format";
import type { Lead } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

const KANBAN_COLUMNS: { key: "new" | "review" | "approved" | "contract"; labelKey: "colNew" | "colReview" | "colApproved" | "colContract"; color: string }[] = [
  { key: "new", labelKey: "colNew", color: "#f59e0b" },
  { key: "review", labelKey: "colReview", color: "#3b82f6" },
  { key: "approved", labelKey: "colApproved", color: "#10b981" },
  { key: "contract", labelKey: "colContract", color: "#1a7070" },
];

type Decision = "approved" | "rejected" | null;
type Bucket = "new" | "review" | "approved" | "contract" | "rejected";

function bucketFor(lead: Lead, decision: Decision): Bucket {
  if (decision === "approved") return "approved";
  if (decision === "rejected") return "rejected";
  if (lead.status === "Auto-Aprobado") return "approved";
  if (lead.status === "Contrato Enviado") return "contract";
  if (lead.status === "Rechazado") return "rejected";
  return new Date(lead.created_at) > new Date("2026-04-24") ? "new" : "review";
}

export function OnboardingBoard({ leads, locale }: { leads: Lead[]; locale: Locale }) {
  const dict = useDict();
  const t = dict.onboarding;
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const buckets: Record<Bucket, Lead[]> = { new: [], review: [], approved: [], contract: [], rejected: [] };
  for (const lead of leads) {
    buckets[bucketFor(lead, decisions[lead.id] ?? null)].push(lead);
  }

  const allLeads = leads.length;
  const approvedCount = buckets.approved.length + buckets.contract.length;
  const underReviewCount = buckets.new.length + buckets.review.length;
  const rejectedCount = buckets.rejected.length;

  return (
    <>
      {/* Stats row (reflects manual decisions live) */}
      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{t.statsTotal.replace("{n}", String(allLeads))}</span>
        <span>·</span>
        <span className="text-green-700">{t.statsApproved.replace("{n}", String(approvedCount))}</span>
        <span>·</span>
        <span className="text-amber-700">{t.statsUnderReview.replace("{n}", String(underReviewCount))}</span>
        <span>·</span>
        <span className="text-red-700">{t.statsRejected.replace("{n}", String(rejectedCount))}</span>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 h-full">
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = buckets[col.key];
          return (
            <div key={col.key} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-semibold text-foreground">{t[col.labelKey]}</span>
                <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{colLeads.length}</span>
              </div>
              <div className="space-y-3">
                {colLeads.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <p className="text-xs text-muted-foreground">{t.emptyColumn}</p>
                  </div>
                )}
                {colLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    locale={locale}
                    decision={decisions[lead.id] ?? null}
                    onApprove={() => setDecisions((d) => ({ ...d, [lead.id]: "approved" }))}
                    onReject={() => setDecisions((d) => ({ ...d, [lead.id]: "rejected" }))}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function LeadCard({
  lead,
  locale,
  decision,
  onApprove,
  onReject,
}: {
  lead: Lead;
  locale: Locale;
  decision: Decision;
  onApprove: () => void;
  onReject: () => void;
}) {
  const dict = useDict();
  const t = dict.onboarding;
  const employment = dict.seedContent.employment;
  const isDecided = decision !== null;

  return (
    <div className="bg-white rounded-lg border border-border p-4 space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{lead.full_name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{fmtRelativeTime(lead.created_at, locale)}</p>
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
          <span>{employment[lead.employment] ?? lead.employment}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>{t.incomeRatio}: {lead.income_ratio}×</span>
        </div>
      </div>
      <Separator />
      {isDecided ? (
        <div
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md border",
            decision === "approved"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          )}
        >
          {decision === "approved" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          {decision === "approved" ? t.decisionApproved : t.decisionRejected}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
          >
            <Check className="w-3 h-3" /> {t.approve}
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <X className="w-3 h-3" /> {t.reject}
          </button>
        </div>
      )}
    </div>
  );
}
