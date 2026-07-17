import { Code2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function extractSkills(extractedSkills: unknown): string[] {
  if (Array.isArray(extractedSkills)) {
    return extractedSkills.filter((skill): skill is string => typeof skill === "string");
  }

  if (typeof extractedSkills === "object" && extractedSkills !== null) {
    return Object.values(extractedSkills).flatMap((value) =>
      Array.isArray(value)
        ? value.filter((skill): skill is string => typeof skill === "string")
        : typeof value === "string"
          ? [value]
          : []
    );
  }

  return [];
}

export default function SkillsCard({ extractedSkills }: { extractedSkills: unknown }) {
  const skills = [...new Set(extractSkills(extractedSkills))];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Technical Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            <Code2 className="h-4 w-4" aria-hidden="true" />
            Upload and analyze a resume to see your extracted skills.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
