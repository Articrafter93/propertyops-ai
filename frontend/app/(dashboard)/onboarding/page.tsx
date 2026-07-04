import { TopBar } from "@/components/layout/TopBar";
import { getLeads } from "@/lib/data";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { OnboardingBoard } from "./OnboardingBoard";

export default async function OnboardingPage() {
  const [leads, dict, locale] = await Promise.all([getLeads(), getDictionary(), getLocale()]);
  const t = dict.onboarding;

  const allLeads = leads.length;
  const approved = leads.filter((l) => l.status === "Auto-Aprobado" || l.status === "Contrato Enviado").length;
  const rejected = leads.filter((l) => l.status === "Rechazado").length;

  return (
    <>
      <TopBar title={t.title} subtitle={t.subtitle.replace("{total}", String(allLeads)).replace("{approved}", String(approved)).replace("{rejected}", String(rejected))} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <OnboardingBoard leads={leads} locale={locale} />
      </main>
    </>
  );
}
