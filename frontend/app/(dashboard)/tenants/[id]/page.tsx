import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  getTenant, getRooms, getContracts, getProperties,
  getPayments, getIncidents,
} from "@/lib/data";
import { Mail, Phone, CreditCard, Home, FileText, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtDate, fmtCurrency } from "@/lib/i18n/format";
import { enIncidentDescription, enPaymentNote } from "@/lib/i18n/seed-en";

export async function generateStaticParams() {
  const { tenants } = await import("@/lib/seed");
  return tenants.map((t) => ({ id: t.id }));
}

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tenant, rooms, contracts, properties, payments, incidents] = await Promise.all([
    getTenant(id),
    getRooms(),
    getContracts(),
    getProperties(),
    getPayments(id),
    getIncidents(),
  ]);
  if (!tenant) notFound();
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.tenantDetail;

  const room = rooms.find((r) => r.id === tenant.room_id);
  const property = room ? properties.find((p) => p.id === room.property_id) : null;
  const contract = contracts.find((c) => c.tenant_id === tenant.id);
  const tenantPayments = payments;
  const tenantIncidents = incidents.filter((i) => i.tenant_id === tenant.id);
  const totalPaid = tenantPayments.filter((p) => p.status === "Pagado").reduce((s, p) => s + p.amount, 0);
  const totalPending = tenantPayments.filter((p) => p.status !== "Pagado").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <TopBar title={tenant.full_name} subtitle={t.subtitle.replace("{id}", tenant.id)} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <Link href="/tenants" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
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
                  <span>{t.dniLabel}: {tenant.dni}</span>
                </div>
                {room && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Home className="w-3.5 h-3.5 shrink-0" />
                    <span>{property?.name} · {t.roomPrefix} {room.number} ({dict.seedContent.roomType[room.type] ?? room.type})</span>
                  </div>
                )}
              </div>
            </Card>

            {contract && (
              <Card className="p-5 shadow-none border border-border">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">{t.activeContract}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.ref}</span>
                    <span className="font-mono font-medium">{contract.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.start}</span>
                    <span>{fmtDate(contract.start_date, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.end}</span>
                    <span>{fmtDate(contract.end_date, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.monthlyRent}</span>
                    <span className="font-semibold text-foreground">{fmtCurrency(contract.monthly_rent, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.deposit}</span>
                    <span>{fmtCurrency(contract.deposit, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.status}</span>
                    <StatusBadge status={contract.status} />
                  </div>
                </div>
                <span className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" /> {t.archivedDrive}
                </span>
              </Card>
            )}
          </div>

          {/* Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="payments">
              <TabsList className="mb-4">
                <TabsTrigger value="payments">{t.tabPayments} ({tenantPayments.length})</TabsTrigger>
                <TabsTrigger value="incidents">{t.tabIncidents} ({tenantIncidents.length})</TabsTrigger>
                <TabsTrigger value="documents">{t.tabDocuments}</TabsTrigger>
              </TabsList>

              <TabsContent value="payments">
                <div className="mb-3 flex gap-4 text-sm">
                  <span className="text-muted-foreground">{t.totalPaid}: <strong className="text-green-700">{fmtCurrency(totalPaid, locale)}</strong></span>
                  <span className="text-muted-foreground">{t.pending}: <strong className="text-red-700">{fmtCurrency(totalPending, locale)}</strong></span>
                </div>
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="text-xs">{t.colRef}</TableHead>
                        <TableHead className="text-xs">{t.colDate}</TableHead>
                        <TableHead className="text-xs">{t.colConcept}</TableHead>
                        <TableHead className="text-xs">{t.colAmount}</TableHead>
                        <TableHead className="text-xs">{t.colStatus}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenantPayments.map((pay) => (
                        <TableRow key={pay.id}>
                          <TableCell className="text-xs font-mono text-muted-foreground">{pay.id}</TableCell>
                          <TableCell className="text-xs">{fmtDate(pay.date, locale)}</TableCell>
                          <TableCell className="text-xs">{dict.seedContent.paymentType[pay.type] ?? pay.type}{pay.note && <span className="text-muted-foreground"> — {enPaymentNote(pay.note, locale)}</span>}</TableCell>
                          <TableCell className="text-sm font-semibold">{fmtCurrency(pay.amount, locale)}</TableCell>
                          <TableCell><StatusBadge status={pay.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="incidents">
                {tenantIncidents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">{t.noIncidents}</p>
                ) : (
                  <div className="space-y-3">
                    {tenantIncidents.map((inc) => (
                      <Card key={inc.id} className="p-4 shadow-none border border-border">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-mono text-muted-foreground">{inc.id}</p>
                            <p className="text-sm text-foreground mt-0.5">{enIncidentDescription(inc, locale)}</p>
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

              <TabsContent value="documents">
                <div className="space-y-2">
                  {[t.docId, t.docPayslip, t.docContract, t.docInsurance].map((doc, i) => (
                    <Card key={i} className="p-4 shadow-none border border-border flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{doc}</p>
                        <p className="text-xs text-muted-foreground">{t.archivedDrive}</p>
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
