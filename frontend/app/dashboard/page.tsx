import { redirect } from "next/navigation";
import {
  Target,
  BarChart3,
  Map,
  FileText,
  Bot,
  Trophy,
  Briefcase,
  Brain,
 Route,
  MessageSquare,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  getLatestAssessment,
  getRoleSkills,
} from "@/lib/actions/assessment";
import SkillAssessmentDialog from "@/components/dashboard/SkillAssessmentDialog";
import { getProfile, getCareerRoles } from "@/lib/actions/profile";
import CareerGoalDialog from "@/components/dashboard/CareerGoalDialog";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatsCard from "@/components/dashboard/StatsCard";
import ProgressRing from "@/components/dashboard/ProgressRing";
import LogoutButton from "@/components/dashboard/LogoutButton";
import DashboardActionButton from "@/components/dashboard/DashboardActionButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();
const careerRoles = await getCareerRoles();
const latestAssessment = await getLatestAssessment();

const fullName =
  profile?.full_name ??
  user.user_metadata?.full_name ??
  user.email?.split("@")[0] ??
  "User";

const targetRole = profile?.target_role ?? null;

const skills = targetRole
  ? await getRoleSkills(targetRole)
  : [];

  return (
    <DashboardLayout fullName={fullName}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold">
            Welcome back,
          </h1>

          <h2 className="mt-2 text-5xl font-extrabold">
            {fullName} 👋
          </h2>

          <p className="mt-4 max-w-2xl text-blue-100">
            Welcome to PathWise AI — your personal AI-powered
            career mentor. Analyze your skills, generate
            personalized learning roadmaps, improve your
            resume, and achieve your dream career.
          </p>

          <div className="mt-6 inline-flex rounded-xl bg-white/20 px-4 py-2">
            <span className="font-medium">
              {user.email}
            </span>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
  title="Career Goal"
  value={targetRole ?? "Not Set"}
  subtitle="Choose your target career"
  icon={<Briefcase className="h-6 w-6" />}
/>

          <StatsCard
            title="Skills Learned"
            value="0"
            subtitle="Skills completed"
            icon={<Brain className="h-6 w-6" />}
          />

          <StatsCard
            title="Roadmaps"
            value="0"
            subtitle="Learning paths created"
            icon={<Route className="h-6 w-6" />}
          />

          <StatsCard
            title="AI Sessions"
            value="0"
            subtitle="Career mentor chats"
            icon={<MessageSquare className="h-6 w-6" />}
          />
        </section>

        {/* Dashboard Features */}
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardCard
  title="Career Goal"
  description="Choose your dream career path."
  icon={<Target className="h-6 w-6" />}
>
  <div className="flex items-center justify-between">
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
        Select a Career Goal before starting the
        assessment.
      </p>
    )}
  </div>
</DashboardCard>

          <DashboardCard
            title="Learning Roadmap"
            description="Generate a personalized AI roadmap."
            icon={<Map className="h-6 w-6" />}
          >
            <DashboardActionButton>
              Generate Roadmap →
            </DashboardActionButton>
          </DashboardCard>

          <DashboardCard
            title="Resume Analyzer"
            description="Upload your resume for AI feedback."
            icon={<FileText className="h-6 w-6" />}
          >
            <DashboardActionButton>
              Upload Resume →
            </DashboardActionButton>
          </DashboardCard>

          <DashboardCard
            title="AI Career Mentor"
            description="Chat with your personal AI mentor."
            icon={<Bot className="h-6 w-6" />}
          >
            <DashboardActionButton>
              Ask AI →
            </DashboardActionButton>
          </DashboardCard>

          <DashboardCard
            title="Profile Completion"
            description="Complete your profile."
            icon={<Trophy className="h-6 w-6" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">
                  20%
                </span>

                <span className="text-sm text-slate-500">
                  Completed
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-1/5 rounded-full bg-yellow-500" />
              </div>
            </div>
          </DashboardCard>
        </section>

        {/* Logout */}
        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </DashboardLayout>
  );
}

