import { redirect } from "next/navigation";
import {
  BarChart3,
  Brain,
  FileText,
  Map,
  Target,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  getLatestAssessment,
  getRoleSkills,
} from "@/lib/actions/assessment";
import { getDashboardAnalytics } from "@/lib/actions/dashboard-analytics";
import { getProfile, getCareerRoles } from "@/lib/actions/profile";
import { getLatestRoadmap } from "@/lib/actions/roadmap";
import {
  getRoadmapProgress,
} from "@/lib/actions/roadmap-progress";
import { getResumeAnalysis } from "@/lib/actions/resume-analysis";
import { getResumeSkillGap } from "@/lib/actions/resume-skill-gap";
import { getSkillGap } from "@/lib/actions/skill-gap";

import AnalyticsCards from "@/components/dashboard/analytics/AnalyticsCards";
import CareerGoalDialog from "@/components/dashboard/CareerGoalDialog";
import CareerMentorCard from "@/components/dashboard/CareerMentorCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GenerateRoadmapButton from "@/components/dashboard/GenerateRoadmapButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import MockInterviewCard from "@/components/dashboard/MockInterviewCard";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ResumeAnalyzerCard from "@/components/dashboard/ResumeAnalyzerCard";
import ResumeSkillGapCard from "@/components/dashboard/ResumeSkillGapCard";
import ResumeSkillGapTrigger from "@/components/dashboard/ResumeSkillGapTrigger";
import ResumeUpload from "@/components/dashboard/ResumeUpload";
import RoadmapCard from "@/components/dashboard/RoadmapCard";
import SkillAssessmentDialog from "@/components/dashboard/SkillAssessmentDialog";
import SkillGapCard from "@/components/dashboard/SkillGapCard";
import AnalyticsCharts from "@/components/dashboard/analytics/AnalyticsCharts";
import { getDashboardChartData } from "@/lib/actions/dashboard-chart-data";
import { getLatestCareerInsights } from "@/lib/actions/career-insights";
import CareerInsightsCard from "@/components/dashboard/CareerInsightsCard";
import GenerateCareerInsightsButton from "@/components/dashboard/GenerateCareerInsightsButton";
import JobRecommendationsSection from "@/components/dashboard/jobs/JobRecommendationsSection";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    profile,
    careerRoles,
    latestAssessment,
    skillGap,
    latestRoadmap,
    resumeAnalysis,
    resumeSkillGap,
    analytics,
  ] = await Promise.all([
    getProfile(),
    getCareerRoles(),
    getLatestAssessment(),
    getSkillGap(),
    getLatestRoadmap(),
    getResumeAnalysis(),
    getResumeSkillGap(),
    getDashboardAnalytics(),
  ]);

  const targetRole = profile?.target_role ?? null;

  const [skills, progress] = await Promise.all([
    targetRole ? getRoleSkills(targetRole) : Promise.resolve([]),
    latestRoadmap
      ? getRoadmapProgress(latestRoadmap.id)
      : Promise.resolve([]),
  ]);
  const charts = await getDashboardChartData();
  const careerInsights = await getLatestCareerInsights();
  const fullName =
    profile?.full_name ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "User";

  return (
    <DashboardLayout fullName={fullName}>
      <div className="space-y-10">
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl sm:p-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome back,
          </h1>

          <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">
            {fullName} 👋
          </h2>

          <p className="mt-4 max-w-2xl text-blue-100">
            Welcome to PathWise AI — your personal AI-powered career mentor.
            Analyze your skills, generate personalized learning roadmaps,
            improve your resume, and achieve your dream career.
          </p>

          <div className="mt-6 inline-flex rounded-xl bg-white/20 px-4 py-2">
            <span className="font-medium">{user.email}</span>
          </div>
        </section>

        {analytics && (
          <section>
            <AnalyticsCards analytics={analytics} />
          </section>
        )}
        {charts && (
  <AnalyticsCharts charts={charts} />
)}
        {/* AI Career Insights */}

<section className="mt-8">
  {careerInsights ? (
    <CareerInsightsCard insights={careerInsights} />
  ) : (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-bold">
        AI Career Insights
      </h2>

      <p className="mb-6 text-slate-500">
        Generate personalized AI insights based on your assessment,
        resume, interview performance, and roadmap progress.
      </p>

      <GenerateCareerInsightsButton />
    </div>
  )}
</section>

        <section>
          <JobRecommendationsSection />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardCard
            title="Career Goal"
            description="Choose your dream career path."
            icon={<Target className="h-6 w-6" />}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">
                  {targetRole ?? "Not Selected Yet"}
                </p>

                <p className="text-sm text-slate-500">
                  Your selected career
                </p>
              </div>

              <CareerGoalDialog
                roles={careerRoles}
                currentRole={targetRole}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            title="Skill Assessment"
            description="Evaluate your skills for your chosen career."
            icon={<BarChart3 className="h-6 w-6" />}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-blue-600">
                    {latestAssessment?.score ?? 0}%
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Latest Assessment Score
                  </p>
                </div>

                <ProgressRing
                  percentage={latestAssessment?.score ?? 0}
                  size={110}
                />
              </div>

              {targetRole ? (
                <SkillAssessmentDialog
                  roleName={targetRole}
                  skills={skills}
                />
              ) : (
                <p className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
                  Select a Career Goal before starting the assessment.
                </p>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Learning Roadmap"
            description="Generate a personalized AI roadmap."
            icon={<Map className="h-6 w-6" />}
          >
            <GenerateRoadmapButton role={targetRole} />
          </DashboardCard>

          <DashboardCard
            title="Resume Analyzer"
            description="Upload your resume for AI analysis."
            icon={<FileText className="h-6 w-6" />}
          >
            <ResumeUpload />
          </DashboardCard>
        </section>

        {skillGap && (
          <section>
            <SkillGapCard
              score={skillGap.score}
              strong={skillGap.strong}
              improving={skillGap.improving}
              weak={skillGap.weak}
              nextSkill={skillGap.nextSkill}
            />
          </section>
        )}

        {latestRoadmap && (
          <section>
            <RoadmapCard
              roadmapId={latestRoadmap.id}
              roadmap={latestRoadmap.generated_plan}
              estimatedDuration={
                latestRoadmap.generated_plan?.estimated_duration ??
                latestRoadmap.estimated_duration
              }
              progress={progress}
            />
          </section>
        )}

        {resumeAnalysis && (
          <section>
            <ResumeAnalyzerCard analysis={resumeAnalysis} />
          </section>
        )}

        {resumeAnalysis && (
          <section>
            <DashboardCard
              title="Resume Skill Gap Analysis"
              description="Compare your resume skills with your selected career role using AI."
              icon={<Brain className="h-6 w-6" />}
            >
              <ResumeSkillGapTrigger />
            </DashboardCard>
          </section>
        )}

        {resumeSkillGap && (
          <section>
            <ResumeSkillGapCard analysis={resumeSkillGap} />
          </section>
        )}

        <section>
          <CareerMentorCard />
        </section>

        <section>
          <MockInterviewCard />
        </section>

        <div className="flex justify-end pt-2">
          <LogoutButton />
        </div>
      </div>
    </DashboardLayout>
  );
}
