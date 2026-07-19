import {
  Brain,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AIInsightsProps {
  insights: string[];
}

const insightTypes: { icon: LucideIcon; title: string }[] = [
  { icon: Brain, title: "AI Recommendation" },
  { icon: TrendingUp, title: "Growth Opportunity" },
  { icon: Lightbulb, title: "Career Tip" },
  { icon: Sparkles, title: "Personalized Insight" },
];

export default function AIInsights({
  insights,
}: AIInsightsProps) {
  return (
    <section className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          AI Insights
        </h2>

        <p className="text-muted-foreground">
          Personalized recommendations generated from your learning progress.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">

          <Brain className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-4 text-xl font-semibold">
            No Insights Yet
          </h3>

          <p className="mt-2 text-muted-foreground">
            Continue using PathWise AI to receive personalized recommendations.
          </p>

        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">

          {insights.map((insight, index) => {
            const insightType = insightTypes[index % insightTypes.length];
            const Icon = insightType.icon;

            return (
              <div
                key={index}
                className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">

                    <Icon className="h-6 w-6 text-primary" />

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {insightType.title}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      Generated from your recent activity
                    </p>

                  </div>

                </div>

                <p className="mt-5 leading-7 text-muted-foreground">
                  {insight}
                </p>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}
