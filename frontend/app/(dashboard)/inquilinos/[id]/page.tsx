import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  getTenant, getRooms, getContracts, getProperties,
  getPayments, getIncidents,
} from "@/lib/supabase";
import { formatDate, formatCurrency } from "@/lib/seed";
import { Mail, Phone, CreditCard, Home, FileText, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export async function generateStaticParams() {
  const { supabase } = await import("@/lib/supabase");
  const { data } = await supabase.from("tenants").select("id");
  return (data ?? []).map((t) => ({ id: t.id }));
}

export default async function TenantDetailPage({ params }: { params: { id: string } }) {
  const [tenant, rooms, contracts, properties, payments, incidents] = await Promise.all([
    getTenant(params.id),
    getRooms(),
    getContracts(),
    getProperties(),
    getPayments(params.id),
    getIncidents(),
  ]);
  if (!tenant) notFound();

  const room = rooms.find((r) => r.id === tenant.room_id);
  const property = room ? properties.find((p) => p.id === room.property_id) : null;
  const contract = contracts.find((c) => c.tenant_id === tenant.id);
  const tenantPayments = payments;
  const tenantIncidents = incidents.filter((i) => i.tenant_id === tenant.id);
  const totalPaid = tenantPayments.filter((p) => p.status === "Pagado").reduce((s, p) => s + p.amount, 0);
  const totalPending = tenantPayments.filter((p) => p.status !== "Pagado").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <TopBar title={tenant.full_name} subtitle={`Expediente del inquilino · ${tenant.id}`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <Link href="/inquilinos" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a inquilinos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sidebar info */}
          <div className="space-y-4">
            <Card className="p-5 shadow-none border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: "#1a7070" }}>
                  {tenant.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{tenant.full_name}</p>
                  <StatusBadge status={tenant.status} className="mt-1" />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span>DNI: {tenant.dni}</span>
                </div>
                {room && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Home className="w-3.5 h-3.5 shrink-0" />
                    <span>{property?.name} · Hab. {room.number} ({room.type})</span>
                  </div>
                )}
              </div>
            </Card>

            {contract && (
              <Card className="p-5 shadow-none border border-border">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Contrato activo</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Referencia</span>
                    <span className="font-mono font-medium">{contract.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inicio</span>
                    <span>{formatDate(contract.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vencimiento</span>
                    <span>{formatDate(contract.end_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renta mensual</span>
                    <span className="font-semibold text-foreground">{formatCurrency(contract.monthly_rent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Depósito</span>
                    <span>{formatCurrency(contract.deposit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <StatusBadge status={contract.status} />
                  </div>
                </div>
                <a href={contract.pdf_url} className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <FileText className="w-3.5 h-3.5" /> Ver contrato PDF
                </a>
              </Card>
            )}
          </div>

          {/* Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="pagos">
              <TabsList className="mb-4">
                <TabsTrigger value="pagos">Pagos ({tenantPayments.length})</TabsTrigger>
                <TabsTrigger value="incidencias">Incidencias ({tenantIncidents.length})</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="pagos">
                <div className="mb-3 flex gap-4 text-sm">
                  <span className="text-muted-foreground">Total abonado: <strong className="text-green-700">{formatCurrency(totalPaid)}</strong></span>
                  <span className="text-muted-foreground">Pendiente: <strong className="text-red-700">{formatCurrency(totalPending)}</strong></span>
                </div>
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="text-xs">Ref.</TableHead>
                        <TableHead className="text-xs">Fecha</TableHead>
                        <TableHead className="text-xs">Concepto</TableHead>
                        <TableHead className="text-xs">Importe</TableHead>
                        <TableHead className="text-xs">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenantPayments.map((pay) => (
                        <TableRow key={pay.id}>
                          <TableCell className="text-xs font-mono text-muted-foreground">{pay.id}</TableCell>
                          <TableCell className="text-xs">{formatDate(pay.date)}</TableCell>
                          <TableCell className="text-xs">{pay.type}{pay.note && <span className="text-muted-foreground"> — {pay.note}</span>}</TableCell>
                          <TableCell className="text-sm font-semibold">{formatCurrency(pay.amount)}</TableCell>
                          <TableCell><StatusBadge status={pay.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="incidencias">
                {tenantIncidents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">Sin incidencias registradas.</p>
                ) : (
                  <div className="space-y-3">
                    {tenantIncidents.map((inc) => (
                      <Card key={inc.id} className="p-4 shadow-none border border-border">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-mono text-muted-foreground">{inc.id}</p>
                            <p className="text-sm text-foreground mt-0.5">{inc.description}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <StatusBadge status={inc.priority} />
                            <StatusBadge status={inc.status} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documentos">
                <div className="space-y-2">
                  {["DNI / Identificación", "Nómina (último mes)", "Contrato firmado", "Seguro de hogar"].map((doc, i) => (
                    <Card key={i} className="p-4 shadow-none border border-border flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{doc}</p>
                        <p className="text-xs text-muted-foreground">Archivado · Google Drive</p>
                      </div>
                      <StatusBadge status="Firmado" />
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
}
