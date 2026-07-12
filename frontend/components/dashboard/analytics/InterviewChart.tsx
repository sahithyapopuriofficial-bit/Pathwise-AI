"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface InterviewData {
  name: string;
  score: number;
  date: string;
}

interface Props {
  data: InterviewData[];
}

export default function InterviewChart({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Interview Score Trend
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Your AI interview performance over time.
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}