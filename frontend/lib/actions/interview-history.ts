"use server";

import { createClient } from "@/lib/supabase/server";

export async function getInterviewHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("mock_interviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getInterviewStats() {
  const interviews = await getInterviewHistory();

  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (item) => item.overall_score !== null
  ).length;

  const highestScore =
    interviews.length > 0
      ? Math.max(
          ...interviews.map((item) => item.overall_score ?? 0)
        )
      : 0;

  const averageScore =
    completedInterviews > 0
      ? Math.round(
          interviews.reduce(
            (sum, item) => sum + (item.overall_score ?? 0),
            0
          ) / completedInterviews
        )
      : 0;

  return {
    totalInterviews,
    completedInterviews,
    highestScore,
    averageScore,
  };
}