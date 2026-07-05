import { ai } from "./gemini";

export interface ResumeAnalysisResult {
  ats_score: number;
  strengths: string[];
  missing_skills: string[];
  improvements: string[];
  summary: string;
}

export async function analyzeResume(
  resumeText: string,
  targetRole: string,
  requiredSkills: string[]
): Promise<ResumeAnalysisResult> {
  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume for the role of:

${targetRole}

Required Skills:
${requiredSkills.join(", ")}

Resume:

${resumeText}

Evaluate the resume and return ONLY valid JSON.

The JSON format MUST be:

{
  "ats_score": 85,
  "strengths": [
    "Strong React knowledge",
    "Good frontend development experience"
  ],
  "missing_skills": [
    "Docker",
    "CI/CD"
  ],
  "improvements": [
    "Add measurable achievements.",
    "Include GitHub projects.",
    "Mention leadership experience."
  ],
  "summary": "Overall this resume is suitable for a frontend developer but needs stronger project descriptions and additional cloud-related skills."
}

Do NOT return markdown.
Do NOT return explanation.
Return ONLY JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Response:", cleaned);

    throw new Error("Failed to parse Gemini response.");
  }
}