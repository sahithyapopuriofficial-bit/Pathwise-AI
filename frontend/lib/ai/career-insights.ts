import { ai } from "./gemini";

export interface CareerInsightsInput {
  targetRole: string;

  assessmentScore: number;

  interviewScore: number;

  resumeScore: number;

  roadmapProgress: number;

  strongSkills: string[];

  weakSkills: string[];

  missingSkills: string[];

  resumeSummary: string;
}

export interface CareerInsightsOutput {
  readiness_score: number;

  strengths: string[];

  weaknesses: string[];

  next_steps: string[];

  summary: string;
}

export async function generateCareerInsights(
  input: CareerInsightsInput
): Promise<CareerInsightsOutput> {
  const prompt = `
You are an experienced AI Career Coach.

Analyze the candidate information below and generate professional career insights.

Target Role:
${input.targetRole}

Assessment Score:
${input.assessmentScore}

Interview Score:
${input.interviewScore}

Resume Score:
${input.resumeScore}

Roadmap Progress:
${input.roadmapProgress}

Strong Skills:
${input.strongSkills.join(", ")}

Weak Skills:
${input.weakSkills.join(", ")}

Missing Skills:
${input.missingSkills.join(", ")}

Resume Summary:
${input.resumeSummary}

Return ONLY valid JSON.

Format:

{
  "readiness_score":85,

  "strengths":[
    "...",
    "...",
    "..."
  ],

  "weaknesses":[
    "...",
    "...",
    "..."
  ],

  "next_steps":[
    "...",
    "...",
    "..."
  ],

  "summary":"A concise 3-5 sentence summary explaining the candidate's current career readiness, strongest areas, biggest weaknesses, and immediate next steps."
}

Rules:

- readiness_score must be between 0 and 100.
- Give exactly 3 strengths.
- Give exactly 3 weaknesses.
- Give exactly 3 next_steps.
- Summary should be concise and professional.
- Return ONLY JSON.
- No markdown.
- No explanation.
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

  return JSON.parse(cleaned);
}