"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUp(
  fullName: string,
  email: string,
  password: string
) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return {
    error: error?.message ?? null,
  };
}