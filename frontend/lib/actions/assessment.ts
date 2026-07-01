"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// =====================================
// Get Skills Required For Target Role
// =====================================

export async function getRoleSkills(roleName: string) {
  const supabase = await createClient();

  // Find the role ID
  const { data: role, error: roleError } = await supabase
    .from("career_roles")
    .select("id")
    .eq("role_name", roleName)
    .single();

  if (roleError || !role) {
    console.error(roleError?.message);
    return [];
  }

  // Fetch skills for that role
  const { data: skills, error } = await supabase
    .from("role_skills")
    .select("*")
    .eq("role_id", role.id)
    .order("importance", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return skills;
}

// =====================================
// Save Assessment Result
// =====================================

export async function saveAssessment(
  roleName: string,
  score: number
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

  // Get Role ID
  const { data: role } = await supabase
    .from("career_roles")
    .select("id")
    .eq("role_name", roleName)
    .single();

  if (!role) {
    return {
      success: false,
      message: "Career role not found.",
    };
  }

  const { error } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      role_id: role.id,
      score,
      status: "completed",
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
    message: "Assessment saved successfully.",
  };
}

// =====================================
// Get Latest Assessment
// =====================================

export async function getLatestAssessment() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

