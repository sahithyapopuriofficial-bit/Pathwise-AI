import { BriefcaseBusiness, Building2, Signal, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileDetails } from "@/lib/actions/profile";

export default function CareerGoalsCard({ profile }: { profile: ProfileDetails | null }) {
  const goals = [
    { label: "Target Role", value: profile?.target_role, icon: Target },
    { label: "Target Company", value: profile?.target_company, icon: Building2 },
    { label: "Preferred Work Mode", value: profile?.work_mode, icon: BriefcaseBusiness },
    { label: "Experience Level", value: profile?.experience_level, icon: Signal },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Career Goals</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {goals.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="text-sm font-medium text-slate-800">{value || "Not provided"}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
