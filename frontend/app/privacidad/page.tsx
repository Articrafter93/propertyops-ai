import Link from "next/link";
import { Building2, ShieldCheck, Info, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad — PropertyOps AI",
  description: "Información sobre el tratamiento de datos en el entorno demo de PropertyOps AI.",
};

export default function PrivacidadPage() {
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
            Volver al login
          </Link>
        </div>
      </header>

      {/* Demo notice */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">Entorno de demostración sandbox</p>
            <p className="text-xs text-amber-700">
              Todos los datos manejados en esta demo son <strong>ficticios</strong>: nombres, emails, DNIs,
              teléfonos y contratos son inventados y no corresponden a personas reales. Esta política
              describe el patrón de privacidad que se aplicaría en un entorno de producción real.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Title */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6" style={{ color: "#1a7070" }} />
          <div>
            <h1 className="text-xl font-bold text-foreground">Política de Privacidad</h1>
            <p className="text-xs text-muted-foreground">Última actualización: 25 de junio de 2026</p>
          </div>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            1. Responsable del tratamiento
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El responsable del tratamiento de los datos personales gestionados a través de esta plataforma
            es el administrador de propiedades que la opera. En este entorno de demo, el responsable es
            Antigravity Projects (proyecto de portafolio; datos ficticios).
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            2. Datos personales tratados
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            La plataforma gestiona las siguientes categorías de datos de inquilinos y candidatos:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "Datos identificativos", detail: "Nombre completo, DNI/NIE, fecha de nacimiento" },
              { label: "Datos de contacto", detail: "Email, teléfono, dirección" },
              { label: "Datos económicos", detail: "Historial de pagos, estado de cobros" },
              { label: "Datos de uso del inmueble", detail: "Fechas de entrada/salida, habitación asignada" },
              { label: "Documentación contractual", detail: "Contratos de alquiler, fianzas" },
              { label: "Datos de incidencias", detail: "Descripción, fotos adjuntas, estado" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-muted/40 border border-border">
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            3. Finalidad del tratamiento
          </h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {[
              "Gestión del ciclo de alquiler por habitación (onboarding, contrato, cobros, salida).",
              "Comunicación con candidatos e inquilinos sobre su expediente.",
              "Gestión y resolución de incidencias del inmueble.",
              "Generación de informes operativos para el administrador.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a7070] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            4. Base legal y retención
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            La base legal del tratamiento es la ejecución de un contrato de arrendamiento (art. 6.1.b RGPD)
            y el cumplimiento de obligaciones legales (Ley de Arrendamientos Urbanos, normativa fiscal).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Los datos se conservan durante la vigencia del contrato y <strong>hasta 5 años después</strong> de
            su finalización, conforme a los plazos de prescripción legales en materia civil y fiscal.
            Transcurrido ese plazo, los datos se eliminan de forma segura o se anonimiza.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            5. Derechos del interesado
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Conforme al RGPD y la Ley 1581 de 2012 (si aplica), tienes derecho a:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Acceso", "Rectificación", "Supresión", "Portabilidad", "Oposición", "Limitación"].map((right) => (
              <div key={right} className="px-3 py-2 rounded-md bg-muted/40 border border-border text-xs font-medium text-foreground text-center">
                {right}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Para ejercer tus derechos, contacta al administrador a través del canal comunicado en tu contrato.
            En este entorno de demo, los datos son ficticios y no corresponden a personas reales.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
            6. Seguridad de los datos
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La plataforma aplica medidas de seguridad técnicas y organizativas proporcionadas al riesgo:
            autenticación segura (Supabase Auth), control de acceso por rol (administrador / técnico),
            transmisión cifrada (HTTPS/TLS) y aislamiento de datos por proyecto. El acceso técnico queda
            limitado al mínimo privilegio necesario.
          </p>
        </section>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <p className="text-[11px] text-muted-foreground text-center">
            PropertyOps AI · Proyecto de portafolio sandbox ·{" "}
            <Link href="/login" className="underline hover:text-foreground">Volver al inicio</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
