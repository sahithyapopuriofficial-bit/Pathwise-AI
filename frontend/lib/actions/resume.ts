"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// =====================================
// Save Resume Metadata
// =====================================

export async function saveResume(
  fileName: string,
  resumeUrl: string
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

  const { data: existing } = await supabase
    .from("resume_analysis")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let error = null;

  if (existing) {
    const { error: updateError } = await supabase
      .from("resume_analysis")
      .update({
        file_name: fileName,
        resume_url: resumeUrl,
        uploaded_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("resume_analysis")
      .insert({
        user_id: user.id,
        file_name: fileName,
        resume_url: resumeUrl,
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

// =====================================
// Latest Resume
// =====================================

export async function getLatestResume() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

