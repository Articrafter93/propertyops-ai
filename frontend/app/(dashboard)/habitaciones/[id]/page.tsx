import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRooms, getProperties, getTenants, getInspections } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/seed";
import { ArrowLeft, Check, Minus, X, Camera } from "lucide-react";

const INVENTORY: Record<string, { item: string; qty: number; condition: "Bien" | "Deteriorado" | "Faltante" }[]> = {
  "ROOM-101": [
    { item: "Cama individual", qty: 1, condition: "Bien" },
    { item: "Escritorio", qty: 1, condition: "Bien" },
    { item: "Silla de escritorio", qty: 1, condition: "Bien" },
    { item: "Armario empotrado", qty: 1, condition: "Bien" },
    { item: "Mesita de noche", qty: 1, condition: "Bien" },
    { item: "Lámpara de escritorio", qty: 1, condition: "Bien" },
    { item: "Espejo", qty: 1, condition: "Bien" },
    { item: "Toallas (set)", qty: 2, condition: "Bien" },
  ],
  default: [
    { item: "Cama", qty: 1, condition: "Bien" },
    { item: "Armario", qty: 1, condition: "Bien" },
    { item: "Escritorio", qty: 1, condition: "Bien" },
    { item: "Silla", qty: 1, condition: "Bien" },
    { item: "Estantería", qty: 1, condition: "Bien" },
    { item: "Toallas (set)", qty: 2, condition: "Bien" },
  ],
};

const conditionIcon = {
  Bien: { icon: Check, color: "text-green-600" },
  Deteriorado: { icon: Minus, color: "text-amber-600" },
  Faltante: { icon: X, color: "text-red-600" },
};

export async function generateStaticParams() {
  const { supabase } = await import("@/lib/supabase");
  const { data } = await supabase.from("rooms").select("id");
  return (data ?? []).map((r) => ({ id: r.id }));
}

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const [rooms, properties, tenants, allInspections] = await Promise.all([
    getRooms(), getProperties(), getTenants(), getInspections(),
  ]);
  const room = rooms.find((r) => r.id === params.id);
  if (!room) notFound();

  const property = properties.find((p) => p.id === room.property_id);
  const tenant = room.tenant_id ? tenants.find((t) => t.id === room.tenant_id) : null;
  const inspections = allInspections.filter((i) => i.room_id === room.id);
  const inventory = INVENTORY[room.id] ?? INVENTORY.default;

  return (
    <>
      <TopBar title={`Habitación ${room.number}`} subtitle={`${property?.name} · ${room.type} · ${formatCurrency(room.price)}/mes`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <Link href="/habitaciones" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a habitaciones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Info card */}
          <Card className="p-5 shadow-none border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Hab. {room.number}</h2>
                <p className="text-sm text-muted-foreground">{room.type} · {property?.name}</p>
              </div>
              <StatusBadge status={room.status} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio</span>
                <span className="font-semibold">{formatCurrency(room.price)}/mes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Propiedad</span>
                <span>{property?.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dirección</span>
                <span className="text-right text-xs">{property?.address}</span>
              </div>
            </div>
            {tenant && (
              <>
                <Separator className="my-4" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Inquilino actual</p>
                <Link href={`/inquilinos/${tenant.id}`} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1a7070" }}>
                    {tenant.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tenant.full_name}</p>
                    <p className="text-xs text-muted-foreground">Desde {formatDate(tenant.move_in_date)}</p>
                  </div>
                </Link>
              </>
            )}
          </Card>

          {/* Inventory */}
          <Card className="p-5 shadow-none border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Inventario</h3>
            <div className="space-y-2">
              {inventory.map((item, i) => {
                const { icon: Icon, color } = conditionIcon[item.condition];
                return (
                  <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-foreground">{item.item}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">×{item.qty}</span>
                      <span className={`text-xs font-medium ${color}`}>{item.condition}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Inspections */}
          <Card className="p-5 shadow-none border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Historial de inspecciones</h3>
            {inspections.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin inspecciones registradas.</p>
            ) : (
              <div className="space-y-3">
                {inspections.map((insp) => {
                  const scoreColor = insp.ai_score >= 80 ? "text-green-700 bg-green-50" : insp.ai_score >= 60 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
                  return (
                    <Link key={insp.id} href={`/inspecciones/${insp.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{insp.type}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(insp.date)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
                        {insp.ai_score}/100
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
