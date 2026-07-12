"use server";

import { revalidatePath } from "next/cache";

import {
  generateJobRecommendations,
  type JobRecommendation,
  type JobRecommendationInput,
} from "@/lib/ai/job-recommendations";
import { createClient } from "@/lib/supabase/server";

export interface JobRecommendationRecord extends JobRecommendation {
  id: string;
  user_id: string;
}

export type GenerateJobRecommendationsResult =
  | {
      success: true;
      recommendations: JobRecommendationRecord[];
    }
  | {
      success: false;
      message: string;
    };

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string"
  );
}

function toScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : 0;
}

export async function generateAndSaveJobRecommendations(): Promise<GenerateJobRecommendationsResult> {
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

  const [
    profileResult,
    assessmentResult,
    interviewResult,
    resumeResult,
    roadmapResult,
    skillGapResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("target_role")
      .eq("user_id", user.id)
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
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("resume_analysis")
      .select("ats_score, ai_summary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("roadmaps")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("skill_gap_analysis")
      .select("strong_skills, weak_skills, missing_skills")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const roadmapProgressResult = roadmapResult.data
    ? await supabase
        .from("roadmap_progress")
        .select("completed")
        .eq("roadmap_id", roadmapResult.data.id)
    : { data: [] as { completed: boolean | null }[] };

  const roadmapProgress = roadmapProgressResult.data ?? [];

  const completedWeeks = roadmapProgress.filter(
    (week) => week.completed === true
  ).length;

  const input: JobRecommendationInput = {
    targetRole: profileResult.data?.target_role ?? "Not Selected",
    assessmentScore: toScore(assessmentResult.data?.score),
    interviewScore: toScore(interviewResult.data?.overall_score),
    resumeScore: toScore(resumeResult.data?.ats_score),
    roadmapProgress:
      roadmapProgress.length > 0
        ? Math.round(
            (completedWeeks / roadmapProgress.length) * 100
          )
        : 0,
    strongSkills: toStringArray(
      skillGapResult.data?.strong_skills
    ),
    weakSkills: toStringArray(
      skillGapResult.data?.weak_skills
    ),
    missingSkills: toStringArray(
      skillGapResult.data?.missing_skills
    ),
  };

  let generated: JobRecommendation[];

  try {
    generated = await generateJobRecommendations(input);
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Unable to generate job recommendations.",
    };
  }

  const { error: deleteError } = await supabase
    .from("job_recommendations")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return {
      success: false,
      message:
        deleteError.message ??
        "Unable to save job recommendations.",
    };
  }

  const { data, error } = await supabase
    .from("job_recommendations")
    .insert(
      generated.map((job) => ({
        user_id: user.id,
        company: job.company,
        job_title: job.job_title,
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
    .select(`
id,
user_id,
company,
job_title,
employment_type,
work_mode,
location,
match_score,
required_skills,
missing_skills,
job_description,
apply_url,
source
`)

  if (error || !data) {
    return {
      success: false,
      message:
        error?.message ??
        "Unable to save job recommendations.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    recommendations: data.map((job) => ({
      id: job.id,
      user_id: job.user_id,
      company: job.company,
      job_title: job.job_title,
      employment_type: job.employment_type,
      work_mode: job.work_mode,
      location: job.location,
      match_score: job.match_score,
      required_skills: job.required_skills ?? [],
      missing_skills: job.missing_skills ?? [],
      job_description: job.job_description,
      apply_url: job.apply_url,
      source: job.source,
    })),
  };
}

export async function getLatestJobRecommendations(): Promise<JobRecommendationRecord[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("job_recommendations")
    .select(
      `
      id,
      user_id,
      company,
      job_title,
      employment_type,
      work_mode,
      location,
      match_score,
      required_skills,
      missing_skills,
      job_description,
      apply_url,
      source
    `
    )
    .eq("user_id", user.id)
    .order("match_score", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((job) => ({
    id: job.id,
    user_id: job.user_id,
    company: job.company,
    job_title: job.job_title,
    employment_type: job.employment_type,
    work_mode: job.work_mode,
    location: job.location,
    match_score: job.match_score,
    required_skills: job.required_skills ?? [],
    missing_skills: job.missing_skills ?? [],
    job_description: job.job_description,
    apply_url: job.apply_url,
    source: job.source,
  }));
}
