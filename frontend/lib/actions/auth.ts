"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}
interface SignInData {
  email: string;
  password: string;
}
// ==========================
// SIGN UP
// ==========================
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

// ==========================
// SIGN IN
// ==========================
export async function signIn(data: SignInData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // Server-side redirect after successful login
  redirect("/dashboard");
}

// ==========================
// SIGN OUT
// ==========================
export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/login");
}

