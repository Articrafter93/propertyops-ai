"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { RevenueDataPoint } from "@/lib/types";

interface Props {
  data: RevenueDataPoint[];
}

export function RevenueByPropertyChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb" }}
          formatter={(value, name) => [`€${Number(value).toLocaleString("es-ES")}`, name === "prop001" ? "Edif. Colón" : "Aparts. Sol"]}
        />
        <Legend formatter={(value) => (value === "prop001" ? "Edif. Colón" : "Aparts. Sol")} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        <Bar dataKey="prop001" fill="#1a7070" radius={[3, 3, 0, 0]} />
        <Bar dataKey="prop002" fill="#2aada0" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
