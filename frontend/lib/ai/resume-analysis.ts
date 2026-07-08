import { ai } from "./gemini";

type ResumeAnalysisInput =
  | string
  | { kind: "text"; text: string }
  | { kind: "file"; file: Blob; mimeType: string };

export interface ResumeAnalysisResult {
  ats_score: number;
  strengths: string[];
  missing_skills: string[];
  improvements: string[];
  summary: string;
}

export async function analyzeResume(
  resumeInput: ResumeAnalysisInput,
  targetRole: string,
  requiredSkills: string[]
): Promise<ResumeAnalysisResult> {
  const resolvedText =
    typeof resumeInput === "string"
      ? resumeInput
      : resumeInput.kind === "text"
        ? resumeInput.text
        : "";

  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume for the role of:

${targetRole}

Required Skills:
${requiredSkills.join(", ")}

Resume:

${resolvedText}

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

  let contents: string | Array<{ role: string; parts: Array<{ text: string } | { fileData: { fileUri: string; mimeType: string } }> }> = prompt;

  if (typeof resumeInput !== "string" && resumeInput.kind === "file") {
    const uploadedFile = await ai.files.upload({
      file: resumeInput.file,
      config: {
        mimeType: resumeInput.mimeType,
      },
    });

    contents = [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            fileData: {
              fileUri: uploadedFile.uri ?? "",
              mimeType: resumeInput.mimeType,
            },
          },
        ],
      },
    ];
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  const text = response.text ?? "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Gemini Response:", cleaned);

    throw new Error("Failed to parse Gemini response.");
  }
}