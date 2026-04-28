import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInspection, getRooms, getTenants } from "@/lib/supabase";
import { formatDate, formatCurrency } from "@/lib/seed";
import { ArrowLeft, AlertCircle, Check, Bot } from "lucide-react";
import { AiScoreDonut } from "./InspectionClient";

export async function generateStaticParams() {
  const { supabase } = await import("@/lib/supabase");
  const { data } = await supabase.from("inspections").select("id");
  return (data ?? []).map((i) => ({ id: i.id }));
}

function BeforeAfterPlaceholder({ type }: { type: "antes" | "despues" }) {
  const isAntes = type === "antes";
  return (
    <div className="relative w-full h-36 rounded-lg overflow-hidden border border-border">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: isAntes
            ? "linear-gradient(135deg, #e8f5f5 0%, #d1f0ee 100%)"
            : "linear-gradient(135deg, #fef9ec 0%, #fef3c7 100%)",
        }}
      >
        <div className="text-center">
          <div className="w-16 h-12 mx-auto mb-2 rounded-sm border-2 border-dashed" style={{ borderColor: isAntes ? "#2aada0" : "#f59e0b" }} />
          <p className="text-xs font-semibold" style={{ color: isAntes ? "#1a7070" : "#92400e" }}>
            {isAntes ? "Estado inicial" : "Estado en salida"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Imagen de referencia (demo)</p>
        </div>
      </div>
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ background: isAntes ? "#1a7070" : "#f59e0b" }}>
        {isAntes ? "ANTES (Check-in)" : "DESPUÉS (Check-out)"}
      </div>
    </div>
  );
}

export default async function InspectionDetailPage({ params }: { params: { id: string } }) {
  const [insp, rooms, tenants] = await Promise.all([
    getInspection(params.id),
    getRooms(),
    getTenants(),
  ]);
  if (!insp) notFound();

  const room = rooms.find((r) => r.id === insp.room_id);
  const tenant = insp.tenant_id ? tenants.find((t) => t.id === insp.tenant_id) : null;
  const totalCharges = insp.billable_items.reduce((s, i) => s + i.total, 0);

  return (
    <>
      <TopBar title={`Inspección ${insp.id}`} subtitle={`${insp.type} · Hab. ${room?.number} · ${formatDate(insp.date)}`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <Link href="/inspecciones" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a inspecciones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Score + summary */}
          <Card className="p-5 shadow-none border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Resultado IA</h3>
            <div className="flex flex-col items-center gap-3 mb-4">
              <AiScoreDonut score={insp.ai_score} />
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">
                  {insp.ai_score >= 80 ? "Estado excelente" : insp.ai_score >= 60 ? "Estado aceptable" : "Requiere atención"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{insp.findings.length} hallazgo{insp.findings.length !== 1 ? "s" : ""} detectado{insp.findings.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Habitación</span><span className="font-medium">Hab. {room?.number} ({room?.type})</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className="font-medium">{insp.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span>{formatDate(insp.date)}</span></div>
              {tenant && <div className="flex justify-between"><span className="text-muted-foreground">Inquilino</span><span>{tenant.full_name}</span></div>}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-2">
                <Bot className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground italic leading-relaxed">{insp.notes}</p>
              </div>
            </div>
          </Card>

          {/* Before/After + findings */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5 shadow-none border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Comparador Antes / Después</h3>
              <div className="grid grid-cols-2 gap-3">
                <BeforeAfterPlaceholder type="antes" />
                <BeforeAfterPlaceholder type="despues" />
              </div>
            </Card>

            {insp.findings.length > 0 ? (
              <Card className="p-5 shadow-none border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Hallazgos detectados</h3>
                <div className="flex flex-wrap gap-2">
                  {insp.findings.map((finding, i) => (
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
                  <p className="text-sm font-medium text-green-700">Sin hallazgos. La habitación está en perfecto estado.</p>
                </div>
              </Card>
            )}

            {insp.billable_items.length > 0 && (
              <Card className="p-5 shadow-none border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Cargos aplicables</h3>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2 grid grid-cols-4 text-xs font-semibold text-muted-foreground">
                    <span className="col-span-2">Concepto</span>
                    <span className="text-right">Cant.</span>
                    <span className="text-right">Total</span>
                  </div>
                  {insp.billable_items.map((item, i) => (
                    <div key={i} className="px-4 py-3 grid grid-cols-4 text-sm border-t border-border">
                      <span className="col-span-2 text-foreground">{item.item}</span>
                      <span className="text-right text-muted-foreground">{item.qty}</span>
                      <span className="text-right font-semibold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                  <div className="px-4 py-3 grid grid-cols-4 text-sm border-t-2 border-border bg-muted/20">
                    <span className="col-span-3 font-bold text-foreground">Total cargos</span>
                    <span className="text-right font-bold text-base text-red-700">{formatCurrency(totalCharges)}</span>
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
