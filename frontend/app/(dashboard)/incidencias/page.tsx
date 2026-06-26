import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SlaIndicator } from "@/components/ui/SlaIndicator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getIncidents, getRooms, getTechnicians } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/seed";
import { createClient } from "@/lib/supabase-server";
import { getRole, DEMO_TECNICO_ID } from "@/lib/roles";
import { AlertTriangle } from "lucide-react";

const PRIORITY_ORDER = { Emergencia: 0, Alta: 1, Media: 2, Baja: 3 };

export default async function IncidenciasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = getRole(user?.email);

  const [allIncidents, rooms, technicians] = await Promise.all([getIncidents(), getRooms(), getTechnicians()]);

  // Técnico only sees incidents assigned to them
  const incidents = role === 'tecnico'
    ? allIncidents.filter((i) => i.technician_id === DEMO_TECNICO_ID)
    : allIncidents;

  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
  const techMap = Object.fromEntries(technicians.map((t) => [t.id, t]));

  const sorted = [...incidents].sort((a, b) => {
    const ap = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 9;
    const bp = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 9;
    return ap - bp;
  });

  const open = incidents.filter((i) => i.status === "Abierta").length;
  const inProcess = incidents.filter((i) => i.status === "En Proceso").length;
  const resolved = incidents.filter((i) => i.status === "Resuelta").length;

  return (
    <>
      <TopBar
        title={role === 'tecnico' ? "Mis Incidencias Asignadas" : "Centro de Incidencias"}
        subtitle={`${open} abiertas · ${inProcess} en proceso · ${resolved} resueltas`}
      />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {/* Role notice for tecnico */}
        {role === 'tecnico' && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-violet-50 border border-violet-200 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <p className="text-xs text-violet-700">
              Vista acotada — solo se muestran las incidencias que tienes asignadas.
            </p>
          </div>
        )}

        {/* Summary chips */}
        <div className="flex gap-3 mb-5">
          {[
            { label: "Abiertas", count: open, color: "bg-red-50 text-red-700 border-red-200" },
            { label: "En Proceso", count: inProcess, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Resueltas", count: resolved, color: "bg-green-50 text-green-700 border-green-200" },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${item.color}`}>
              <span>{item.label}</span>
              <span className="font-bold">{item.count}</span>
            </div>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Sin incidencias asignadas</p>
            <p className="text-xs text-muted-foreground">No tienes incidencias asignadas actualmente.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs w-8">SLA</TableHead>
                  <TableHead className="text-xs font-semibold">ID</TableHead>
                  <TableHead className="text-xs font-semibold">Descripción</TableHead>
                  <TableHead className="text-xs font-semibold">Habitación</TableHead>
                  <TableHead className="text-xs font-semibold">Prioridad</TableHead>
                  <TableHead className="text-xs font-semibold">Estado</TableHead>
                  <TableHead className="text-xs font-semibold">Técnico</TableHead>
                  <TableHead className="text-xs font-semibold">Creada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((inc) => {
                  const room = roomMap[inc.room_id];
                  const tech = inc.technician_id ? techMap[inc.technician_id] : null;
                  return (
                    <TableRow key={inc.id} className="hover:bg-muted/20">
                      <TableCell>
                        <SlaIndicator incident={inc} showLabel={false} />
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{inc.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-foreground line-clamp-2">{inc.description}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">Hab. {room?.number ?? inc.room_id}</p>
                          <p className="text-xs text-muted-foreground">{room?.type}</p>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={inc.priority} /></TableCell>
                      <TableCell><StatusBadge status={inc.status} /></TableCell>
                      <TableCell>
                        {tech ? (
                          <div>
                            <p className="text-xs font-medium text-foreground">{tech.name}</p>
                            <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <SlaIndicator incident={inc} showLabel />
                          <span className="text-xs text-muted-foreground hidden xl:inline">{formatRelativeTime(inc.created_at)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </>
  );
}
