"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Check, LogOut, FileText, Camera, CreditCard, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDict } from "@/lib/i18n/client";

interface Charge {
  concept: string;
  amountFormatted: string;
}

interface CheckoutWizardProps {
  tenantName: string;
  roomLabel: string;
  noticeDateFormatted: string;
  charges: Charge[];
  depositFormatted: string;
  totalChargesFormatted: string;
  balanceFormatted: string;
  balancePositive: boolean;
}

const STEP_ICONS = [LogOut, Camera, CreditCard, FileText];

export function CheckoutWizard({
  tenantName,
  roomLabel,
  noticeDateFormatted,
  charges,
  depositFormatted,
  totalChargesFormatted,
  balanceFormatted,
  balancePositive,
}: CheckoutWizardProps) {
  const dict = useDict();
  const t = dict.checkout;
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [completed, setCompleted] = useState(false);

  const stepLabels = [t.step1, t.step2, t.step3, t.step4];

  function goTo(target: number) {
    if (target > maxReached) return;
    setDraftSaved(false);
    setStep(target);
  }

  function advance() {
    const next = step + 1;
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
    setDraftSaved(false);
  }

  return (
    <>
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const Icon = STEP_ICONS[i];
          const isDone = stepNum < step || (stepNum === step && completed);
          const isActive = stepNum === step && !completed;
          const isClickable = stepNum <= maxReached;
          return (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => goTo(stepNum)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  isDone ? "bg-primary/10 text-primary" : isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-60"
                )}
              >
                {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                {label}
              </button>
              {i < stepLabels.length - 1 && <div className="w-6 h-px bg-border shrink-0" />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{t.step1Title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{tenantName} · {roomLabel}</p>
          <p className="text-sm text-foreground mb-6">{t.step1Body.replace("{date}", noticeDateFormatted)}</p>
          <button
            type="button"
            onClick={advance}
            className="py-2.5 px-5 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ background: "#1a7070" }}
          >
            {t.confirmNotice}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{t.step2Title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{tenantName} · {roomLabel}</p>
          <p className="text-sm text-foreground mb-6">{t.step2Body}</p>
          <button
            type="button"
            onClick={advance}
            className="py-2.5 px-5 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ background: "#1a7070" }}
          >
            {t.confirmInspection}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{t.step3Title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{tenantName} · {roomLabel}</p>

          <div className="rounded-lg border border-border overflow-hidden mb-4">
            <div className="bg-muted/40 px-4 py-2 grid grid-cols-3 text-xs font-semibold text-muted-foreground">
              <span>{t.colConcept}</span>
              <span className="text-right">{t.colAmount}</span>
              <span className="text-right">{t.colStatus}</span>
            </div>
            {charges.map((c, i) => (
              <div key={i} className="px-4 py-3 grid grid-cols-3 text-sm border-t border-border">
                <span className="text-foreground">{c.concept}</span>
                <span className="text-right font-medium">{c.amountFormatted}</span>
                <span className="text-right"><StatusBadge status="Pendiente" /></span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.depositHeld}</span>
              <span className="font-medium">{depositFormatted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.totalCharges}</span>
              <span className="font-medium text-red-700">— {totalChargesFormatted}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">{t.tenantRefund}</span>
              <span className={cn("font-bold text-base", balancePositive ? "text-green-700" : "text-red-700")}>
                {balanceFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={advance}
              className="py-2.5 px-5 rounded-md text-sm font-semibold text-white transition-colors"
              style={{ background: "#1a7070" }}
            >
              {t.confirmSettlement}
            </button>
            <button
              type="button"
              onClick={() => setDraftSaved(true)}
              className="px-4 py-2.5 rounded-md text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              {t.saveDraft}
            </button>
            {draftSaved && (
              <span className="flex items-center gap-1 text-xs text-green-700">
                <Check className="w-3 h-3" /> {t.draftSaved}
              </span>
            )}
          </div>
        </div>
      )}

      {step === 4 && !completed && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{t.step4Title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{tenantName} · {roomLabel}</p>
          <p className="text-sm text-foreground mb-4">{t.step4Body}</p>
          <div className="flex justify-between text-sm mb-6 p-3 rounded-lg bg-muted/40">
            <span className="font-semibold text-foreground">{t.tenantRefund}</span>
            <span className={cn("font-bold text-base", balancePositive ? "text-green-700" : "text-red-700")}>
              {balanceFormatted}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCompleted(true)}
            className="py-2.5 px-5 rounded-md text-sm font-semibold text-white transition-colors"
            style={{ background: "#1a7070" }}
          >
            {t.completeCheckout}
          </button>
        </div>
      )}

      {step === 4 && completed && (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <PartyPopper className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">{t.checkoutCompleted}</p>
          <p className="text-xs text-muted-foreground">{t.checkoutCompletedBody}</p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground mt-6 text-center">
        {t.demoNote}
      </p>
    </>
  );
}
