"use server";

import { revalidatePath } from "next/cache";

import {
  generateJobRecommendations,
  type JobRecommendation,
  type JobRecommendationInput,
} from "@/lib/ai/job-recommendations";
import { createClient } from "@/lib/supabase/server";

export interface JobRecommendationRecord {
  id: string;
  user_id: string;
  company: string;
  job_title: string;
  target_role: string;
  employment_type: string;
  work_mode: string;
  location: string;
  match_score: number;
  required_skills: string[];
  missing_skills: string[];
  job_description: string;
  apply_url: string;
  source: string;
  created_at: string;
}

export type GenerateJobRecommendationsResult =
  | { success: true; recommendations: JobRecommendationRecord[] }
  | { success: false; message: string };

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function hasValidRecommendation(job: JobRecommendation): boolean {
  return (
    typeof job.company === "string" &&
    job.company.trim().length > 0 &&
    typeof job.job_title === "string" &&
    job.job_title.trim().length > 0 &&
    typeof job.employment_type === "string" &&
    job.employment_type.trim().length > 0 &&
    typeof job.work_mode === "string" &&
    job.work_mode.trim().length > 0 &&
    typeof job.location === "string" &&
    job.location.trim().length > 0 &&
    Number.isInteger(job.match_score) &&
    job.match_score >= 0 &&
    job.match_score <= 100 &&
    Array.isArray(job.required_skills) &&
    Array.isArray(job.missing_skills) &&
    typeof job.job_description === "string" &&
    job.job_description.trim().length > 0 &&
    typeof job.apply_url === "string" &&
    job.apply_url.trim().length > 0 &&
    typeof job.source === "string" &&
    job.source.trim().length > 0
  );
}

