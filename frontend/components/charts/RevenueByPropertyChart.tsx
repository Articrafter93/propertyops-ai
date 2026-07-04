"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { RevenueDataPoint } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";

interface Props {
  data: RevenueDataPoint[];
}

export function RevenueByPropertyChart({ data }: Props) {
  const { locale, dict } = useI18n();
  // Month labels are stored in the seed as abbreviations; localize them so the
  // English UI shows "Apr" instead of the seed's "Abr".
  const numberLocale = locale === "es" ? "es-ES" : "en-GB";
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="month" tickFormatter={(m) => dict.seedContent.month[m] ?? m} tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb" }}
          labelFormatter={(m) => dict.seedContent.month[m as string] ?? m}
          formatter={(value, name) => [`€${Number(value).toLocaleString(numberLocale)}`, name === "prop001" ? "Edif. Colón" : "Aparts. Sol"]}
        />
        <Legend formatter={(value) => (value === "prop001" ? "Edif. Colón" : "Aparts. Sol")} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        <Bar dataKey="prop001" fill="#1a7070" radius={[3, 3, 0, 0]} />
        <Bar dataKey="prop002" fill="#2aada0" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
