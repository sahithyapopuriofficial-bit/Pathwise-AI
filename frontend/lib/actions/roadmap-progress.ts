"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ======================================
// Get Roadmap Progress
// ======================================

export async function getRoadmapProgress(
  roadmapId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("roadmap_progress")
    .select("*")
    .eq("roadmap_id", roadmapId)
    .order("week");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// ======================================
// Toggle Week Completion
// ======================================

export async function toggleWeekCompletion(
  roadmapId: string,
  week: number,
  completed: boolean
) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("roadmap_progress")
    .select("id")
    .eq("roadmap_id", roadmapId)
    .eq("week", week)
    .maybeSingle();

  let error = null;

  if (existing) {
    const { error: updateError } = await supabase
      .from("roadmap_progress")
      .update({
        completed,
        completed_at: completed
          ? new Date().toISOString()
          : null,
      })
      .eq("id", existing.id);

    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("roadmap_progress")
      .insert({
        roadmap_id: roadmapId,
        week,
        completed,
        completed_at: completed
          ? new Date().toISOString()
          : null,
      });

    error = insertError;
  }

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}

// ======================================
// Calculate Progress Percentage
// ======================================

export async function getRoadmapCompletion(
  roadmapId: string,
  totalWeeks: number
) {
  const progress = await getRoadmapProgress(roadmapId);

  const completedWeeks = progress.filter(
    (item) => item.completed
  ).length;

  const percentage =
    totalWeeks === 0
      ? 0
      : Math.round(
          (completedWeeks / totalWeeks) * 100
        );

  return {
    completedWeeks,
    totalWeeks,
    percentage,
  };
}

