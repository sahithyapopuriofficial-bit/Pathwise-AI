"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ROADMAPS,
  RoadmapStep,
} from "@/lib/roadmap-templates";

// ==============================
// Generate AI Roadmap
// ==============================

export async function generateRoadmap(
  role: string,
  weakSkills: string[]
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

  const template = ROADMAPS[role];

  if (!template) {
    return {
      success: false,
      message: "Roadmap template not found.",
    };
  }

  // Prioritize weak skills in the roadmap
  const roadmap: RoadmapStep[] = [...template].sort((a, b) => {
    const aWeak = weakSkills.some((skill) =>
      a.title.toLowerCase().includes(skill.toLowerCase())
    );

    const bWeak = weakSkills.some((skill) =>
      b.title.toLowerCase().includes(skill.toLowerCase())
    );

    if (aWeak && !bWeak) return -1;
    if (!aWeak && bWeak) return 1;

    return a.week - b.week;
  });

  // Re-number weeks after sorting
  roadmap.forEach((step, index) => {
    step.week = index + 1;
  });

  const estimatedDuration = roadmap.length;

  // Check if the user already has a roadmap
  const { data: existingRoadmap } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let error = null;

  if (existingRoadmap) {
    // Update existing roadmap
    const { error: updateError } = await supabase
      .from("roadmaps")
      .update({
        generated_plan: roadmap,
        estimated_duration: estimatedDuration,
        created_at: new Date().toISOString(),
      })
      .eq("id", existingRoadmap.id);

    error = updateError;
  } else {
    // Insert first roadmap
    const { error: insertError } = await supabase
      .from("roadmaps")
      .insert({
        user_id: user.id,
        generated_plan: roadmap,
        estimated_duration: estimatedDuration,
      });

    error = insertError;
  }

  if (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    roadmap,
  };
}

// ==============================
// Get Latest Roadmap
// ==============================

export async function getLatestRoadmap() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

