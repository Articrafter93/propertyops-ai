import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { getInspection, getRooms, getTenants } from "@/lib/data";
import { ArrowLeft, AlertCircle, Check, Bot } from "lucide-react";
import { AiScoreDonut } from "./InspectionClient";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtDate, fmtCurrency } from "@/lib/i18n/format";
import { enInspectionNotes, enInspectionFindings, enBillableItem } from "@/lib/i18n/seed-en";

export async function generateStaticParams() {
  const { inspections } = await import("@/lib/seed");
  return inspections.map((i) => ({ id: i.id }));
}

export default async function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [insp, rooms, tenants, dict, locale] = await Promise.all([
    getInspection(id),
    getRooms(),
    getTenants(),
    getDictionary(),
    getLocale(),
  ]);
  if (!insp) notFound();
  const t = dict.inspections;

  const room = rooms.find((r) => r.id === insp.room_id);
  const tenant = insp.tenant_id ? tenants.find((tn) => tn.id === insp.tenant_id) : null;
  const totalCharges = insp.billable_items.reduce((s, i) => s + i.total, 0);

  return (
    <>
      <TopBar title={t.detailTitle.replace("{id}", insp.id)} subtitle={`${insp.type} · ${t.roomPrefix} ${room?.number} · ${fmtDate(insp.date, locale)}`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <Link href="/inspections" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> {t.detailBack}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Score + summary */}
          <Card className="p-5 shadow-none border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t.aiResultTitle}</h3>
            <div className="flex flex-col items-center gap-3 mb-4">
              <AiScoreDonut score={insp.ai_score} />
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">
                  {insp.ai_score >= 80 ? t.stateExcellent : insp.ai_score >= 60 ? t.stateAcceptable : t.stateNeedsAttention}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{(insp.findings.length !== 1 ? t.findingDetectedPlural : t.findingDetectedSingular).replace("{n}", String(insp.findings.length))}</p>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">{t.rowRoom}</span><span className="font-medium">{t.roomPrefix} {room?.number} ({room ? dict.seedContent.roomType[room.type] ?? room.type : ""})</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t.rowType}</span><span className="font-medium">{insp.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t.rowDate}</span><span>{fmtDate(insp.date, locale)}</span></div>
              {tenant && <div className="flex justify-between"><span className="text-muted-foreground">{t.rowTenant}</span><span>{tenant.full_name}</span></div>}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-2">
                <Bot className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground italic leading-relaxed">{enInspectionNotes(insp, locale)}</p>
              </div>
            </div>
          </Card>

          {/* Before/After + findings */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5 shadow-none border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t.comparatorTitle}</h3>
              <BeforeAfterSlider />
            </Card>

            {insp.findings.length > 0 ? (
              <Card className="p-5 shadow-none border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">{t.findingsTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {enInspectionFindings(insp, locale).map((finding, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      <AlertCircle className="w-3 h-3" />
                      {finding}
                    </span>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-5 shadow-none border border-border">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-700">{t.noFindingsDetail}</p>
                </div>
              </Card>
            )}

            {insp.billable_items.length > 0 && (
              <Card className="p-5 shadow-none border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">{t.applicableCharges}</h3>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2 grid grid-cols-4 text-xs font-semibold text-muted-foreground">
                    <span className="col-span-2">{t.colConcept}</span>
                    <span className="text-right">{t.colQty}</span>
                    <span className="text-right">{t.totalLabel}</span>
                  </div>
                  {insp.billable_items.map((item, i) => (
                    <div key={i} className="px-4 py-3 grid grid-cols-4 text-sm border-t border-border">
                      <span className="col-span-2 text-foreground">{enBillableItem(insp, i, item.item, locale)}</span>
                      <span className="text-right text-muted-foreground">{item.qty}</span>
                      <span className="text-right font-semibold">{fmtCurrency(item.total, locale)}</span>
                    </div>
                  ))}
                  <div className="px-4 py-3 grid grid-cols-4 text-sm border-t-2 border-border bg-muted/20">
                    <span className="col-span-3 font-bold text-foreground">{t.totalChargesLabel}</span>
                    <span className="text-right font-bold text-base text-red-700">{fmtCurrency(totalCharges, locale)}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
