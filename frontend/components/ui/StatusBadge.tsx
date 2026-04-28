import { cn } from "@/lib/utils";

type Variant = "room" | "tenant" | "lead" | "contract" | "payment" | "incident-priority" | "incident-status" | "automation";

const statusMap: Record<string, { label: string; classes: string }> = {
  /* Room status */
  Available: { label: "Disponible", classes: "bg-green-50 text-green-700 border-green-200" },
  Occupied: { label: "Ocupada", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  Maintenance: { label: "Mantenimiento", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  Cleaning: { label: "Limpieza", classes: "bg-purple-50 text-purple-700 border-purple-200" },
  /* Tenant status */
  Active: { label: "Activo", classes: "bg-green-50 text-green-700 border-green-200" },
  Checkout: { label: "Salida", classes: "bg-orange-50 text-orange-700 border-orange-200" },
  Archive: { label: "Archivado", classes: "bg-gray-100 text-gray-500 border-gray-200" },
  /* Lead status */
  "Auto-Aprobado": { label: "Auto-Aprobado", classes: "bg-green-50 text-green-700 border-green-200" },
  "Revisión Manual": { label: "En Revisión", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  Rechazado: { label: "Rechazado", classes: "bg-red-50 text-red-700 border-red-200" },
  "Contrato Enviado": { label: "Contrato Enviado", classes: "bg-teal-50 text-teal-700 border-teal-200" },
  /* Contract */
  Firmado: { label: "Firmado", classes: "bg-green-50 text-green-700 border-green-200" },
  Borrador: { label: "Borrador", classes: "bg-gray-100 text-gray-600 border-gray-200" },
  Vencido: { label: "Vencido", classes: "bg-red-50 text-red-700 border-red-200" },
  /* Payment */
  Pagado: { label: "Pagado", classes: "bg-green-50 text-green-700 border-green-200" },
  Pendiente: { label: "Pendiente", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  /* Incident priority */
  Baja: { label: "Baja", classes: "bg-gray-100 text-gray-600 border-gray-200" },
  Media: { label: "Media", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  Alta: { label: "Alta", classes: "bg-orange-50 text-orange-700 border-orange-200" },
  Emergencia: { label: "Emergencia", classes: "bg-red-50 text-red-700 border-red-200" },
  /* Incident status */
  Abierta: { label: "Abierta", classes: "bg-red-50 text-red-700 border-red-200" },
  "En Proceso": { label: "En Proceso", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  Resuelta: { label: "Resuelta", classes: "bg-green-50 text-green-700 border-green-200" },
  Cerrada: { label: "Cerrada", classes: "bg-gray-100 text-gray-500 border-gray-200" },
  /* Automation */
  Activo: { label: "Activo", classes: "bg-green-50 text-green-700 border-green-200" },
  Pausado: { label: "Pausado", classes: "bg-gray-100 text-gray-600 border-gray-200" },
  Error: { label: "Error", classes: "bg-red-50 text-red-700 border-red-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] ?? { label: status, classes: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", config.classes, className)}>
      {config.label}
    </span>
  );
}
