"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProgressChartsProps {
  resumeHistory: {
    date: string;
    score: number;
  }[];

  interviewHistory: {
    date: string;
    score: number;
  }[];
}

export default function ProgressCharts({
  resumeHistory,
  interviewHistory,
}: ProgressChartsProps) {
  return (
    <section className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Progress Analytics
        </h2>

        <p className="text-muted-foreground">
          Track your improvement over time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Resume Chart */}

        <Card className="rounded-2xl">

          <CardHeader>
            <CardTitle>
              Resume ATS Trend
            </CardTitle>
          </CardHeader>

          <CardContent>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart data={resumeHistory}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

        {/* Interview Chart */}

        <Card className="rounded-2xl">

          <CardHeader>
            <CardTitle>
              Interview Performance
            </CardTitle>
          </CardHeader>

          <CardContent>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart data={interviewHistory}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </div>

    </section>
  );
}