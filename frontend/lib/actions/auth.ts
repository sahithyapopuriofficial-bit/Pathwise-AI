"use server";

import { createClient } from "@/lib/supabase/server";

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Account created successfully! Please check your email to verify your account.",
  };
}