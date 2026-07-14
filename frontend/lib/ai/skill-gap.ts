import { getGeminiClient } from "./gemini";

export interface SkillGapResult {
  matched_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  match_percentage: number;
  ai_feedback: string;
}

export async function analyzeSkillGap(
  extractedSkills: string[],
  requiredSkills: string[],
  targetRole: string
): Promise<SkillGapResult> {
  const normalizedResume = extractedSkills.map((skill) =>
    skill.trim().toLowerCase()
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    normalizedResume.includes(skill.toLowerCase())
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedResume.includes(skill.toLowerCase())
  );

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  const prompt = `
You are an expert AI Career Mentor.

The user wants to become: ${targetRole}

Matched Skills: ${matchedSkills.join(", ") || "None"}

Missing Skills: ${missingSkills.join(", ") || "None"}

Return ONLY valid JSON.

The JSON MUST follow this structure:
{
  "match_percentage": 80,
  "matched_skills": [],
  "missing_skills": [],
  "recommended_skills": [],
  "ai_feedback": ""
}

Do not return markdown.
Do not return explanations.
Return JSON only.
`;

  const response = await getGeminiClient().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);

    return {
      matched_skills: Array.isArray(parsed.matched_skills)
        ? parsed.matched_skills.filter((skill: unknown): skill is string => typeof skill === "string")
        : matchedSkills,
      missing_skills: Array.isArray(parsed.missing_skills)
        ? parsed.missing_skills.filter((skill: unknown): skill is string => typeof skill === "string")
        : missingSkills,
      recommended_skills: Array.isArray(parsed.recommended_skills)
        ? parsed.recommended_skills.filter((skill: unknown): skill is string => typeof skill === "string")
        : [],
      match_percentage:
        typeof parsed.match_percentage === "number"
          ? parsed.match_percentage
          : matchPercentage,
      ai_feedback:
        typeof parsed.ai_feedback === "string"
          ? parsed.ai_feedback
          : "No recommendation available.",
    };
  } catch {
    console.error("Gemini Response:", cleaned);

    throw new Error("Failed to parse Gemini Skill Gap response.");
  }
}
