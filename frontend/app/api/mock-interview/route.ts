import { NextRequest, NextResponse } from "next/server";
import { createMockInterview } from "@/lib/actions/mock-interview";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const difficulty = body.difficulty ?? "Medium";
    const interviewType = body.interviewType ?? "Technical";

    const result = await createMockInterview(
      difficulty,
      interviewType
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      interviewId: result.interviewId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}