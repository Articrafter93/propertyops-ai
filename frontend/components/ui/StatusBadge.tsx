"use client";

import { cn } from "@/lib/utils";
import { useDict } from "@/lib/i18n/client";

const classMap: Record<string, string> = {
  /* Room status */
  Available: "bg-green-50 text-green-700 border-green-200",
  Occupied: "bg-blue-50 text-blue-700 border-blue-200",
  Maintenance: "bg-amber-50 text-amber-700 border-amber-200",
  Cleaning: "bg-purple-50 text-purple-700 border-purple-200",
  /* Tenant status */
  Active: "bg-green-50 text-green-700 border-green-200",
  Checkout: "bg-orange-50 text-orange-700 border-orange-200",
  Archive: "bg-gray-100 text-gray-500 border-gray-200",
  /* Lead status */
  "Auto-Aprobado": "bg-green-50 text-green-700 border-green-200",
  "Revisión Manual": "bg-amber-50 text-amber-700 border-amber-200",
  Rechazado: "bg-red-50 text-red-700 border-red-200",
  "Contrato Enviado": "bg-teal-50 text-teal-700 border-teal-200",
  /* Contract */
  Firmado: "bg-green-50 text-green-700 border-green-200",
  Borrador: "bg-gray-100 text-gray-600 border-gray-200",
  Vencido: "bg-red-50 text-red-700 border-red-200",
  /* Payment */
  Pagado: "bg-green-50 text-green-700 border-green-200",
  Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  /* Incident priority */
  Baja: "bg-gray-100 text-gray-600 border-gray-200",
  Media: "bg-amber-50 text-amber-700 border-amber-200",
  Alta: "bg-orange-50 text-orange-700 border-orange-200",
  Emergencia: "bg-red-50 text-red-700 border-red-200",
  /* Incident status */
  Abierta: "bg-red-50 text-red-700 border-red-200",
  "En Proceso": "bg-blue-50 text-blue-700 border-blue-200",
  Resuelta: "bg-green-50 text-green-700 border-green-200",
  Cerrada: "bg-gray-100 text-gray-500 border-gray-200",
  /* Automation */
  Activo: "bg-green-50 text-green-700 border-green-200",
  Pausado: "bg-gray-100 text-gray-600 border-gray-200",
  Error: "bg-red-50 text-red-700 border-red-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const dict = useDict();
  const label = (dict.statuses as Record<string, string>)[status] ?? status;
  const classes = classMap[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", classes, className)}>
      {label}
    </span>
  );
}
