"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ==============================
// Get Current User Profile
// ==============================

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Get Profile Error:", error.message);
    return null;
  }

  return data;
}

// ==============================
// Get All Career Roles
// ==============================

export async function getCareerRoles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("career_roles")
    .select("*")
    .order("role_name", { ascending: true });

  if (error) {
    console.error("Career Roles Error:", error.message);
    return [];
  }

  return data;
}

// ==============================
// Update Target Career
// ==============================

export async function updateTargetRole(targetRole: string) {
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

  const { error } = await supabase
    .from("profiles")
    .update({
      target_role: targetRole,
    })
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Career goal updated successfully.",
  };
}

