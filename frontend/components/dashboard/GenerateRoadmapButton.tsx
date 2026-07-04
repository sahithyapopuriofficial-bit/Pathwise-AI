"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateRoadmap } from "@/lib/actions/roadmap";

interface GenerateRoadmapButtonProps {
  role: string | null;
  weakSkills: string[];
}

export default function GenerateRoadmapButton({
  role,
  weakSkills,
}: GenerateRoadmapButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleGenerateRoadmap() {
    if (!role) {
      alert("Please select your Career Goal first.");
      return;
    }

    if (weakSkills.length === 0) {
      alert(
        "No weak skills found. Complete a Skill Assessment first."
      );
      return;
    }

    startTransition(async () => {
      const result = await generateRoadmap(role, weakSkills);

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={handleGenerateRoadmap}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Roadmap...
        </>
      ) : (
        "Generate Roadmap →"
      )}
    </Button>
  );
}

