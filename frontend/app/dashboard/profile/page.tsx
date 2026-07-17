import { redirect } from "next/navigation";

import AISummaryCard from "@/components/profile/AISummaryCard";
import CareerGoalsCard from "@/components/profile/CareerGoalsCard";
import CareerStats from "@/components/profile/CareerStats";
import PersonalInformationCard from "@/components/profile/PersonalInformationCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SkillsCard from "@/components/profile/SkillsCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getProfilePageData } from "@/lib/actions/profile";

export default async function ProfilePage() {
  const data = await getProfilePageData();

  if (!data) redirect("/login");

  return (
    <DashboardLayout fullName={data.displayName}>
      <div className="space-y-8">
        <ProfileHeader profile={data.profile} email={data.email} fullName={data.displayName} />
        <CareerStats stats={data.stats} />
        <div className="grid gap-6 lg:grid-cols-2">
          <PersonalInformationCard profile={data.profile} email={data.email} fullName={data.displayName} />
          <CareerGoalsCard profile={data.profile} />
        </div>
        <SkillsCard extractedSkills={data.resume?.extracted_skills} />
        <AISummaryCard summary={data.resume?.ai_summary} />
      </div>
    </DashboardLayout>
  );
}
