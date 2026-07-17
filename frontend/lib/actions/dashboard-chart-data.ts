"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardChartData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // ==========================================
  // Interview History
  // ==========================================

  const { data: interviews, error: interviewError } = await supabase
    .from("mock_interviews")
    .select("overall_score, created_at")
    .eq("user_id", user.id)
    .not("overall_score", "is", null)
    .order("created_at", { ascending: true });

  if (interviewError) {
    console.error("Interview Chart Error:", interviewError);
  }

  const interviewChart =
    interviews?.map((item, index) => ({
      name: `Interview ${index + 1}`,
      score: item.overall_score ?? 0,
      date: new Date(item.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    })) ?? [];

  // ==========================================
  // Resume History
  // ==========================================

  const { data: resumes, error: resumeError } = await supabase
    .from("resume_analysis")
    .select("ats_score, uploaded_at")
    .eq("user_id", user.id)
    .not("ats_score", "is", null)
    .order("uploaded_at", { ascending: true });

  if (resumeError) {
    console.error("Resume Chart Error:", resumeError);
  }

  const resumeChart =
    resumes?.map((item, index) => ({
      name: `Resume ${index + 1}`,
      score: item.ats_score ?? 0,
      date: new Date(item.uploaded_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    })) ?? [];

  console.log("Resume Chart Data:", resumeChart);

  // ==========================================
  // Assessment History
  // ==========================================

  const { data: assessments, error: assessmentError } = await supabase
    .from("assessments")
    .select("score, completed_at")
    .eq("user_id", user.id)
    .not("score", "is", null)
    .order("completed_at", { ascending: true });

  if (assessmentError) {
    console.error("Assessment Chart Error:", assessmentError);
  }

  const assessmentChart =
    assessments?.map((item, index) => ({
      name: `Assessment ${index + 1}`,
      score: item.score ?? 0,
      date: new Date(item.completed_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    })) ?? [];

  // ==========================================
  // Roadmap Progress
  // ==========================================

  const { data: progress, error: roadmapError } = await supabase
    .from("roadmap_progress")
    .select(`
      week,
      completed,
      roadmaps!inner(user_id)
    `)
    .eq("roadmaps.user_id", user.id)
    .order("week", { ascending: true });

  if (roadmapError) {
    console.error("Roadmap Chart Error:", roadmapError);
  }

  const roadmapChart =
    progress?.map((item) => ({
      week: `Week ${item.week}`,
      progress: item.completed ? 100 : 0,
    })) ?? [];

  return {
    interviewChart,
    resumeChart,
    assessmentChart,
    roadmapChart,
  };
}