import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { getRooms, getProperties, getTenants } from "@/lib/data";
import { Home, User, DollarSign, Building2 } from "lucide-react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtCurrency } from "@/lib/i18n/format";

export default async function HabitacionesPage() {
  const [rooms, properties, tenants, dict, locale] = await Promise.all([getRooms(), getProperties(), getTenants(), getDictionary(), getLocale()]);
  const t = dict.rooms;
  const tenantMap = Object.fromEntries(tenants.map((t) => [t.id, t]));
  const available = rooms.filter((r) => r.status === "Available").length;
  const occupied = rooms.filter((r) => r.status === "Occupied").length;

  return (
    <>
      <TopBar title={t.title} subtitle={t.subtitle.replace("{total}", String(rooms.length)).replace("{occupied}", String(occupied)).replace("{available}", String(available))} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">{t.emptyPropertiesTitle}</p>
              <p className="text-xs text-muted-foreground">{t.emptyPropertiesBody}</p>
            </div>
          )}
          {properties.map((prop) => {
          const propRooms = rooms.filter((r) => r.property_id === prop.id);
          return (
            <div key={prop.id} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-bold text-foreground">{prop.name}</h2>
                <span className="text-xs text-muted-foreground">{prop.address} · {prop.city}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {propRooms.length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <p className="text-xs text-muted-foreground">{t.emptyRooms}</p>
                    </div>
                  )}
                {propRooms.map((room) => {
                  const tenant = room.tenant_id ? tenantMap[room.tenant_id] : null;
                  return (
                    <Link key={room.id} href={`/rooms/${room.id}`}>
                      <Card className="p-5 shadow-none border border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-muted">
                              <Home className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{t.roomPrefix} {room.number}</p>
                              <p className="text-xs text-muted-foreground">{dict.seedContent.roomType[room.type] ?? room.type}</p>
                            </div>
                          </div>
                          <StatusBadge status={room.status} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <DollarSign className="w-3 h-3" />
                            <span className="font-semibold text-foreground">{fmtCurrency(room.price, locale)}</span>
                            <span>{t.perMonth}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{tenant ? tenant.full_name : t.available}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
