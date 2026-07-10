"use client";

import { useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MockInterviewCard() {
  const [difficulty, setDifficulty] = useState("Medium");
  const [type, setType] = useState("Technical");
  const [loading, setLoading] = useState(false);

  async function startInterview() {
    setLoading(true);

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty,
          interviewType: type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      window.location.href = `/dashboard/mock-interview/${data.interviewId}`;
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to start interview."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">

      <div className="flex items-center gap-3">
        <Mic className="h-8 w-8 text-purple-600" />

        <div>
          <h2 className="text-2xl font-bold">
            AI Mock Interview
          </h2>

          <p className="text-slate-500">
            Practice interviews generated specifically for you.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">

        <div>
          <label className="mb-2 block font-medium">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Interview Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option>Technical</option>
            <option>HR</option>
            <option>Mixed</option>
          </select>
        </div>

        <Button
          onClick={startInterview}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Interview...
            </>
          ) : (
            "Start AI Interview"
          )}
        </Button>

      </div>
    </div>
  );
}