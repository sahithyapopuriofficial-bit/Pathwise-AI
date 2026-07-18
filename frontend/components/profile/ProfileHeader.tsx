"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import { updateProfilePhoto, type ProfileDetails } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";

interface ProfileHeaderProps {
  profile: ProfileDetails | null;
  email: string;
  fullName: string;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

function getAvatarStoragePath(publicUrl: string | null, userId: string) {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const marker = "/storage/v1/object/public/avatars/";
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    const path = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
    return path.startsWith(`${userId}/`) ? path : null;
  } catch {
    return null;
  }
}

export default function ProfileHeader({ profile, email, fullName }: ProfileHeaderProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handlePhotoSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_PHOTO_EXTENSIONS.has(extension)) {
      toast.error("Choose a JPG, JPEG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Profile photos must be 5 MB or smaller.");
      return;
    }

    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be signed in to upload a profile photo.");
        return;
      }

      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
        contentType: file.type || undefined,
      });

      if (uploadError) {
        toast.error(uploadError.message || "Unable to upload your profile photo.");
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const newPhotoUrl = publicUrlData.publicUrl;
      const updateResult = await updateProfilePhoto(newPhotoUrl);

      if (!updateResult.success) {
        await supabase.storage.from("avatars").remove([filePath]);
        toast.error(updateResult.message || "Unable to save your profile photo.");
        return;
      }

      const previousPhotoPath = getAvatarStoragePath(profile?.profile_photo ?? null, user.id);
      if (previousPhotoPath) {
        const { error: removeError } = await supabase.storage.from("avatars").remove([previousPhotoPath]);
        if (removeError) console.error("Unable to remove previous profile photo:", removeError.message);
      }

      toast.success(updateResult.message);
      router.refresh();
    } catch (error) {
      console.error("Profile photo upload failed:", error);
      toast.error("Unable to upload your profile photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

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
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={handlePhotoSelected} />
          <Button variant="outline" disabled={isUploading} onClick={() => inputRef.current?.click()}><Camera className="h-4 w-4" aria-hidden="true" />{isUploading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Uploading...</> : "Upload Photo"}</Button>
          <EditProfileDialog profile={profile} />
        </div>
      </CardContent>
    </Card>
  );
}
