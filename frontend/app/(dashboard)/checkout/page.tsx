import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { tenants, getRoom, getContract, formatCurrency, formatDate } from "@/lib/seed";
import { Check, Circle, Clock, LogOut, FileText, Camera, CreditCard } from "lucide-react";

const CHECKOUT_TENANT_ID = "TENANT-006";

const STEPS = [
  { id: 1, label: "Aviso de salida", icon: LogOut, done: true },
  { id: 2, label: "Inspección", icon: Camera, done: true },
  { id: 3, label: "Liquidación", icon: CreditCard, done: false, active: true },
  { id: 4, label: "Cierre", icon: FileText, done: false },
];

export default function CheckoutPage() {
  const checkoutTenants = tenants.filter((t) => t.status === "Checkout");
  const tenant = checkoutTenants[0];
  const room = tenant ? getRoom(tenant.room_id) : null;
  const contract = tenant ? getContract(tenant.id) : null;

  const charges = [
    { concept: "Colchón — limpieza profunda", amount: 180 },
    { concept: "Toallas — reposición (2 uds.)", amount: 50 },
    { concept: "Pintura — retoque pared", amount: 50 },
  ];
  const totalCharges = charges.reduce((s, c) => s + c.amount, 0);
  const deposit = contract?.deposit ?? 0;
  const balance = deposit - totalCharges;

  return (
    <>
      <TopBar title="Módulo de Checkout" subtitle={`${checkoutTenants.length} salida${checkoutTenants.length !== 1 ? "s" : ""} activa${checkoutTenants.length !== 1 ? "s" : ""}`} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active checkouts list */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Salidas activas</h3>
            <div className="space-y-3">
              {checkoutTenants.map((t) => {
                const r = getRoom(t.room_id);
                return (
                  <Card key={t.id} className="p-4 shadow-none border-2 border-primary/30 bg-accent/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1a7070" }}>
                        {t.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.full_name}</p>
                        <p className="text-xs text-muted-foreground">Hab. {r?.number} · {r?.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status="Checkout" />
                      <span className="text-xs text-muted-foreground">Salida: 30 abr 2026</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Wizard */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-none border border-border">
              {/* Stepper */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {STEPS.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2 shrink-0">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      step.done ? "bg-primary/10 text-primary" :
                      step.active ? "bg-primary text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {step.done ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {step.label}
                    </div>
                    {i < STEPS.length - 1 && <div className="w-6 h-px bg-border shrink-0" />}
                  </div>
                ))}
              </div>

              {/* Step 3: Liquidación content */}
              <h3 className="text-sm font-semibold text-foreground mb-1">Paso 3 — Cargos y liquidación</h3>
              <p className="text-xs text-muted-foreground mb-4">{tenant?.full_name} · Hab. {room?.number} · {room?.type}</p>

              {/* Charges table */}
              <div className="rounded-lg border border-border overflow-hidden mb-4">
                <div className="bg-muted/40 px-4 py-2 grid grid-cols-3 text-xs font-semibold text-muted-foreground">
                  <span>Concepto</span>
                  <span className="text-right">Importe</span>
                  <span className="text-right">Estado</span>
                </div>
                {charges.map((c, i) => (
                  <div key={i} className="px-4 py-3 grid grid-cols-3 text-sm border-t border-border">
                    <span className="text-foreground">{c.concept}</span>
                    <span className="text-right font-medium">{formatCurrency(c.amount)}</span>
                    <span className="text-right"><StatusBadge status="Pendiente" /></span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Settlement summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Depósito retenido</span>
                  <span className="font-medium">{formatCurrency(deposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total cargos</span>
                  <span className="font-medium text-red-700">— {formatCurrency(totalCharges)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Devolución al inquilino</span>
                  <span className={`font-bold text-base ${balance >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {formatCurrency(balance)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 py-2.5 rounded-md text-sm font-semibold text-white transition-colors" style={{ background: "#1a7070" }}>
                  Confirmar liquidación
                </button>
                <button className="px-4 py-2.5 rounded-md text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors">
                  Guardar borrador
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground mt-3 text-center">
                Entorno demo — las acciones no generan cambios reales en la base de datos
              </p>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
