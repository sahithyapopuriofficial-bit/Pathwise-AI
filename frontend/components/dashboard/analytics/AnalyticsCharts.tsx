"use client";

import InterviewChart from "./InterviewChart";
import AssessmentChart from "./AssessmentChart";
import ResumeChart from "./ResumeChart";
import RoadmapChart from "./RoadmapChart";

interface Props {
  charts: {
    interviewChart: any[];
    assessmentChart: any[];
    resumeChart: any[];
    roadmapChart: any[];
  };
}

export default function AnalyticsCharts({ charts }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Analytics Dashboard
        </h2>

        <p className="text-slate-500">
          Visualize your progress across assessments, interviews,
          resumes, and learning roadmaps.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <InterviewChart data={charts.interviewChart} />

        <AssessmentChart data={charts.assessmentChart} />

        <ResumeChart data={charts.resumeChart} />

        <RoadmapChart data={charts.roadmapChart} />
      </div>
    </section>
  );
}