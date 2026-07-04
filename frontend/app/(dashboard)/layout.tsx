import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";
import { getRole } from "@/lib/roles";
import { getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const role = getRole(session?.email);
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar userEmail={session?.email} role={role} />
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </I18nProvider>
  );
}
