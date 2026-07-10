import { NextRequest, NextResponse } from "next/server";
import { sendMessageToCareerMentor } from "@/lib/actions/career-mentor";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await sendMessageToCareerMentor(message);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 401,
      });
    }

    return NextResponse.json(
      {
        success: true,
        response: result.response,
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
        message: "Failed to generate AI response.",
      },
      {
        status: 500,
      }
    );
  }
}