"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProgressData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // ==========================================
  // Resume Analysis
  // ==========================================

  const { data: resumes } = await supabase
    .from("resume_analysis")
    .select("ats_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const latestResumeScore =
    resumes && resumes.length > 0
      ? resumes[resumes.length - 1].ats_score ?? 0
      : 0;

  // ==========================================
  // Mock Interviews
  // ==========================================

  const { data: interviews } = await supabase
    .from("mock_interviews")
    .select("overall_score, created_at")
    .eq("user_id", user.id)
    .not("overall_score", "is", null)
    .order("created_at", { ascending: true });

  const highestInterviewScore =
    interviews && interviews.length > 0
      ? Math.max(...interviews.map((i) => i.overall_score ?? 0))
      : 0;

  const averageInterviewScore =
    interviews && interviews.length > 0
      ? Math.round(
          interviews.reduce(
            (sum, i) => sum + (i.overall_score ?? 0),
            0
          ) / interviews.length
        )
      : 0;

  // ==========================================
  // Assessments
  // ==========================================

  const { data: assessments } = await supabase
    .from("assessments")
    .select("score")
    .eq("user_id", user.id)
    .not("score", "is", null);

  const assessmentAverage =
    assessments && assessments.length > 0
      ? Math.round(
          assessments.reduce(
            (sum, a) => sum + (a.score ?? 0),
            0
          ) / assessments.length
        )
      : 0;

  // ==========================================
  // Roadmap Progress
  // ==========================================

  const { data: roadmapProgress } = await supabase
    .from("roadmap_progress")
    .select(`
      completed,
      roadmap_id,
      roadmaps!inner(user_id)
    `)
    .eq("roadmaps.user_id", user.id);

  const totalWeeks = roadmapProgress?.length ?? 0;

  const completedWeeks =
    roadmapProgress?.filter((r) => r.completed).length ?? 0;

  const roadmapCompletion =
    totalWeeks > 0
      ? Math.round((completedWeeks / totalWeeks) * 100)
      : 0;

  // ==========================================
  // AI Mentor Sessions
  // ==========================================

  const { data: mentorSessions } = await supabase
    .from("career_chat_history")
    .select("id")
    .eq("user_id", user.id);

  const mentorCount = mentorSessions?.length ?? 0;

  // ==========================================
  // Career Readiness
  // ==========================================

  const careerReadiness = Math.round(
    latestResumeScore * 0.3 +
      averageInterviewScore * 0.3 +
      assessmentAverage * 0.2 +
      roadmapCompletion * 0.2
  );

  // ==========================================
  // Achievements
  // ==========================================

  const achievements: string[] = [];

  if (latestResumeScore >= 80)
    achievements.push("ATS Score 80+");

  if (completedWeeks >= 4)
    achievements.push("Completed 4 Roadmap Weeks");

  if (mentorCount >= 10)
    achievements.push("AI Mentor Explorer");

  if (highestInterviewScore >= 85)
    achievements.push("Interview Master");

  if (careerReadiness >= 75)
    achievements.push("Career Ready");

  // ==========================================
  // AI Insights
  // ==========================================

  const aiInsights: string[] = [];

  if (latestResumeScore < 80)
    aiInsights.push(
      "Improve your resume to increase your ATS score."
    );

  if (roadmapCompletion < 100)
    aiInsights.push(
      "Complete more roadmap weeks to improve your career readiness."
    );

  if (averageInterviewScore < 75)
    aiInsights.push(
      "Practice additional mock interviews to improve confidence."
    );

  // ==========================================
  // Next Actions
  // ==========================================

  const nextActions: string[] = [
    "Complete your next roadmap week",
    "Take a new mock interview",
    "Improve your resume ATS score",
    "Chat with the AI Career Mentor",
  ];

  return {
  overview: {
    careerReadiness,
    streak: completedWeeks,
    learningDays: totalWeeks,
  },

  summary: {
    resumeScore: latestResumeScore,
    highestInterviewScore,
    averageInterviewScore,
    assessmentAverage,
    roadmapCompletion,
    completedWeeks,
    mentorSessions: mentorCount,
  },

  charts: {
    resumeHistory:
      resumes?.map((item) => ({
        date: new Date(item.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        score: item.ats_score ?? 0,
      })) ?? [],

    interviewHistory:
      interviews?.map((item) => ({
        date: new Date(item.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        score: item.overall_score ?? 0,
      })) ?? [],
  },

  achievements,
  aiInsights,
  nextActions,
};
}