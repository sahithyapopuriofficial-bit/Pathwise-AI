import { Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import type { ProfileDetails } from "@/lib/actions/profile";

interface ProfileHeaderProps {
  profile: ProfileDetails | null;
  email: string;
  fullName: string;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";
}

export default function ProfileHeader({ profile, email, fullName }: ProfileHeaderProps) {

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16"><AvatarImage src={profile?.profile_photo ?? undefined} alt={`${fullName}'s profile photo`} /><AvatarFallback className="bg-blue-100 text-lg font-semibold text-blue-700">{initials(fullName)}</AvatarFallback></Avatar>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
            <p className="text-sm text-slate-500">{email}</p>
            <p className="mt-1 text-sm font-medium text-blue-600">{profile?.target_role || "Target role not set"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled title="TODO: Configure a Supabase Storage bucket before enabling photo uploads."><Camera className="h-4 w-4" aria-hidden="true" />Upload Photo</Button>
          <EditProfileDialog profile={profile} />
        </div>
      </CardContent>
    </Card>
  );
}
