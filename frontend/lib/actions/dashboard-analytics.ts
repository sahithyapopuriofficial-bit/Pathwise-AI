"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardAnalytics() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // -------------------------
  // Interviews
  // -------------------------

  const { data: interviews } = await supabase
    .from("mock_interviews")
    .select("*")
    .eq("user_id", user.id);

  const totalInterviews = interviews?.length ?? 0;

  const completedInterviews =
    interviews?.filter(
      (item) => item.overall_score !== null
    ).length ?? 0;

  const highestInterviewScore =
    interviews && interviews.length > 0
      ? Math.max(
          ...interviews.map(
            (item) => item.overall_score ?? 0
          )
        )
      : 0;

  const averageInterviewScore =
    completedInterviews > 0
      ? Math.round(
          interviews!
            .reduce(
              (sum, item) =>
                sum + (item.overall_score ?? 0),
              0
            ) / completedInterviews
        )
      : 0;

  // -------------------------
  // Roadmaps
  // -------------------------

  const { data: roadmaps } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id);

  const totalRoadmaps = roadmaps?.length ?? 0;

  // -------------------------
  // Roadmap Progress
  // -------------------------

  const { data: roadmapProgress } = await supabase
    .from("roadmap_progress")
    .select("*")
    .eq("user_id", user.id);

  const completedRoadmapWeeks =
    roadmapProgress?.filter(
      (item) => item.completed === true
    ).length ?? 0;

  // -------------------------
  // Career Mentor
  // -------------------------

  const { data: chats } = await supabase
    .from("career_chat_history")
    .select("*")
    .eq("user_id", user.id);

  const totalChats = chats?.length ?? 0;

  // -------------------------
  // Resume Analysis
  // -------------------------

  const { data: resume } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  const resumeUploaded = !!resume;

  const resumeScore = resume?.ats_score ?? 0;

  return {
    totalInterviews,
    completedInterviews,
    averageInterviewScore,
    highestInterviewScore,

    totalRoadmaps,
    completedRoadmapWeeks,

    totalChats,

    resumeUploaded,
    resumeScore,
  };
}
