"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateRoadmapButtonProps {
  role: string | null;
}

export default function GenerateRoadmapButton({
  role,
}: GenerateRoadmapButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleGenerateRoadmap = async () => {
    if (!role) {
      alert("Please select your Career Goal first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/roadmap", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      disabled={loading}
      onClick={handleGenerateRoadmap}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Roadmap...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate AI Roadmap
        </>
      )}
    </Button>
  );
}