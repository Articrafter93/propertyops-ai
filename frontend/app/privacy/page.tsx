import Link from "next/link";
import { Building2, ShieldCheck, Info, ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata() {
  const dict = await getDictionary();
  return {
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
  };
}

export default async function PrivacidadPage() {
  const dict = await getDictionary();
  const t = dict.privacy;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-md" style={{ background: "#1a7070" }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">PropertyOps AI</span>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.backToLogin}
          </Link>
        </div>
      </header>

      {/* Demo notice */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">{t.demoTitle}</p>
            <p className="text-xs text-amber-700">{t.demoBody}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Title */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6" style={{ color: "#1a7070" }} />
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
            <p className="text-xs text-muted-foreground">{t.lastUpdated}</p>
          </div>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">{t.s1Title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.s1Body}</p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">{t.s2Title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.s2Intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {t.s2Items.map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-muted/40 border border-border">
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">{t.s3Title}</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {t.s3Items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a7070] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">{t.s4Title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.s4Body1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.s4Body2}</p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">{t.s5Title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.s5Intro}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {t.s5Rights.map((right) => (
              <div key={right} className="px-3 py-2 rounded-md bg-muted/40 border border-border text-xs font-medium text-foreground text-center">
                {right}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">{t.s5Note}</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">{t.s6Title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.s6Body}</p>
        </section>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <p className="text-[11px] text-muted-foreground text-center">
            {t.footerText}{" "}
            <Link href="/login" className="underline hover:text-foreground">{t.footerLink}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
