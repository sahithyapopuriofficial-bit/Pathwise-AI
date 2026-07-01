"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  saveAssessment,
  saveAssessmentSkills,
} from "@/lib/actions/assessment";

interface Skill {
  id: string;
  skill_name: string;
  importance: number;
}

interface SkillAssessmentDialogProps {
  roleName: string;
  skills: Skill[];
}

export default function SkillAssessmentDialog({
  roleName,
  skills,
}: SkillAssessmentDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [ratings, setRatings] = useState<Record<string, number>>({});

  const [isPending, startTransition] = useTransition();

  const score = useMemo(() => {
    if (skills.length === 0) return 0;

    const total = skills.reduce((sum, skill) => {
      return sum + (ratings[skill.id] ?? 0);
    }, 0);

    return Math.round((total / (skills.length * 5)) * 100);
  }, [ratings, skills]);

  function updateRating(skillId: string, value: number) {
    setRatings((prev) => ({
      ...prev,
      [skillId]: value,
    }));
  }

  function handleSubmit() {
  startTransition(async () => {
    const result = await saveAssessment(roleName, score);

    console.log("Assessment Result:", result);
    console.log("Skills:", skills);
    console.log("Ratings:", ratings);

    if (!result.success || !result.assessmentId) {
      alert(result.message ?? "Unable to save assessment.");
      return;
    }

    const skillsResult = await saveAssessmentSkills(
      result.assessmentId,
      ratings,
      skills
    );

    console.log("Save Skills Result:", skillsResult);

    if (!skillsResult.success) {
      alert(skillsResult.message);
      return;
    }

    setOpen(false);
    router.refresh();
  });
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Start Assessment</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Skill Assessment</DialogTitle>

          <DialogDescription>
            Rate your confidence for each required skill.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] space-y-5 overflow-y-auto py-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="space-y-3 rounded-xl border p-4"
            >
              <Label className="font-semibold">
                {skill.skill_name}
              </Label>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={
                      ratings[skill.id] === level
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateRating(skill.id, level)
                    }
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-sm text-slate-600">
            Current Readiness Score
          </p>

          <p className="text-4xl font-bold text-blue-600">
            {score}%
          </p>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending
              ? "Saving Assessment..."
              : "Submit Assessment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

