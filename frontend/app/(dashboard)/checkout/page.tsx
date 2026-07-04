import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { tenants, getRoom, getContract } from "@/lib/seed";
import { LogOut } from "lucide-react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtCurrency, fmtDate } from "@/lib/i18n/format";
import { CheckoutWizard } from "./CheckoutWizard";

export default async function CheckoutPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.checkout;

  const checkoutTenants = tenants.filter((tn) => tn.status === "Checkout");
  const tenant = checkoutTenants[0];
  const room = tenant ? getRoom(tenant.room_id) : null;
  const contract = tenant ? getContract(tenant.id) : null;

  const roomTypeLabel = room ? dict.seedContent.roomType[room.type] ?? room.type : "";
  const roomLabel = `${t.roomPrefix} ${room?.number ?? ""} · ${roomTypeLabel}`;

  const charges = [
    { concept: t.charge1, amountFormatted: fmtCurrency(180, locale) },
    { concept: t.charge2, amountFormatted: fmtCurrency(50, locale) },
    { concept: t.charge3, amountFormatted: fmtCurrency(50, locale) },
  ];
  const totalCharges = 180 + 50 + 50;
  const deposit = contract?.deposit ?? 0;
  const balance = deposit - totalCharges;

  return (
    <>
      <TopBar title={t.title} subtitle={(checkoutTenants.length !== 1 ? t.subtitlePlural : t.subtitle).replace("{n}", String(checkoutTenants.length))} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {checkoutTenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{t.emptyTitle}</p>
            <p className="text-xs text-muted-foreground">{t.emptyBody}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Active checkouts list */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">{t.activeCheckouts}</h3>
              <div className="space-y-3">
                {checkoutTenants.map((ct) => {
                  const r = getRoom(ct.room_id);
                  return (
                    <Card key={ct.id} className="p-4 shadow-none border-2 border-primary/30 bg-accent/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1a7070" }}>
                          {ct.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{ct.full_name}</p>
                          <p className="text-xs text-muted-foreground">{t.roomPrefix} {r?.number} · {r ? dict.seedContent.roomType[r.type] ?? r.type : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <StatusBadge status="Checkout" />
                        <span className="text-xs text-muted-foreground">{t.checkoutDate.replace("{date}", fmtDate("2026-04-30", locale))}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Wizard */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-none border border-border">
                <CheckoutWizard
                  tenantName={tenant?.full_name ?? ""}
                  roomLabel={roomLabel}
                  noticeDateFormatted={fmtDate("2026-04-30", locale)}
                  charges={charges}
                  depositFormatted={fmtCurrency(deposit, locale)}
                  totalChargesFormatted={fmtCurrency(totalCharges, locale)}
                  balanceFormatted={fmtCurrency(balance, locale)}
                  balancePositive={balance >= 0}
                />
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
