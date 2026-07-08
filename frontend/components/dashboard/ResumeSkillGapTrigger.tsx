"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ResumeSkillGapTrigger() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeSkillGap = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/skill-gap", {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to analyze skill gap.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze skill gap."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Button
        type="button"
        onClick={handleAnalyzeSkillGap}
        disabled={loading}
        className="min-w-[180px]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Skill Gap"
        )}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
