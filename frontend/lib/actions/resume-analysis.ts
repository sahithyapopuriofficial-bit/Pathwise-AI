"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
interface ResumeAnalysisResult {
  ats_score: number;
  strengths: string[];
  missing_skills: string[];
  improvements: string[];
  summary: string;
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
  const { data: resume } = await supabase
    .from("resume_analysis")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!resume) {
    return {
      success: false,
      message: "Resume not uploaded.",
    };
  }
  const { error } = await supabase
    .from("resume_analysis")
    .update({
      ats_score: analysis.ats_score,
      strengths: analysis.strengths,
      missing_skills: analysis.missing_skills,
      improvements: analysis.improvements,
      ai_summary: analysis.summary,
      analyzed_at: new Date().toISOString(),
    })
    .eq("id", resume.id);

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
    .maybeSingle();

  return data;
}

