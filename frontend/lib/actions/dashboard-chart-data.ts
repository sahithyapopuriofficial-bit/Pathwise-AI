"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardChartData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // ==========================================
  // Interview History
  // ==========================================

  const { data: interviews } = await supabase
    .from("mock_interviews")
    .select("overall_score, created_at")
    .eq("user_id", user.id)
    .not("overall_score", "is", null)
    .order("created_at", { ascending: true });

  const interviewChart =
    interviews?.map((item, index) => ({
      name: `Interview ${index + 1}`,
      score: item.overall_score,
      date: item.created_at,
    })) ?? [];

  // ==========================================
  // Resume History
  // ==========================================

  const { data: resumes } = await supabase
    .from("resume_analysis")
    .select("ats_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const resumeChart =
    resumes?.map((item, index) => ({
      name: `Resume ${index + 1}`,
      score: item.ats_score ?? 0,
      date: item.created_at,
    })) ?? [];

  // ==========================================
  // Assessment History
  // ==========================================

  const { data: assessments } = await supabase
    .from("assessments")
    .select("score, completed_at")
    .eq("user_id", user.id)
    .not("score", "is", null)
    .order("completed_at", { ascending: true });

  const assessmentChart =
    assessments?.map((item, index) => ({
      name: `Assessment ${index + 1}`,
      score: item.score,
      date: item.completed_at,
    })) ?? [];

  // ==========================================
  // Roadmap Progress
  // ==========================================

  const { data: progress } = await supabase
    .from("roadmap_progress")
    .select(`
      week,
      completed,
      roadmaps!inner(user_id)
    `)
    .eq("roadmaps.user_id", user.id)
    .order("week");

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
