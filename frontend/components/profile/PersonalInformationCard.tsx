import { Mail, MapPin, Phone, School, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileDetails } from "@/lib/actions/profile";

interface PersonalInformationCardProps {
  profile: ProfileDetails | null;
  email: string;
  fullName: string;
}

export default function PersonalInformationCard({ profile, email, fullName }: PersonalInformationCardProps) {
  const fields = [
    { label: "Full Name", value: profile?.full_name ?? fullName, icon: UserRound },
    { label: "Email", value: email, icon: Mail },
    { label: "Phone", value: profile?.phone, icon: Phone },
    { label: "College", value: profile?.college, icon: School },
    { label: "Degree", value: profile?.degree, icon: School },
    { label: "Graduation Year", value: profile?.graduation_year?.toString(), icon: School },
    { label: "Location", value: profile?.location, icon: MapPin },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="truncate text-sm font-medium text-slate-800">{value || "Not provided"}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
