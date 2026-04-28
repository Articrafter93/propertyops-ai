import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTenants, getRooms, getContracts } from "@/lib/supabase";
import { formatDate } from "@/lib/seed";
import { ExternalLink } from "lucide-react";

export default async function InquilinosPage() {
  const [tenants, rooms, contracts] = await Promise.all([getTenants(), getRooms(), getContracts()]);
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r]));
  const contractMap = Object.fromEntries(contracts.map((c) => [c.tenant_id, c]));

  return (
    <>
      <TopBar title="Inquilinos" subtitle={`${tenants.length} inquilinos registrados`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="bg-white rounded-lg border border-border shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Nombre</TableHead>
                <TableHead className="text-xs font-semibold">Habitación</TableHead>
                <TableHead className="text-xs font-semibold">Contacto</TableHead>
                <TableHead className="text-xs font-semibold">Contrato</TableHead>
                <TableHead className="text-xs font-semibold">Estado</TableHead>
                <TableHead className="text-xs font-semibold">Entrada</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => {
                const room = roomMap[tenant.room_id];
                const contract = contractMap[tenant.id];
                return (
                  <TableRow key={tenant.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tenant.full_name}</p>
                        <p className="text-xs text-muted-foreground">{tenant.dni}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground font-medium">{room?.number ?? "—"}</span>
                      {room && <p className="text-xs text-muted-foreground">{room.type}</p>}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">{tenant.email}</p>
                      <p className="text-xs text-muted-foreground">{tenant.phone}</p>
                    </TableCell>
                    <TableCell>
                      {contract ? (
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">{contract.id}</p>
                          <p className="text-xs text-muted-foreground">hasta {formatDate(contract.end_date)}</p>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={tenant.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(tenant.move_in_date)}</TableCell>
                    <TableCell>
                      <Link href={`/inquilinos/${tenant.id}`} className="p-1.5 rounded-md hover:bg-muted inline-flex">
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
