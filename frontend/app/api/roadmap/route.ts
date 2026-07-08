import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRoadmap } from "@/lib/actions/roadmap";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // Get user's target role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("target_role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        {
          success: false,
          message: profileError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!profile?.target_role) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select your Career Goal first.",
        },
        {
          status: 400,
        }
      );
    }

    // Generate roadmap
    const result = await generateRoadmap(profile.target_role);

    if (!result.success) {
      return NextResponse.json(
        result,
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        roadmap: result.roadmap,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate roadmap.",
      },
      {
        status: 500,
      }
    );
  }
}