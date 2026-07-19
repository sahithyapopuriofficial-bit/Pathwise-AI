import { getProgressData } from "@/lib/actions/progress";

import ProgressHero from "@/components/progress/ProgressHero";
import SummaryCards from "@/components/progress/SummaryCards";
import CareerReadinessCard from "@/components/progress/CareerReadinessCard";
import ProgressCharts from "@/components/progress/ProgressCharts";
import Achievements from "@/components/progress/Achievements";
import AIInsights from "@/components/progress/AIInsights";
import NextActions from "@/components/progress/NextActions";

export default async function ProgressPage() {
  const data = await getProgressData();

  if (!data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            Unable to Load Progress
          </h1>

          <p className="mt-3 text-muted-foreground">
            Please login to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8">

      {/* Hero */}
      <ProgressHero
        careerReadiness={data.overview.careerReadiness}
        streak={data.overview.streak}
        learningDays={data.overview.learningDays}
      />

      {/* Summary */}
      <SummaryCards
        summary={data.summary}
      />

      {/* Career Readiness */}
      <CareerReadinessCard
        score={data.overview.careerReadiness}
      />

      {/* Charts */}
      <ProgressCharts
        resumeHistory={data.charts.resumeHistory}
        interviewHistory={data.charts.interviewHistory}
      />

      {/* Achievements */}
      <Achievements
        achievements={data.achievements}
      />

      {/* AI Insights */}
      <AIInsights
        insights={data.aiInsights}
      />

      {/* Next Actions */}
      <NextActions
        actions={data.nextActions}
      />

    </div>
  );
}