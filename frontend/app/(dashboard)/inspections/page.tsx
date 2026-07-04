import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getInspections, getRooms, getTenants } from "@/lib/data";
import { ExternalLink, Camera, Eye } from "lucide-react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtDate } from "@/lib/i18n/format";

function AiScoreBadge({ score }: { score: number }) {
  const config = score >= 80
    ? "bg-green-50 text-green-700 border-green-200"
    : score >= 60
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-red-50 text-red-700 border-red-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config}`}>
      {score}<span className="opacity-60 font-normal">/100</span>
    </span>
  );
}

export default async function InspeccionesPage() {
  const [inspections, rooms, tenants, dict, locale] = await Promise.all([getInspections(), getRooms(), getTenants(), getDictionary(), getLocale()]);
  const t = dict.inspections;
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
  const tenantMap = Object.fromEntries(tenants.map((tn) => [tn.id, tn]));

  return (
    <>
      <TopBar title={t.title} subtitle={t.subtitle.replace("{n}", String(inspections.length))} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="bg-white rounded-lg border border-border shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">{t.colId}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colRoom}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colType}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colDate}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colTenant}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colAiScore}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colFindings}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{t.empty}</p>
                    </div>
                  </td>
                </tr>
              )}
              {inspections.map((insp) => {
                const room = roomMap[insp.room_id];
                const tenant = insp.tenant_id ? tenantMap[insp.tenant_id] : null;
                return (
                  <TableRow key={insp.id} className="hover:bg-muted/20">
                    <TableCell className="text-xs font-mono text-muted-foreground">{insp.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">{t.roomPrefix} {room?.number}</span>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={insp.type === "Check-in" ? "Active" : "Checkout"} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmtDate(insp.date, locale)}</TableCell>
                    <TableCell className="text-sm text-foreground">{tenant?.full_name ?? "—"}</TableCell>
                    <TableCell><AiScoreBadge score={insp.ai_score} /></TableCell>
                    <TableCell>
                      {insp.findings.length > 0 ? (
                        <span className="text-xs text-amber-700">{(insp.findings.length !== 1 ? t.findingsPlural : t.findingsSingular).replace("{n}", String(insp.findings.length))}</span>
                      ) : (
                        <span className="text-xs text-green-700">{t.noFindings}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/inspections/${insp.id}`} className="p-1.5 rounded-md hover:bg-muted inline-flex">
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
