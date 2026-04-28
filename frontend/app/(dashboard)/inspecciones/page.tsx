import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getInspections, getRooms, getTenants } from "@/lib/supabase";
import { formatDate } from "@/lib/seed";
import { ExternalLink, Camera } from "lucide-react";

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
  const [inspections, rooms, tenants] = await Promise.all([getInspections(), getRooms(), getTenants()]);
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
  const tenantMap = Object.fromEntries(tenants.map((t) => [t.id, t]));

  return (
    <>
      <TopBar title="Inspecciones Visuales" subtitle={`${inspections.length} inspecciones registradas`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="bg-white rounded-lg border border-border shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">ID</TableHead>
                <TableHead className="text-xs font-semibold">Habitación</TableHead>
                <TableHead className="text-xs font-semibold">Tipo</TableHead>
                <TableHead className="text-xs font-semibold">Fecha</TableHead>
                <TableHead className="text-xs font-semibold">Inquilino</TableHead>
                <TableHead className="text-xs font-semibold">Score IA</TableHead>
                <TableHead className="text-xs font-semibold">Hallazgos</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((insp) => {
                const room = roomMap[insp.room_id];
                const tenant = insp.tenant_id ? tenantMap[insp.tenant_id] : null;
                return (
                  <TableRow key={insp.id} className="hover:bg-muted/20">
                    <TableCell className="text-xs font-mono text-muted-foreground">{insp.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">Hab. {room?.number}</span>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={insp.type === "Check-in" ? "Active" : "Checkout"} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(insp.date)}</TableCell>
                    <TableCell className="text-sm text-foreground">{tenant?.full_name ?? "—"}</TableCell>
                    <TableCell><AiScoreBadge score={insp.ai_score} /></TableCell>
                    <TableCell>
                      {insp.findings.length > 0 ? (
                        <span className="text-xs text-amber-700">{insp.findings.length} elemento{insp.findings.length !== 1 ? "s" : ""}</span>
                      ) : (
                        <span className="text-xs text-green-700">Sin incidencias</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/inspecciones/${insp.id}`} className="p-1.5 rounded-md hover:bg-muted inline-flex">
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
