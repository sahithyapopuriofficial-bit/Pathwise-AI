import { Briefcase } from "lucide-react";

import { getLatestJobRecommendations } from "@/lib/actions/job-recommendations";

import DashboardCard from "@/components/dashboard/DashboardCard";
import JobRecommendationCard from "./JobRecommendationCard";
import GenerateJobRecommendationsButton from "./GenerateJobRecommendationsButton";

export default async function JobRecommendationsSection() {
  const recommendations =
    await getLatestJobRecommendations();

  return (
    <DashboardCard
      title="AI Job & Internship Recommendations"
      description="Personalized opportunities generated using your assessment, resume, interview performance, roadmap progress, and skill gap."
      icon={<Briefcase className="h-6 w-6" />}
    >
      {!recommendations || recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-5 py-12">
          <div className="rounded-full bg-blue-100 p-4">
            <Briefcase className="h-10 w-10 text-blue-600" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">
              No Job Recommendations Yet
            </h3>

            <p className="mx-auto max-w-xl text-sm text-slate-500">
              Generate personalized AI-powered job and internship
              recommendations based on your current profile,
              assessments, resume, roadmap progress, and interview
              performance.
            </p>
          </div>

          <GenerateJobRecommendationsButton />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Recommended Opportunities
              </h3>

              <p className="text-sm text-slate-500">
                {recommendations.length} AI-generated recommendations
              </p>
            </div>

            <GenerateJobRecommendationsButton />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {recommendations.map((recommendation) => (
              <JobRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}