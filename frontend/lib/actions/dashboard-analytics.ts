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

  // ==========================================================
  // Interview Analytics
  // ==========================================================

  const { data: interviews, error: interviewError } = await supabase
    .from("mock_interviews")
    .select("overall_score")
    .eq("user_id", user.id);

  if (interviewError) {
    console.error("Interview Analytics Error:", interviewError);
  }

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
          interviews!.reduce(
            (sum, item) =>
              sum + (item.overall_score ?? 0),
            0
          ) / completedInterviews
        )
      : 0;

  // ==========================================================
  // Roadmaps
  // ==========================================================

  const { data: roadmaps, error: roadmapError } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (roadmapError) {
    console.error("Roadmap Error:", roadmapError);
  }

  const totalRoadmaps = roadmaps?.length ?? 0;

  // ==========================================================
  // Latest Roadmap Progress
  // ==========================================================

  let completedRoadmapWeeks = 0;
  let roadmapCompletion = 0;

  if (roadmaps && roadmaps.length > 0) {
    const latestRoadmapId = roadmaps[0].id;

    const {
      data: roadmapProgress,
      error: progressError,
    } = await supabase
      .from("roadmap_progress")
      .select("*")
      .eq("roadmap_id", latestRoadmapId);

    if (progressError) {
      console.error(
        "Roadmap Progress Error:",
        progressError
      );
    }

    completedRoadmapWeeks =
      roadmapProgress?.filter(
        (week) => week.completed
      ).length ?? 0;

    roadmapCompletion =
      roadmapProgress && roadmapProgress.length > 0
        ? Math.round(
            (completedRoadmapWeeks /
              roadmapProgress.length) *
              100
          )
        : 0;
  }

  // ==========================================================
  // Career Mentor
  // ==========================================================

  const { data: chats, error: chatError } = await supabase
    .from("career_chat_history")
    .select("id")
    .eq("user_id", user.id);

  if (chatError) {
    console.error("Career Chat Error:", chatError);
  }

  const totalChats = chats?.length ?? 0;

  // ==========================================================
  // Resume Analytics
  // ==========================================================

  const {
    data: resumes,
    error: resumeError,
  } = await supabase
    .from("resume_analysis")
    .select("ats_score, uploaded_at")
    .eq("user_id", user.id)
    .not("ats_score", "is", null)
    .order("uploaded_at", {
      ascending: true,
    });

  if (resumeError) {
    console.error("Resume Error:", resumeError);
  }

  const resumeUploaded =
    (resumes?.length ?? 0) > 0;

  const latestResume =
    resumes && resumes.length > 0
      ? resumes[resumes.length - 1]
      : null;

  const resumeScore =
    latestResume?.ats_score ?? 0;

  const resumeHistory =
    resumes?.map((resume) => ({
      date: new Date(
        resume.uploaded_at
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      score: resume.ats_score ?? 0,
    })) ?? [];

  console.log("Dashboard Analytics");
  console.log({
    totalInterviews,
    completedRoadmapWeeks,
    roadmapCompletion,
    resumeScore,
    resumeHistory,
  });

  return {
    // Interview
    totalInterviews,
    completedInterviews,
    averageInterviewScore,
    highestInterviewScore,

    // Roadmaps
    totalRoadmaps,
    completedRoadmapWeeks,
    roadmapCompletion,

    // Career Mentor
    totalChats,

    // Resume
    resumeUploaded,
    resumeScore,
    resumeHistory,
  };
}