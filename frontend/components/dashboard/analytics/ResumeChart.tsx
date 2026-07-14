"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
 Tooltip,
  CartesianGrid,
} from "recharts";

interface Props { data: { name: string; score: number; date: string }[]; }

export default function ResumeChart({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Resume Score History
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        AI resume score over time.
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              fill="#93c5fd"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