export async function generateAndSaveJobRecommendations(): Promise<GenerateJobRecommendationsResult> {
  console.info("[job-recommendations] Server action started");

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[job-recommendations] Authentication failed", authError);
    return { success: false, message: "Your session has expired. Please sign in again." };
  }

  console.info("[job-recommendations] Authentication completed", { userId: user.id });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, target_role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[job-recommendations] Profile query failed", profileError);
    return { success: false, message: `Unable to load your profile: ${profileError.message}` };
  }

  const targetRole = profile?.target_role?.trim();
  if (!targetRole) {
    return { success: false, message: "Select a career goal before generating recommendations." };
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("user_id, score, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (assessmentError) {
    console.error("[job-recommendations] Assessment query failed", assessmentError);
    return { success: false, message: `Unable to load your assessment: ${assessmentError.message}` };
  }

  const { data: interview, error: interviewError } = await supabase
    .from("mock_interviews")
    .select("user_id, overall_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (interviewError) {
    console.error("[job-recommendations] Interview query failed", interviewError);
    return { success: false, message: `Unable to load your mock interview: ${interviewError.message}` };
  }

  const { data: resume, error: resumeError } = await supabase
    .from("resume_analysis")
    .select("user_id, ats_score, uploaded_at")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (resumeError) {
    console.error("[job-recommendations] Resume query failed", resumeError);
    return { success: false, message: `Unable to load your resume analysis: ${resumeError.message}` };
  }

  const { data: roadmap, error: roadmapError } = await supabase
    .from("roadmaps")
    .select("id, user_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (roadmapError) {
    console.error("[job-recommendations] Roadmap query failed", roadmapError);
    return { success: false, message: `Unable to load your roadmap: ${roadmapError.message}` };
  }

  const { data: skillGap, error: skillGapError } = await supabase
    .from("skill_gap_analysis")
    .select("user_id, matched_skills, recommended_skills, missing_skills, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (skillGapError) {
    console.error("[job-recommendations] Skill gap query failed", skillGapError);
    return { success: false, message: `Unable to load your skill gap analysis: ${skillGapError.message}` };
  }

  let roadmapProgress: { completed: boolean | null }[] = [];
  if (roadmap) {
    const { data, error } = await supabase
      .from("roadmap_progress")
      .select("roadmap_id, completed")
      .eq("roadmap_id", roadmap.id);

    if (error) {
      console.error("[job-recommendations] Roadmap progress query failed", error);
      return { success: false, message: `Unable to load roadmap progress: ${error.message}` };
    }

    roadmapProgress = data ?? [];
  }

  const input: JobRecommendationInput = {
    targetRole,
    assessmentScore: toScore(assessment?.score),
    interviewScore: toScore(interview?.overall_score),
    resumeScore: toScore(resume?.ats_score),
    roadmapProgress: roadmapProgress.length
      ? Math.round((roadmapProgress.filter((week) => week.completed).length / roadmapProgress.length) * 100)
      : 0,
    strongSkills: toStringArray(skillGap?.matched_skills),
    weakSkills: toStringArray(skillGap?.recommended_skills),
    missingSkills: toStringArray(skillGap?.missing_skills),
  };

  console.info("[job-recommendations] Data loaded", {
    userId: user.id,
    targetRole,
    roadmapWeeks: roadmapProgress.length,
  });

  let generatedRecommendations: JobRecommendation[];
  try {
    console.info("[job-recommendations] Gemini request started");
    generatedRecommendations = await generateJobRecommendations(input);
    console.info("[job-recommendations] Gemini response received", {
      count: generatedRecommendations.length,
    });
  } catch (error) {
    console.error("[job-recommendations] Gemini request failed", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to generate job recommendations.",
    };
  }

  if (!generatedRecommendations.length || !generatedRecommendations.every(hasValidRecommendation)) {
    return { success: false, message: "Gemini returned incomplete job recommendation data." };
  }

  const { error: deleteError } = await supabase
    .from("job_recommendations")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("[job-recommendations] Delete failed", deleteError);
    return { success: false, message: `Unable to replace previous recommendations: ${deleteError.message}` };
  }

  console.info("[job-recommendations] Delete completed", { userId: user.id });

  const { data: insertedRecommendations, error: insertError } = await supabase
    .from("job_recommendations")
    .insert(
      generatedRecommendations.map((job) => ({
        user_id: user.id,
        company: job.company,
        job_title: job.job_title,
        target_role: targetRole,
        employment_type: job.employment_type,
        work_mode: job.work_mode,
        location: job.location,
        match_score: job.match_score,
        required_skills: job.required_skills,
        missing_skills: job.missing_skills,
        job_description: job.job_description,
        apply_url: job.apply_url,
        source: job.source,
      }))
    )
    .select(
      "id, user_id, company, job_title, target_role, employment_type, work_mode, location, match_score, required_skills, missing_skills, job_description, apply_url, source, created_at"
    );

  if (insertError || !insertedRecommendations) {
    console.error("[job-recommendations] Insert failed", insertError);
    return {
      success: false,
      message: `Unable to save job recommendations: ${insertError?.message ?? "No recommendations were returned."}`,
    };
  }

  console.info("[job-recommendations] Insert completed", {
    userId: user.id,
    count: insertedRecommendations.length,
  });

  revalidatePath("/dashboard");
  return { success: true, recommendations: insertedRecommendations };
}

export async function getLatestJobRecommendations(): Promise<JobRecommendationRecord[]> {
  console.info("[job-recommendations] Dashboard fetch started");

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[job-recommendations] Dashboard authentication failed", authError);
    return [];
  }

  const { data, error } = await supabase
    .from("job_recommendations")
    .select(
      "id, user_id, company, job_title, target_role, employment_type, work_mode, location, match_score, required_skills, missing_skills, job_description, apply_url, source, created_at"
    )
    .eq("user_id", user.id)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("[job-recommendations] Dashboard fetch failed", error);
    return [];
  }

  const recommendations = data ?? [];
  console.info("[job-recommendations] Dashboard fetch completed", {
    userId: user.id,
    count: recommendations.length,
  });
  return recommendations;
}
