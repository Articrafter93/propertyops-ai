"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { KpiDataPoint } from "@/lib/types";

interface Props {
  data: KpiDataPoint[];
}

export function OccupancyTrendChart({ data }: Props) {
  const chartData = data.slice(-14).map((d) => ({
    date: d.date.slice(5),
    ocupacion: d.occupancy_rate,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1a7070" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1a7070" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} interval={2} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          formatter={(value) => [`${value}%`, "Ocupación"]}
        />
        <Area type="monotone" dataKey="ocupacion" stroke="#1a7070" strokeWidth={2} fill="url(#tealGradient)" dot={false} activeDot={{ r: 4, fill: "#1a7070" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
