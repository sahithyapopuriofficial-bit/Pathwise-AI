import { ai } from "./gemini";
export interface JobRecommendationInput {
  targetRole: string;
  assessmentScore: number;
  interviewScore: number;
  resumeScore: number;
  roadmapProgress: number;
  strongSkills: string[];
  weakSkills: string[];
  missingSkills: string[];
}
export interface JobRecommendation {
  company: string;
  job_title: string;
  employment_type: string;
  work_mode: string;
  location: string;
  match_score: number;
  required_skills: string[];
  missing_skills: string[];
  job_description: string;
  apply_url: string;
  source: string;
}

export async function generateJobRecommendations(
  input: JobRecommendationInput
): Promise<JobRecommendation[]> {
  const prompt = `
You are an expert AI Career Coach.
Recommend EXACTLY 6 jobs.
Candidate Details
Career Goal:
${input.targetRole}
Assessment Score:
${input.assessmentScore}
Interview Score:
${input.interviewScore}
Resume Score:
${input.resumeScore}
Roadmap Progress:
${input.roadmapProgress}%
Strong Skills:
${input.strongSkills.join(", ")}
Weak Skills:
${input.weakSkills.join(", ")}
Missing Skills:
${input.missingSkills.join(", ")}

Return ONLY valid JSON.

Example:

[
{
"company":"Google",
"job_title":"AI Engineer Intern",
"employment_type":"Internship",
"work_mode":"Hybrid",
"location":"Bangalore",
"match_score":94,
"required_skills":["Python","TensorFlow","SQL"],
"missing_skills":["Docker","Kubernetes"],
"job_description":"AI Internship focused on Machine Learning.",
"apply_url":"https://careers.google.com/",
"source":"Google Careers"
}
]

Do not use markdown.

Do not explain.

Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text) as JobRecommendation[];
  } catch {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned) as JobRecommendation[];
  }
}