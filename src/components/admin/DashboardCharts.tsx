"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartsProps {
  data: { month: string; total: number }[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#737373" }}
            axisLine={{ stroke: "#E5E5E5" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#737373" }}
            axisLine={{ stroke: "#E5E5E5" }}
            tickFormatter={(value) =>
              `$${(value / 1000).toFixed(0)}k`
            }
          />
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toLocaleString("es-AR")}`,
              "Ventas",
            ]}
            contentStyle={{
              background: "#0A0A0A",
              border: "none",
              borderRadius: "4px",
              color: "#FAFAFA",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="total" fill="#0A0A0A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
