import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  getLatestCareerInsights,
  type CareerInsights,
} from "@/lib/actions/career-insights";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CareerInsightsCardProps {
  insights?: CareerInsights | null;
}

interface InsightListProps {
  icon: ReactNode;
  items: string[];
  emptyMessage: string;
  className: string;
}

function InsightList({
  icon,
  items,
  emptyMessage,
  className,
}: InsightListProps) {
  return (
    <ul className="space-y-3">
      {items.length === 0 ? (
        <li className="text-sm text-muted-foreground">{emptyMessage}</li>
      ) : (
        items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"
          >
            <span className={`mt-1 shrink-0 ${className}`}>{icon}</span>
            <span>{item}</span>
          </li>
        ))
      )}
    </ul>
  );
}

export default async function CareerInsightsCard({
  insights: providedInsights,
}: CareerInsightsCardProps) {
  const insights = providedInsights ?? (await getLatestCareerInsights());

  if (!insights) {
    return (
      <Card className="border-dashed bg-gradient-to-br from-white to-indigo-50/50 shadow-sm">
        <CardContent className="flex min-h-52 flex-col items-center justify-center p-6 text-center sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            AI Career Insights
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Generate a personalized view of your career readiness, strengths,
            and the actions that will move you forward.
          </p>
        </CardContent>
      </Card>
    );
  }

  const readinessScore = Math.max(
    0,
    Math.min(100, Math.round(insights.readiness_score))
  );

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 via-white to-blue-50">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-xl text-slate-900">
              AI Career Insights
            </CardTitle>
            <CardDescription className="mt-1">
              Your personalized readiness snapshot and next best actions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-7 pt-6">
        <section className="grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
          <div className="rounded-2xl bg-indigo-50 p-5 text-center ring-1 ring-indigo-100">
            <p className="text-xs font-semibold tracking-wide text-indigo-700 uppercase">
              Career Readiness
            </p>
            <p className="mt-1 text-5xl font-bold tracking-tight text-indigo-600">
              {readinessScore}%
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900">AI Summary</h3>
            </div>
            <p className="mt-3 leading-7 text-slate-600">
              {insights.summary}
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">Strengths</h3>
              <Badge className="ml-auto bg-emerald-600">{insights.strengths.length}</Badge>
            </div>
            <InsightList
              icon={<CheckCircle2 className="h-4 w-4" />}
              items={insights.strengths}
              emptyMessage="Generate insights to identify your strengths."
              className="text-emerald-600"
            />
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Areas to Improve</h3>
              <Badge className="ml-auto bg-amber-600">{insights.weaknesses.length}</Badge>
            </div>
            <InsightList
              icon={<TrendingUp className="h-4 w-4" />}
              items={insights.weaknesses}
              emptyMessage="No improvement areas were identified yet."
              className="text-amber-600"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-950">Next Steps</h3>
          </div>
          <InsightList
            icon={<ArrowRight className="h-4 w-4" />}
            items={insights.next_steps}
            emptyMessage="Generate insights to receive recommended next steps."
            className="text-blue-600"
          />
        </section>
      </CardContent>
    </Card>
  );
}
import type { ReactNode } from "react";
