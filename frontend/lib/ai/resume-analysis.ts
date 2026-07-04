import { geminiModel } from "./gemini";

export async function analyzeResume(
  resumeText: string,
  targetRole: string,
  requiredSkills: string[]
) {
  const prompt = `
You are an expert ATS Resume Analyzer.

Target Role:
${targetRole}

Required Skills:
${requiredSkills.join(", ")}

Resume:
${resumeText}

Analyze the resume and return ONLY valid JSON in this exact format:

{
  "ats_score": 0,
  "strengths": [],
  "missing_skills": [],
  "improvements": [],
  "summary": ""
}
`;

  const result = await geminiModel.generateContent(prompt);

  const response = result.response.text();

  return JSON.parse(
    response.replace(/```json/g, "").replace(/```/g, "")
  );
}