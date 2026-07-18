"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProfileDetails {
  full_name: string | null;
  phone: string | null;
  college: string | null;
  degree: string | null;
  graduation_year: number | null;
  location: string | null;
  target_role: string | null;
  target_company: string | null;
  work_mode: string | null;
  experience_level: string | null;
  profile_photo: string | null;
}

export interface ProfileFormValues {
  fullName: string;
  phone: string;
  college: string;
  degree: string;
  graduationYear: string;
  location: string;
  targetRole: string;
  targetCompany: string;
  workMode: string;
  experienceLevel: string;
}

function getRoadmapWeekCount(generatedPlan: unknown) {
  if (
    typeof generatedPlan === "object" &&
    generatedPlan !== null &&
    "weeks" in generatedPlan &&
    Array.isArray(generatedPlan.weeks)
  ) {
    return generatedPlan.weeks.length;
  }

  return 0;
}

export async function getProfilePageData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profileResult, resumeResult, assessmentResult, interviewResult, roadmapResult] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("resume_analysis")
        .select("ats_score, extracted_skills, ai_summary")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("assessments")
        .select("score")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("mock_interviews")
        .select("overall_score")
        .eq("user_id", user.id)
        .not("overall_score", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("roadmaps")
        .select("id, generated_plan")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const roadmap = roadmapResult.data;
  const progressResult = roadmap
    ? await supabase
        .from("roadmap_progress")
        .select("completed")
        .eq("roadmap_id", roadmap.id)
    : { data: [] as { completed: boolean | null }[] };

  const totalWeeks = getRoadmapWeekCount(roadmap?.generated_plan);
  const completedWeeks =
    progressResult.data?.filter((week) => week.completed).length ?? 0;

  return {
    email: user.email ?? "",
    displayName:
      profileResult.data?.full_name ??
      (typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : user.email?.split("@")[0] ?? "User"),
    profile: profileResult.data as ProfileDetails | null,
    resume: resumeResult.data,
    stats: {
      resumeScore: resumeResult.data?.ats_score ?? 0,
      assessmentScore: assessmentResult.data?.score ?? 0,
      interviewScore: interviewResult.data?.overall_score ?? 0,
      roadmapProgress:
        totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0,
    },
  };
}

// ==============================
// Get Current User Profile
// ==============================

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Get Profile Error:", error.message);
    return null;
  }

  return data;
}

// ==============================
// Get All Career Roles
// ==============================

export async function getCareerRoles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("career_roles")
    .select("*")
    .order("role_name", { ascending: true });

  if (error) {
    console.error("Career Roles Error:", error.message);
    return [];
  }

  return data;
}

// ==============================
// Update Target Career
// ==============================

export async function updateTargetRole(targetRole: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      target_role: targetRole,
    })
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return {
    success: true,
    message: "Career goal updated successfully.",
  };
}

export async function updateProfile(values: Partial<ProfileFormValues>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "User not authenticated." };
  }

  const normalizeText = (value: string | undefined) => value?.trim() || null;
  const graduationYear = normalizeText(values.graduationYear);
  const parsedGraduationYear = graduationYear
    ? Number.parseInt(graduationYear, 10)
    : null;

  if (
    graduationYear &&
    (!Number.isInteger(parsedGraduationYear) || (parsedGraduationYear ?? 0) < 1900)
  ) {
    return { success: false, message: "Enter a valid graduation year." };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: user.id,
      full_name: normalizeText(values.fullName),
      phone: normalizeText(values.phone),
      college: normalizeText(values.college),
      degree: normalizeText(values.degree),
      graduation_year: parsedGraduationYear,
      location: normalizeText(values.location),
      target_role: normalizeText(values.targetRole),
      target_company: normalizeText(values.targetCompany),
      work_mode: normalizeText(values.workMode),
      experience_level: normalizeText(values.experienceLevel),
    }, { onConflict: "user_id" });

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { success: true, message: "Profile updated successfully." };
}

export async function updateProfilePhoto(profilePhoto: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "User not authenticated." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ profile_photo: profilePhoto })
    .eq("user_id", user.id)
    .select("user_id")
    .maybeSingle();

  if (error) return { success: false, message: error.message };
  if (!data) return { success: false, message: "Profile not found." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { success: true, message: "Profile photo updated successfully." };
}

