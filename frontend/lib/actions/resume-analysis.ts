"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ResumeAnalysisResult {
  ats_score: number;
  strengths: string[];
  missing_skills: string[];
  improvements: string[];
  summary: string;
  extracted_skills?: string[];
}

export async function saveResumeAnalysis(
  analysis: ResumeAnalysisResult
) {
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

  // Get the most recently uploaded resume (contains file info)
  const { data: latestResume, error: resumeError } =
    await supabase
      .from("resume_analysis")
      .select(
        "file_name, resume_text, resume_url, uploaded_at"
      )
      .eq("user_id", user.id)
      .order("uploaded_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  if (resumeError) {
    return {
      success: false,
      message: resumeError.message,
    };
  }

  if (!latestResume) {
    return {
      success: false,
      message: "Resume not uploaded.",
    };
  }

  // Create a NEW history row instead of updating the old one
  const { error } = await supabase
    .from("resume_analysis")
    .insert({
      user_id: user.id,
      file_name: latestResume.file_name,
      resume_text: latestResume.resume_text,
      resume_url: latestResume.resume_url,
      uploaded_at: new Date().toISOString(),
      ats_score: analysis.ats_score,
      strengths: analysis.strengths,
      missing_skills: analysis.missing_skills,
      improvements: analysis.improvements,
      ai_summary: analysis.summary,
      extracted_skills:
        analysis.extracted_skills ?? [],
      analyzed_at: new Date().toISOString(),
    });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Resume analyzed successfully.",
  };
}

// Latest resume (for dashboard cards)
export async function getResumeAnalysis() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("user_id", user.id)
    .order("uploaded_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  return data;
}

// Full history (for analytics charts)
export async function getResumeAnalysisHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("resume_analysis")
    .select("ats_score, uploaded_at")
    .eq("user_id", user.id)
    .order("uploaded_at", {
      ascending: true,
    });

  return data ?? [];
}